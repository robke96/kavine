import { categoryId, guildId } from "@/config/botConfig";
import type DiscordClient from "@/core/client";
import { UserModel, type IUser } from "@/database/models/userModel";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits, type ButtonInteraction, type CacheType } from "discord.js";
import nextCard from "./nextCard";

const swipeYes = async (interaction: ButtonInteraction<CacheType>, client: DiscordClient) => {
    const userId = interaction.customId.split(":")[1];

    const User = await UserModel.findOne({ userId: userId }).lean()

    if (!User) return;

    const userLikes = User.tinder.likedUsers;
    const isLiked = userLikes.find(like => like.userId === interaction.user.id);

    let likedUser = {
        userId: userId,
        isMatch: false,
        createdAt: -1
    }

    if (!isLiked) {
        await UserModel.updateOne({ 
            userId: interaction.user.id,
        }, {
            $push: { "tinder.likedUsers": likedUser },
        })

        return nextCard(interaction,client);
    }

    // MATCH!
    likedUser.createdAt = Date.now();
    likedUser.isMatch = true;

    const random4Digit = Math.floor(1000 + Math.random() * 9000);
    const guild = await client.guilds.fetch(guildId);
    const user = await guild.members.fetch(userId); 

    const newChannel = await guild.channels.create({
        name: `🔥︱Pokalbis #${random4Digit}`,
        parent: categoryId.tavoPokalbiai,
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id: guild.roles.everyone, // @everyone
                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            },
            {
                id: interaction.user.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages,PermissionFlagsBits.ReadMessageHistory],
            },
            {
                id: user.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages,PermissionFlagsBits.ReadMessageHistory],
            },
        ],
    })

    const informText = `Sveikiname su nauju match! <@${interaction.user.id}> <@${userId}>\nŠis kanalas bus aktyvus tik tol, kol jis bus naudojamas, Jei per 3 dienas nebus jokios veiklos, kanalas bus ištrinamas.\nNepamirškite, kad neturėtumėte dalintis asmenine informacija, kurios nenorite skleisti viešai.
    `

    const deleteButton = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(new ButtonBuilder()
            .setCustomId('match_delete')
            .setStyle(ButtonStyle.Danger)
            .setLabel("Ištrinti pokalbi")
        )
    
    newChannel?.send({ content: informText, components: [deleteButton] })
    
    await UserModel.updateOne({ 
        userId: interaction.user.id,
    }, {
        $push: { "tinder.likedUsers": likedUser },
    })

    return interaction.update({ content: `MATCH! ${newChannel}`, components: [], files: [], })
}

export default swipeYes;