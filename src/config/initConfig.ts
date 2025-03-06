import type { BotConfigI } from '@/types/module';
import { ChannelType, type Client } from "discord.js";

const initConfig = async (client: Client) => {
    const data = await fetchConfig(client);
    if (!data) return;

    Bun.write("./src/config/botConfig.json", JSON.stringify(data, null, 2));
}

const fetchConfig = async (c: Client): Promise<BotConfigI> => {
    const guildId = process.env.GUILD_ID;
    if (!guildId) throw Error("[FETCH CONFIG ERR]: Missing guild id");

    const guild = await c.guilds.fetch(guildId).catch((err) => {
        throw Error(err);
    })

    const channels = guild.channels.cache;
    const roles = guild.roles.cache;
    const categories = channels.filter(channel => channel.type === ChannelType.GuildCategory);

    const { SYSTEM_SLASHCOMMANDS, SYSTEM_REGISTRATION, SYSTEM_CARDLOAD, SYSTEM_TINDER } = process.env;
    console.log(SYSTEM_SLASHCOMMANDS)
    const isEnabled = (val: string): boolean => {
        if (val === 'false') {
          return false;
        }
        return val !== 'false';
      };
    const configData: BotConfigI = {
        systems: {
            slashCommands: isEnabled(SYSTEM_SLASHCOMMANDS!),
            registration: isEnabled(SYSTEM_REGISTRATION!),
            loadingCards: isEnabled(SYSTEM_CARDLOAD!),
            tinder: isEnabled(SYSTEM_TINDER!),
        },
        botId: c.user?.id,
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

    return configData;
} 

export default initConfig;