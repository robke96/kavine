import { secrets } from "@config/botConfig";
import DiscordClient from "@core/client";
import { connectMongoDB } from "@database/mongoConnect";

// mongo connection
(async () => {
    await connectMongoDB(secrets.mongoURL);
})();

// discord connection
const client = new DiscordClient();

client.once("ready", () => {
    console.info("[✅ | KAVINĖ BOT] - online!")
})

client.login(secrets.token).catch(({ message }) => {
    return console.error("[BOT ERROR]:", message);
});