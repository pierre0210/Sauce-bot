import { SlashCommandBuilder } from "@discordjs/builders";
import axios, { AxiosError, AxiosResponse } from "axios";
import cheerioModule from "cheerio";
import { Interaction, MessageEmbed } from "discord.js";
import FormData from "form-data";
import { Command } from "../interfaces/Command";
import { Ascii2dResult } from "../modules/ascii2dAPI";

export const ascii2d: Command = {
	data: new SlashCommandBuilder()
		.setName("ascii2d").setDescription("where's the sauce??")
		.addSubcommand((sub) => sub.setName("link").setDescription("use url as parameter")
			.addStringOption((option) => option.setName("image-url").setDescription("image url (ends with .jpg .jpeg or .png").setRequired(true))
			.addIntegerOption((option) => option.setName("result-num").setDescription("result number (max: 10) strongly not recommand").setMinValue(1).setMaxValue(10)))
		.addSubcommand((sub) => sub.setName("attachment").setDescription("use attachment")
			.addAttachmentOption((option) => option.setName("image-attachment").setDescription("image attachment (.jpg .jpeg or .png)").setRequired(true))
			.addIntegerOption((option) => option.setName("result-num").setDescription("result number (max: 10) strongly not recommand").setMinValue(1).setMaxValue(10))),
	
	run: async (client, interaction) => {
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
		const formData = new FormData();
		formData.append("uri", imageURL);
		const baseUrl = "https://ascii2d.net";
		axios.post(baseUrl+"/search/uri", formData, { 
			headers: formData.getHeaders() 
		})
		.then((raw: AxiosResponse) => {
			const ascii2d = new Ascii2dResult(raw);
			const results = ascii2d.getResults();
			//let resultsInRange: cheerio.Element[] = results.filter((result: cheerio.Element, index: number) => index != 0 && index <= resultNum);
			let resultEmbeds: MessageEmbed[] = [];

			let count: number = 0;
			for(const result of results) {
				if(count >= resultNum) break;
				const resultEmbed = new MessageEmbed().setColor("NAVY")
				const imageInfo = ascii2d.getImageInfo(result);
				const imageUrl = ascii2d.getThumbnail(result);
				const authorUrl = ascii2d.getAuthorUrl(result);
				const authorName = ascii2d.getAuthorName(result);
				const artUrl = ascii2d.getArtUrl(result);
				const artName = ascii2d.getArtName(result);
				const avatar = ascii2d.getPlatformAvatar(result);
				const platform = ascii2d.getImagePlatform(result);

				if(artName && artUrl && authorName && authorUrl && imageInfo && imageUrl && platform) {
					count++;
					resultEmbed.setTitle(artName).setURL(`${artUrl}`).setDescription(`[${authorName}](${authorUrl})\n${imageInfo.text()}`)
						.setImage(baseUrl+imageUrl).setFooter({ text: platform.text() }).setTimestamp();
					resultEmbeds.push(resultEmbed);
				}
			}
			if(resultEmbeds.length == 0) {
				interaction.followUp({ content: "`No result`" });
			}
			else {
				interaction.followUp({ embeds: resultEmbeds });
			}
		})
		.catch((error: AxiosError) => {
			interaction.followUp("Error! please try again later\n```\n" + `${error.message}` + "\n```");
		});
	}
}