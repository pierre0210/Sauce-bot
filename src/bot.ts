import { Client, Collection, Intents, Interaction } from "discord.js";
import { interactionCreate } from "./events/interactionCreate";
import { messageCreate } from "./events/messageCreate";
import { ready } from "./events/ready";
import { ClientExtension } from "./interfaces/ClientExtension";
require("dotenv").config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }) as ClientExtension;

client.on("ready", async () => await ready(client));

client.on("interactionCreate", async (interaction: Interaction) => interactionCreate(interaction, client));

client.on("messageCreate", async (message) => messageCreate(message));

client.login(process.env.BOT_TOKEN);