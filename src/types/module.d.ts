import type DiscordClient from "@/core/client";
import type { Client, ClientEvents } from "discord.js";

export interface ModuleI {
    events: {
     [K in keyof ClientEvents]?: (client: DiscordClient, ...args: ClientEvents[K]) => void;
    }
}

export interface BotConfigI {
    botId: string;
    guildId: string;
    categoryId: Record<CategoryNames, string>;
    channelsId: Record<ChannelNames, string>;
    rolesId: Record<RolesNames, string>;
}

export enum CategoryNames {
    TAVOPOKALBIAI = "📬・TAVO POKALBIAI",
    INFORMACIJA = "🟡・INFORMACIJA",
    KAVINE247 = "🟢・KAVINĖ 24/7",
    VOICEKANALAI = "📘・VOICE KANALAI",
    ADMINISTRACIJA = "📑・ADMINISTRACIJA",
    REGISTRACIJA = "📕・REGISTRACIJA",
};

export enum ChannelNames {
    NAUJOKAMS = "🧠︱naujokams",
    NAUJIENOS = "📬︱naujienos",
    PAIESKOS = "🫦︱paieškos",
    PROFILIS = "📗︱profilis",
    BENDRAS = "🍷︱bendras",
    LOGS = "📃︱logs",
    MODERATOR_ONLY = "moderator-only",
}

export enum RolesNames {
    EVERYONE = "@everyone",
    PRANESIMAS = "・Pranesimas",
    NARYS = "・Narys",
    BOT = "bot",
};