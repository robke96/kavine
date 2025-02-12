import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

const VerificationButtons = () => {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
        .setCustomId('_1')
        .setEmoji('1126456509308608573')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)
        ).addComponents(
        new ButtonBuilder()
        .setCustomId('registracijaButton')
        .setLabel('PRISIJUNK')
        .setStyle(ButtonStyle.Success)
        ).addComponents(
        new ButtonBuilder()
        .setCustomId('_3')
        .setEmoji('1126456509308608573')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)
    )
}

export default VerificationButtons;