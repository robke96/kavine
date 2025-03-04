import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

const ProfileEditButtons = () => {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
        .setCustomId('change_name')
        .setLabel('VARDAS')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false)
        ).addComponents(
        new ButtonBuilder()
        .setCustomId('change_age')
        .setLabel('METAI')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false)
        ).addComponents(
        new ButtonBuilder()
        .setCustomId('change_description')
        .setLabel('APRAŠYMAS')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false)
        )
        
}

export default ProfileEditButtons;