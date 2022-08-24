import { Client } from "discord.js";
import { Command } from "./Command";

export interface ClientExtension extends Client {
	commands: Command[];
}