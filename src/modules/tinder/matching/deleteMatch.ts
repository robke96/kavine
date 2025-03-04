import type DiscordClient from "@/core/client";
import { UserModel } from "@/database/models/userModel";
import type { ButtonInteraction, CacheType } from "discord.js";

const deleteMatch = async (interaction: ButtonInteraction<CacheType>, client: DiscordClient) => {
    const channel = interaction.channel;
    if (!channel) return;
    const users = interaction.message.mentions.users.map(user => user.id);
    
    interaction.deferReply();
    await channel.delete()

    await UserModel.updateMany(
        { userId: { $in: [users[0], users[1]] }}, 
        { 
            $pull: { 
              "tinder.likedUsers": { 
                userId: { $in: [users[0], users[1]] }
              } 
            }
        }
    )
}

export default deleteMatch;