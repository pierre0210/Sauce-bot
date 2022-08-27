import { SlashCommandBuilder } from "@discordjs/builders";
import axios, { AxiosError, AxiosResponse } from "axios";
import { MessageEmbed } from "discord.js";
import * as path from "path";
import { Command } from "../interfaces/Command";
import { SauceResult } from "../modules/sauceAPI";
require("dotenv").config();

export const saucenao: Command = {
	data: new SlashCommandBuilder()
		.setName("saucenao").setDescription("where's the sauce??")
		.addSubcommand((sub) => sub.setName("link").setDescription("use url as parameter")
			.addStringOption((option) => option.setName("image-url").setDescription("image url (ends with .jpg .jpeg or .png").setRequired(true))
			.addIntegerOption((option) => option.setName("result-num").setDescription("result number (max: 10)").setMinValue(1).setMaxValue(10)))
		.addSubcommand((sub) => sub.setName("attachment").setDescription("use attachment")
			.addAttachmentOption((option) => option.setName("image-attachment").setDescription("image attachment (.jpg .jpeg or .png)").setRequired(true))
			.addIntegerOption((option) => option.setName("result-num").setDescription("result number (max: 10)").setMinValue(1).setMaxValue(10))),
	
	run: async(client, interaction) => {
		let imageURL: string = "";
		if(interaction.options.getSubcommand() === "link") {
			const url = interaction.options.getString("image-url");
			if(url?.endsWith(".jpg") || url?.endsWith(".jpeg") || url?.endsWith(".png")) {
				imageURL = url;
			}
			else {
				await interaction.reply({ content: "File type not supported\n```\n"+`${url}`+"\n```", ephemeral: true });
				return;
			}
		}
		else if(interaction.options.getSubcommand() === "attachment") {
			const url = interaction.options.getAttachment("image-attachment")?.url;
			if(url?.endsWith(".jpg") || url?.endsWith(".jpeg") || url?.endsWith(".png")) {
				imageURL = url;
			}
			else {
				await interaction.reply({ content: "File type not supported\n```\n"+`${url}`+"\n```", ephemeral: true });
				return;
			}
		}
		const resultNum = interaction.options.getInteger("result-num") || 1;
		await interaction.deferReply();
		const configFilePath = path.join(process.cwd(), "prod", "config.json");
		const config = await import(configFilePath);
		axios.get("https://saucenao.com/search.php", {
			params: {
				url: imageURL,
				db: 999,
				api_key: config.SauceKeys,
				output_type: 2,
				numres: resultNum
			}
		})
		.then((raw: AxiosResponse) => {
			const resultEmbeds = [];
			const sauce = new SauceResult(raw);
			const results = sauce.getResults().sort((a, b) => {
				const aSim = sauce.getSimilarity(a);
				const bSim = sauce.getSimilarity(b);
				return aSim < bSim ? 1 : (aSim > bSim ? -1 : 0);
			});

			for(const result of results) {
				const title = sauce.getTitle(result);
				let description: string = `**Author:** ${sauce.getAuthor(result)} / **Similarity:** ${sauce.getSimilarity(result)}%\n`;
				const urls = sauce.getUrls(result);
				for(let i=0; i<urls.length; i++) {
					description += `[Sauce${i+1}](${urls[i]}) / `;
				}
				description = description.slice(0, -2);
				//description += `\n${sauce.getIndexName(result).split(":")[1].split("-")[0].trim()}`;
				const resultEmbed = new MessageEmbed().setColor("DARK_GREEN").setTitle(title).setDescription(description)
					.setImage(sauce.getThumbnail(result))
					.setFooter({ text: `Times remaining: ${sauce.getLimit()}` })
					.setTimestamp();
				resultEmbeds.push(resultEmbed);
			}
			
			interaction.followUp({ embeds: resultEmbeds });
		})
		.catch((error: AxiosError) => {
			interaction.followUp("Error! please try again later\n```\n" + `${error.message}` + "\n```");
		});
	}
}