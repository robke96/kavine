import MatchingButtons from "@/components/buttons/Matching";
import ProfileCard from "@/components/cards/ProfileCard";
import type DiscordClient from "@/core/client";
import { UserModel, type IUser } from "@/database/models/userModel";
import { uploadToS3 } from "@/database/s3Client";
import type { AttachmentBuilder, ButtonInteraction, CacheType } from "discord.js";

const startSwiping = async (interaction: ButtonInteraction<CacheType>, client: DiscordClient, update?: boolean) => {
  const method = update ? "update" : "reply";
  let watchedSet = client.watchedCards.get(interaction.user.id);
  if (!watchedSet) {
    watchedSet = new Set([]);
  }
  const watched = Array.from(watchedSet);

  console.log(watched)

  const User = await UserModel.findOne({
    userId: interaction.user.id
  }, { tinder: { likedUsers: 1 }, _id: 0 }).lean();

  if (!User) {
    const profilisCh = client.config!.channelsId["📗︱profilis"];
    return interaction[method]({ flags: "Ephemeral", content: `Kad galėtumėte naršyti per paieška, pirma turite susikurti savo kortele <#${profilisCh}>` })
  }

  const likedUsers: string[] = User.tinder.likedUsers.map(({ userId }) => userId);

  const data: IUser[] = await UserModel.aggregate([
    { $sample: { size: 5 } },
    {
      $match: {
        userId: {
          $nin: [...likedUsers, ...watched, interaction.user.id]
        },
      }
    }
  ])

  if (data.length === 0) {
    return interaction[method]({ components: [], files: [], content: 'Atrodo, kad paspaudei "patinka" ant visų kortelių!\nŠiuo metu neturime daugiau ką parodyti, bet nepamiršk sugrįžti vėliau - visada atsiranda naujų kortelių!', flags: 'Ephemeral', })
  }

  const firstUser = data[0];

  const buttons = MatchingButtons(firstUser.userId);
  if (!buttons) return;

  let firstCard: string | AttachmentBuilder = firstUser.about.profileCard;
  if (!firstCard) {
    const card = await ProfileCard(firstUser)

    firstCard = card.imageAttachment;
    await uploadToS3(`${firstUser.userId}.webp`, card.buffer);
  }

  interaction[method]({ flags: 'Ephemeral', files: [firstCard as AttachmentBuilder], components: [buttons] })

  const users = data.filter(user => user.about.profileCard !== firstCard)

  const userCards = users.map((user) => user.about.profileCard);
  const userIds = users.map((u) => u.userId);

  client.cardsCollection.set(interaction.user.id, userCards);
  client.watchedCards.set(interaction.user.id, new Set([...watched, ...userIds]))
}

export default startSwiping;
