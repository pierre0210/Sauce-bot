import { SlashCommandBuilder } from "@discordjs/builders";
import axios, { AxiosError, AxiosResponse } from "axios";
import * as path from "path";
import { Command } from "../interfaces/Command";
import { SauceResult } from "../modules/sauceAPI";
require("dotenv").config();

export const sauce: Command = {
	data: new SlashCommandBuilder()
		.setName("sauce").setDescription("where's the sauce??")
		.addSubcommand((sub) => sub.setName("link").setDescription("use url as parameter")
			.addStringOption((option) => option.setName("image-url").setDescription("image url (ends with .jpg or .png").setRequired(true)))
		.addSubcommand((sub) => sub.setName("attachment").setDescription("use attachment")
			.addAttachmentOption((option) => option.setName("image-attachment").setDescription("image attachment (.jpg or .png)").setRequired(true))),
	
	run: async(client, interaction) => {
		let imageURL: string = "";
		if(interaction.options.getSubcommand() === "link") {
			const url = interaction.options.getString("image-url");
			if(url?.endsWith(".jpg") || url?.endsWith(".png")) {
				imageURL = url;
			}
			else {
				await interaction.reply({ content: "File type not supported\n```\n"+`${url}`+"\n```", ephemeral: true });
				return;
			}
		}
		else if(interaction.options.getSubcommand() === "attachment") {
			const url = interaction.options.getAttachment("image-attachment")?.url;
			if(url?.endsWith(".jpg") || url?.endsWith(".png")) {
				imageURL = url;
			}
			else {
				await interaction.reply({ content: "File type not supported\n```\n"+`${url}`+"\n```", ephemeral: true });
				return;
			}
		}
		const configFilePath = path.join(process.cwd(), "prod", "config.json");
		const config = await import(configFilePath);
		axios.get("https://saucenao.com/search.php", {
			params: {
				url: imageURL,
				db: 999,
				api_key: config.SauceKeys,
				output_type: 2,
				numres: 3
			}
		})
		.then((raw: AxiosResponse) => {
			const result = new SauceResult(raw);
		})
		.catch((error: AxiosError) => {

		});
	}
}