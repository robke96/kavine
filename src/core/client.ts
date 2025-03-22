import { Client, GatewayIntentBits, Partials, Options, Collection, SlashCommandBuilder, ChatInputCommandInteraction, Message, SlashCommandSubcommandBuilder } from "discord.js";
import moduleHandler from "./handlers/moduleHandler";
import { registerSlashCommands, slashCommandHandler } from "./handlers/commandHandler";
import { loadConfig } from './config/loadConfig';
import type { BotConfigI } from "@/types/module";

export type SlashCommandT = {
    data: SlashCommandBuilder | SlashCommandSubcommandBuilder
    execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void,
}

type LastInteractionT = {
    messageId: string,
    timeout: ReturnType<typeof setTimeout>
};
    
class DiscordClient extends Client<boolean> {
    public config: BotConfigI | null = null;
    public slashCommandsCollection = new Collection<string, SlashCommandT>()
    public cardsCollection = new Collection<string, string[]>
    public watchedCards = new Collection<string, Set<string>>
    public lastInteraction = new Collection<string, LastInteractionT>

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

        this.#init();
    }
    
    async #init() {
        try {
            moduleHandler(this);
            registerSlashCommands(this);
            slashCommandHandler(this);

            // load config in cache
            this.once("ready", async () => {
                this.config = await loadConfig(this);
                console.info("[✅ | KAVINĖ BOT] - online!")
            });
        } catch (error) {
            console.error('Error during bot init');
        }
    }
}

export default DiscordClient;