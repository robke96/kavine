import type DiscordClient from "../client";
import { Events, REST, Routes, type Interaction, type SlashCommandBuilder } from "discord.js";
import path from "node:path";
import { Glob } from "bun";

export async function registerSlashCommands(client: DiscordClient) {
    const commands: SlashCommandBuilder[] = []
    const glob = new Glob('src/commands/**/*.ts');

    for await (const filePath of glob.scan('.')) {
        const command = (await import (path.resolve(filePath))).default;

        commands.push(command.data);
        client.slashCommandsCollection.set(command.data.name, command);
    };

    const token = process.env.BOT_TOKEN as string;
    const rest = new REST().setToken(token);

    (async () => {
        try {
            // The put method is used to fully refresh all commands in the guild with the current set
            const config = client.config;
            if (!config) return;

            const {botId, guildId} = config;
            
            await rest.put(
                Routes.applicationGuildCommands(botId, guildId),
                { body: commands },
            );
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();
}

// Slash command handler
export function slashCommandHandler(client: DiscordClient) {
    client.on(Events.InteractionCreate, (interaction: Interaction) => {
        if(!interaction.isChatInputCommand()) return;

        const command = client.slashCommandsCollection.get(interaction.commandName);

        try {
            if (command) command.execute(interaction);
        } catch (error: any) {
            console.error("Command handler:");
            interaction.reply({ content: error.message, ephemeral: true });
        }
    })
}