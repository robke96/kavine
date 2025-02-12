import { Client, GatewayIntentBits, Partials, Options, Collection, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
// import eventHanlder from "./handlers/eventHandler";
import moduleHandler from "./handlers/moduleHandler";
import { registerSlashCommands, slashCommandHandler } from "./handlers/commandHandler";

export type SlashCommandT = {
    data: SlashCommandBuilder
    execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void,
}
    
class DiscordClient extends Client {
    slashCommandsCollection: Collection<string, SlashCommandT>

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

        // module handler 
        moduleHandler(this)

        // command handler
        registerSlashCommands(this)
        slashCommandHandler(this);
        // event handler
        // eventHanlder(this);
    }
}

export default DiscordClient;