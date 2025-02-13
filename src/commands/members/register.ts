import ChannelCard from '@/components/cards/ChannelCard';
import { type SlashCommandT } from './../../core/client';
import { MessageFlags, SlashCommandBuilder, type Interaction } from "discord.js";

const command: SlashCommandT = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription('test command'),
    async execute(interaction) {
        const name =  "Labas " + "name222 22"

        const icon = interaction.user.displayAvatarURL({ forceStatic: true, extension: 'jpeg' })
        const card = await ChannelCard(icon, name, 'REGISTRACIJA')

        interaction.reply({ files: [card], flags: MessageFlags.Ephemeral });
    }
}

export default command;