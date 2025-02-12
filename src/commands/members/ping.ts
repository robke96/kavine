import { type SlashCommandT } from './../../core/client';
import { MessageFlags, SlashCommandBuilder, type Interaction } from "discord.js";

const command: SlashCommandT = {
    data: new SlashCommandBuilder()
        .setName("pingas")
        .setDescription('test command'),
    async execute(interaction) {
        interaction.reply({ content: "Slash command veikia", flags: MessageFlags.Ephemeral });
    }
}

export default command;