import { Command } from "../interfaces/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

export const ping: Command = {
	data: new SlashCommandBuilder()
		.setName("ping").setDescription("Get latency"),
	
	run: async (client, interaction) => {
		const pingEmbed = new MessageEmbed().setColor("DARK_GREEN")
			.setDescription("```\n"+`Websocket latency: ${client.ws.ping} ms`+"\n```");
		await interaction.reply({ embeds: [pingEmbed] });
	}
}