import { botId, guildId, systems } from "@/config/botConfig.json";
import type DiscordClient from "../client";
import { Events, REST, Routes, type Interaction, type SlashCommandBuilder } from "discord.js";
import path from "node:path";
import { readdirSync } from "node:fs";

export function registerSlashCommands(client: DiscordClient): void {
    if (!systems.slashCommands) return;

    const commands: SlashCommandBuilder[] = []
    const commandsPath = path.join(__dirname, "../../../src/commands")
    const commandsFolder = readdirSync(commandsPath);
    
    for (const folder of commandsFolder) {
        const folderPath = path.join(commandsPath, folder);
        const commandFiles = readdirSync(folderPath).filter(file => file.match(/(j|t)s$/));

        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);
            const cmd = require(filePath).default;

            commands.push(cmd.data);
            client.slashCommandsCollection.set(cmd.data.name, cmd);
        }
    }

    const token = process.env.BOT_TOKEN as string;
    const rest = new REST().setToken(token);

    (async () => {
        try {
            // The put method is used to fully refresh all commands in the guild with the current set
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