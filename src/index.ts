import DiscordClient from "@core/client";
import { connectMongoDB } from "@database/mongoConnect";
const { MONGO_URI, BOT_TOKEN } = process.env;

// mongo
(async () => {
    await connectMongoDB(MONGO_URI as string);
})();

// discord connection
const client = new DiscordClient();

client.login(BOT_TOKEN as string).catch(({ message }) => {
    return console.error("[BOT ERROR]:", message);
});

