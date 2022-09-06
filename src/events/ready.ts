import { Command } from "../interfaces/Command";
import * as fs from "fs";
import * as path from "path";
import { ClientExtension } from "../interfaces/ClientExtension";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
require('dotenv').config();

const exampleConfig = {
	DevGuildId: "",
	SauceKey: "your-saucenao-api-key",
	SauceChannels: [],
	IsGlobal: false,
	SauceMaxNRMS: 0.03,
	SauceMinPSNR: 27.5
}

export const ready = async (client: ClientExtension) => {
	const configFilePath = path.join(process.cwd(), "prod", "config.json");
	if(!fs.existsSync(configFilePath)) {
		fs.writeFileSync(path.join(process.cwd(), "prod", "example.config.json"), JSON.stringify(exampleConfig, null, 4));
		console.log("config.json not found");
		process.exit(1);
	}
	const config = await import(configFilePath);
	const commandDir = path.join(process.cwd(), "prod", "commands");
	const files = fs.readdirSync(commandDir, { encoding: "utf-8" });
	client.commands = [];
	for(const file of files) {
		const name = file.split(".")[0];
		const cmd = await import(path.join(process.cwd(), "prod", "commands", file));
		client.commands.push(cmd[name] as Command);
		console.log(`${name} command loaded`);
	}
	const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN as string);
	const commandData = client.commands.map((cmd) => cmd.data.toJSON());
	// Guild command registration
	if(config.IsGlobal) {
		await rest.put(Routes.applicationCommands(client.user?.id || ""), { body: commandData });
		console.log("Registered Global command");
		await rest.put(Routes.applicationGuildCommands(client.user?.id || "", config.DevGuildId), { body: commandData });
		console.log("Registered Guild command");
	}
	else {
		await rest.put(Routes.applicationCommands(client.user?.id || ""), { body: [] });
		console.log("Cleared Global command");
		await rest.put(Routes.applicationGuildCommands(client.user?.id || "", config.DevGuildId), { body: commandData });
		console.log("Registered Guild command");
	}

	console.log(`Logged in as ${client.user?.tag}`);
}