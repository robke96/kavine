import type { ClientEvents } from "discord.js";
import type { ModuleI } from "@/types/module";
import type DiscordClient from "../client";
import path from "node:path";
import { Glob } from "bun";

const modules: ModuleI[] = [];
const glob = new Glob('src/modules/**/index.ts');

const moduleHandler = async (client: DiscordClient) => {
    for await (const filePath of glob.scan('.')) {
        const module = await import(path.resolve(filePath));
        
        if (module.default) {
            modules.push(module.default);
        }
    };

    // register events
    modules.forEach((module) => {
        Object.keys(module.events).forEach((eventName) => {
            const typedEventName = eventName as keyof ClientEvents;
            const handler = module.events[typedEventName];
                
            if (handler) {
                client.on(typedEventName, (...args: ClientEvents[typeof typedEventName]) => handler(client, ...args));
            }
        })
    })
}

export default moduleHandler