import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { ClientExtension } from "./ClientExtension";

export interface Command {
	data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
	run: (client: ClientExtension, interaction: CommandInteraction) => Promise<void>;
}