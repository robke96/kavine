import type DiscordClient from "@/core/client";
import dayjs from "dayjs";
import type { ButtonInteraction, CacheType } from "discord.js";

// Auto close interactions if user didn't closed it. 
// Anti duplication of interaction, every channel can have max 1 ephemeral interaction, if same button was pressed, previous interaction is deleted.

const autoClose = async (c: DiscordClient, interaction: ButtonInteraction<CacheType>) => {
    const message = await interaction.fetchReply()
    let userLastInteraction = c.lastInteraction.get(`${interaction.user.id}:${message.channelId}`);
    const fiveMinutes = 1 * 60 * 1000;
               
    if (userLastInteraction) {
        let { messageId, timeout } = userLastInteraction!;
        if (messageId && messageId !== message.id) {
            interaction.deleteReply(messageId);
        }
        clearTimeout(timeout);
    }
                
    const timeout = setTimeout(() => {
        const diff = dayjs().diff(interaction.createdTimestamp);

        if (diff >= fiveMinutes) {
            interaction.deleteReply(message.id)
            c.lastInteraction.delete(`${interaction.user.id}:${message.channelId}`)
        }
    }, fiveMinutes)

    c.lastInteraction.set(`${interaction.user.id}:${message.channelId}`, { messageId: message.id, timeout }); 
} 

export default autoClose;