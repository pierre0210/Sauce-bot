import axios, { AxiosError, AxiosResponse } from "axios";
import { Message } from "discord.js";
import path from "path";
import FormData from "form-data";
import { Ascii2dResult } from "../modules/ascii2dAPI";
import { ImageUtility } from "../modules/ImageUtility";

export const messageCreate = async (message: Message) => {
	const configFilePath = path.join(process.cwd(), "prod", "config.json");
	const config = await import(configFilePath);
	if(config.SauceChannels.includes(message.channelId) && message.attachments.size != 0) {
		message.attachments.forEach(async (attachment) => {
			let imageURL: string = attachment.url;
			if(imageURL.endsWith(".jpeg") || imageURL.endsWith(".jpg") || imageURL.endsWith(".png")) {
				try {
					const formData = new FormData();
					formData.append("uri", imageURL);
					const baseUrl = "https://ascii2d.net";
					const raw = await axios.post(baseUrl+"/search/uri", formData, { headers: formData.getHeaders() });
					const ascii2d = new Ascii2dResult(raw);
					const results = ascii2d.getResults();
					if(!results.at(0) || !results.at(1)) return;
					const searchUrl = baseUrl+ascii2d.getThumbnail(results.at(0) as cheerio.Element);
					const resultUrl = baseUrl+ascii2d.getThumbnail(results.at(1) as cheerio.Element);
					console.log(searchUrl);
					console.log(resultUrl);

					const imageUtil = new ImageUtility(searchUrl, resultUrl);
					await imageUtil.compareImages(await imageUtil.getSearchImg(), await imageUtil.getResultImg());
				}
				catch(error) { 
					console.log(error);
				}
			}
		});
	}
}