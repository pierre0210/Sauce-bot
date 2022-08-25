import { AxiosResponse } from "axios";

class SauceResult {
	response: any;
	header: any;
	results: any;

	constructor(raw: AxiosResponse) {
		this.response = raw.data;
		this.header = this.response["header"];
		this.results = this.response["results"];
	}

	public getResults(): any {
		return this.results;
	}

	public getLimit(): number {
		return parseInt(this.header["long_remaining"]);
	}

	public getStatus(): number {
		return parseInt(this.header["status"]);
	}

	public getTitle(result: any): string {
		let title: string = "untitled";
		if(result["data"]["title"]) {
			title = result["data"]["title"];
		}
		else if(result["data"]["eng_name"]) {
			title = result["data"]["eng_name"];
		}
		else if(result["data"]["material"]) {
			title = result["data"]["material"];
		}
		else if(result["data"]["source"]) {
			title = result["data"]["source"];
		}
		else if(result["data"]["created_at"]) {
			title = result["data"]["created_at"];
		}
		return decodeURIComponent(JSON.parse('"' + title.replace('"', '\\"') + '"'));
	}

	public getThumbnail(result: any): string {
		const thumbnail = result["header"]["thumbnail"] as string;
		return decodeURIComponent(JSON.parse('"' + thumbnail.replace('"', '\\"') + '"'));
	}

	public getSimilarity(result: any): number {
		return parseFloat(result["header"]["similarity"]);
	}

	public getIndexName(result: any): string {
		return result["header"]["index_name"] as string;
	}

	public getUrls(result: any): string[] {
		if(result["data"]["ext_urls"]) {
			return result["data"]["ext_urls"];
		}
		else if(result["data"]["getchu_id"]) {
			return [`http://www.getchu.com/soft.phtml?id=${result["data"]["getchu_id"]}`];
		}
		else {
			return [];
		}
	}

	public getAuthor(result: any): string {
		let author: string = "unknown";
		if(result["data"]["author"]) {
			author = result["data"]["author"];
		}
		else if(result["data"]["author_name"]) {
			author = result["data"]["author_name"];
		}
		else if(result["data"]["member_name"]) {
			author = result["data"]["member_name"];
		}
		else if(result["data"]["pawoo_user_username"]) {
			author = result["data"]["pawoo_user_username"];
		}
		else if(result["data"]["twitter_user_handle"]) {
			author = result["data"]["twitter_user_handle"];
		}
		else if(result["data"]["company"]) {
			author = result["data"]["company"];
		}
		else if(result["data"]["user_name"]) {
			author = result["data"]["user_name"];
		}
		else if(result["data"]["creator"]) {
			if(typeof result["data"]["creator"] === "object") {
				author = "";
				for(const person of result["data"]["creator"]) {
					author += `${person}, `;
				}
				author = author.slice(0, -2);
			}
			else {
				author = result["data"]["creator"];
			}
		}
		return decodeURIComponent(JSON.parse('"' + author.replace('"', '\\"') + '"'));
	}
}

export { SauceResult };