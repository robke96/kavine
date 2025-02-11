import { Client, Collection } from "discord.js";
import type { ClientEvents } from "discord.js";
import { botConfig } from "@/config/botConfig";
import { existsSync, lstatSync, readdirSync } from "node:fs";

import type { ModuleI } from "@/types/module";
import type DiscordClient from "../client";
import path from "node:path";

const modulesPath = path.join(__dirname, '../../../src/modules');
const modules: ModuleI[] = [];

/* 
    works for now, may need to optimize it in future?
    use Map Collection instead of array => modules = []
*/

const moduleHandler = (client: DiscordClient) => {
    // read files and push to array
    const moduleFolders = readdirSync(modulesPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
    moduleFolders.forEach((folder) => {
        const indexPath = path.join(modulesPath, folder, 'index.ts');
        
        if (existsSync(indexPath)) {
          const module = require(indexPath);

          if (module.default) {
            modules.push(module.default);
          }
        }
    });

    // register events
    modules.forEach((module) => {
        if (module.isEnabled) {
            Object.keys(module.events).forEach((eventName) => {
                const typedEventName = eventName as keyof ClientEvents;
                const handler = module.events[typedEventName];
                
                if (handler) {
                    client.on(eventName, (...args: any[]) => handler(client, ...args));
                }
            })
        }
    })
}

export default moduleHandler