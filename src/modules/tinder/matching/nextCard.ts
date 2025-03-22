import MatchingButtons from "@/components/buttons/Matching";
import type DiscordClient from "@/core/client";
import type { AttachmentBuilder, ButtonInteraction, CacheType } from "discord.js";
import startSwiping from "./startSwiping";

const nextCard = async (interaction: ButtonInteraction<CacheType>, client: DiscordClient) => {
    const cardList = client.cardsCollection.get(interaction.user.id);
    if (!cardList) return;

    if (cardList.length == 0) {
      return await startSwiping(interaction, client, true);
        // return interaction.update({ files: [], content: "Dėja, bet peržiūrėjot visas korteles.", components: [], })
    }

    const randomUser = cardList[Math.random() * cardList.length | 0];
    const filename = randomUser.split("/").pop();
    const userId = filename?.split('.')[0];
    if (!userId) return;

    const buttons = MatchingButtons(userId);
    if (!buttons) return;

    interaction.update({ files: [randomUser], components: [buttons] });

    const newList = cardList.filter(i => i !== randomUser);
    client.cardsCollection.set(interaction.user.id, newList);
}

export default nextCard;
