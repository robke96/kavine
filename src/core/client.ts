import { Client, GatewayIntentBits, Partials, Options, Collection, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import moduleHandler from "./handlers/moduleHandler";
import { registerSlashCommands, slashCommandHandler } from "./handlers/commandHandler";
import type { IUser } from "@/database/models/userModel";

export type SlashCommandT = {
    data: SlashCommandBuilder
    execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void,
}
    
class DiscordClient extends Client<boolean> {
    slashCommandsCollection: Collection<string, SlashCommandT>
    cardsCollection: Collection<string, string[]>

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
            partials: [
                Partials.Message, 
                Partials.Channel, 
                Partials.GuildMember,
                Partials.User
            ],
            makeCache: Options.cacheWithLimits({
                ...Options.DefaultMakeCacheSettings,
                ReactionManager: 0,
            }),
        })

        this.slashCommandsCollection = new Collection();
        this.cardsCollection = new Collection()
        // module handler 
        moduleHandler(this)

        // command handler
        registerSlashCommands(this)
        slashCommandHandler(this);
    }
}

export default DiscordClient;