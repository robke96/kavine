import type { Client, ClientEvents } from "discord.js";

export interface ModuleI {
    isEnabled: boolean,
    events: {
     [K in keyof ClientEvents]?: (client: Client, ...args: ClientEvents[K]) => void;
    }
}

export interface BotConfigI {
    systems: {
      slashCommands: boolean;
      registration: boolean;
      loadingCards: boolean;
      tinder: boolean;
    };
    botId: string | undefined;
    guildId: string;
    categoryId: Record<string, string>;
    channelsId: Record<string, string>;
    rolesId: Record<string, string>;
}
