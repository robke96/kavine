import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

const MatchingButtons = (userId: string) => {
  return new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("swipe_no")
        .setEmoji("1341435186059153458")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`swipe_yes:${userId}`)
        .setEmoji("1341435098456784916")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false)
    );
};

export default MatchingButtons;
