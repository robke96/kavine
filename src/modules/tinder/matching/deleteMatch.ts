import type DiscordClient from "@/core/client";
import { UserModel } from "@/database/models/userModel";
import type { ButtonInteraction, CacheType } from "discord.js";

const deleteMatch = async (interaction: ButtonInteraction<CacheType>, client: DiscordClient) => {
    const channel = interaction.channel;
    if (!channel) return;
    const users = interaction.message.mentions.users.map(user => user.id);
    
    await interaction.deferReply();

    await Promise.all([
      channel.delete(),
      UserModel.updateMany(
          { userId: { $in: [users[0], users[1]] }}, 
          { 
              $pull: { 
                "tinder.likedUsers": { 
                  userId: { $in: [users[0], users[1]] }
                } 
              }
          }
      )
    ])
}

export default deleteMatch;