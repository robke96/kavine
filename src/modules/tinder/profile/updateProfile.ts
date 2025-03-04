import { UserModel } from "@/database/models/userModel";
import type { CacheType, ModalSubmitInteraction } from "discord.js";
import ProfileCard from "@/components/cards/ProfileCard";
import client, { uploadToS3 } from "@/database/s3Client";

// messy code - 2 times doing document update for user. ;-; may fix in future..

const updateProfile = async (interaction: ModalSubmitInteraction<CacheType>) => {
    const data = interaction.fields.fields.first();

    const id = data?.customId;
    const val = id?.split('_')[1];
    const answer = data?.value!;
    const regex = /\d/;

    switch (id) {
        case "input_name":
            if (regex.test(answer)) return; 
            break;
        case "input_age":
            if (!regex.test(answer)) return;
            break;
        case "input_description":
            break;
    }

    await UserModel.updateOne({
        userId: interaction.user.id,
    }, {
        $set: { [`about.${val}`]: answer }
    });

    if (interaction.isFromMessage()) {
        const user = await UserModel.findOne({
            userId: interaction.user.id
        })

        if (!user) return;

        const renderCard = await ProfileCard(user)
        const attachment = renderCard.imageAttachment

        interaction.update({ files: [attachment], content: "" });

        await uploadToS3(`${interaction.user.id}.webp`, renderCard.buffer);     
    }
}

export default updateProfile;