import MatchingButtons from "@/components/buttons/Matching";
import ProfileCard from "@/components/cards/ProfileCard";
import { channelsId } from "@/config/botConfig";
import type DiscordClient from "@/core/client";
import { UserModel, type IUser } from "@/database/models/userModel";
import { uploadToS3 } from "@/database/s3Client";
import type { AttachmentBuilder, ButtonInteraction, CacheType } from "discord.js";

const startSwiping = async (interaction: ButtonInteraction<CacheType>, client: DiscordClient) => {
    const User = await UserModel.findOne({
      userId: interaction.user.id
    }, { tinder: { likedUsers: 1 }, _id: 0 }).lean();
    if (!User) {
      return interaction.reply({ flags: "Ephemeral", content: `Kad galėtumėte naršyti per paieška, pirma turite susikurti savo kortele <#${channelsId.profilis}>` })
    }

    const likedUsers: string[] = User.tinder.likedUsers.map(({ userId }) => userId);

    const data: IUser[] = await UserModel.aggregate([
      { $sample: { size: 10 } },
      { 
        $match: { 
          userId: { 
            $nin: [...likedUsers, interaction.user.id] 
          }, 
        }
      }
    ])

    if (data.length === 0) {
      return interaction.reply({ content: 'Atrodo, kad paspaudei "patinka" ant visų kortelių!\nŠiuo metu neturime daugiau ką parodyti, bet nepamiršk sugrįžti vėliau - visada atsiranda naujų kortelių!', flags: 'Ephemeral' })
    }

    const firstUser = data[0];

    const buttons = MatchingButtons(firstUser.userId);
    if (!buttons) return;

    let firstCard: string | AttachmentBuilder = firstUser.about.profileCard;
    if (!firstCard) {
      const card = await ProfileCard(firstUser)
  
      firstCard = card.imageAttachment;
      uploadToS3(`${firstUser.userId}.webp`, card.buffer);
    }
    
    interaction.reply({ flags: 'Ephemeral', files: [firstCard as AttachmentBuilder], components: [buttons] })    

    const userCards = data
      .filter(user => user.about.profileCard !== firstCard)
      .map((user) => user.about.profileCard);

    client.cardsCollection.set(interaction.user.id, userCards);
}

export default startSwiping;