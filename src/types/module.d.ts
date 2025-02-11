import type { Client, ClientEvents } from "discord.js";

export interface ModuleI {
    isEnabled: boolean,
    events: {
     [K in keyof ClientEvents]?: (client: Client, ...args: ClientEvents[K]) => void;
    }
}