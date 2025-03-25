import { ChannelType, Routes, type APIApplication, type APIChannel, type APIRole, type APIUser } from "discord.js";
import type DiscordClient from "../client";
import type { BotConfigI } from "@/types/module";
import { rest } from "../client";

export const loadConfig = async () => {
    const guildId = process.env.GUILD_ID;
    if (!guildId) throw Error("[FETCH CONFIG ERR]: Missing guild id");

    const [bot, channels, roles] = await Promise.all([
        rest.get(Routes.user('@me')) as Promise<APIUser>,
        rest.get(Routes.guildChannels(guildId)) as Promise<APIChannel[]>,
        rest.get(Routes.guildRoles(guildId)) as Promise<APIRole[]>,
    ])

    const categories = channels.filter(channel => channel.type === ChannelType.GuildCategory);

    const configData: BotConfigI = {
        botId: bot.id,
        guildId: guildId,
        categoryId: categories.reduce((acc, category) => {
            acc[category.name] = category.id;
            return acc;
        }, {} as Record<string, string>),
        channelsId: channels.filter(channel => channel.type !== ChannelType.GuildCategory).reduce((acc, channel) => {
            acc[channel.name!] = channel.id;
            return acc;
        }, {} as Record<string, string>),
        rolesId: roles.reduce((acc, role) => {
            acc[role.name] = role.id;
            return acc;
        }, {} as Record<string, string>)
    }

    return configData
};