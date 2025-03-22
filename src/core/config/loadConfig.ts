import { ChannelType } from "discord.js";
import type DiscordClient from "../client";
import type { BotConfigI, CategoryNames } from "@/types/module";

export const loadConfig = async (c: DiscordClient) => {
    const guildId = process.env.GUILD_ID;
    if (!guildId) throw Error("[FETCH CONFIG ERR]: Missing guild id");

    const guild = await c.guilds.fetch(guildId).catch((err) => {
        throw Error(err);
    })
    
    const channels = guild.channels.cache;
    const roles = guild.roles.cache;
    const categories = channels.filter(channel => channel.type === ChannelType.GuildCategory);



    const configData: BotConfigI = {
        botId: c.user!.id,
        guildId: guild.id,
        categoryId: categories.reduce((acc, category) => {
            acc[category.name] = category.id;
            return acc;
        }, {} as Record<string, string>),
        channelsId: channels.filter(channel => channel.type !== ChannelType.GuildCategory).reduce((acc, channel) => {
            acc[channel.name] = channel.id;
            return acc;
        }, {} as Record<string, string>),
        rolesId: roles.reduce((acc, role) => {
            acc[role.name] = role.id;
            return acc;
        }, {} as Record<string, string>)
    }

    return configData
};