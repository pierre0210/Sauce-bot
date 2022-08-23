import { Client, Intents } from "discord.js";
require("dotenv").config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on("ready", () => {
	console.log(`Logged in as ${client.user?.tag}`);
});

client.login(process.env.BOT_TOKEN);