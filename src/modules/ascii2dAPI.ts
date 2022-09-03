import { AxiosResponse } from "axios";
import { load } from "cheerio";

class Ascii2dResult {
	$: cheerio.Root;
	results: cheerio.Cheerio;

	constructor(raw: AxiosResponse) {
		const body = raw.data;
		this.$ = load(body);
		this.results = this.$(".row.item-box");
	}

	public getResults(): cheerio.Element[] {
		return this.results.toArray();
	}

	public getThumbnail(result: cheerio.Element): string | undefined {
		return this.$(result).find(".col-xs-12.col-sm-12.col-md-4.col-xl-4.text-xs-center.image-box > img").attr("src");
	}

	public getImageInfo(result: cheerio.Element): cheerio.Cheerio {
		return this.$(result).find(".col-xs-12.col-sm-12.col-md-8.col-xl-8.info-box > .text-muted");
	}

	public getImagePlatform(result: cheerio.Element): cheerio.Cheerio {
		return this.$(result).find(".col-xs-12.col-sm-12.col-md-8.col-xl-8.info-box > .detail-box.gray-link > h6:nth-last-child(1) > small");
	}

	public getPlatformAvatar(result: cheerio.Element): string | undefined {
		return this.$(result).find(".col-xs-12.col-sm-12.col-md-8.col-xl-8.info-box > .detail-box.gray-link > h6:nth-last-child(1) > img").attr("src");
	}

	public getAuthorName(result: cheerio.Element): string {
		return this.$(result).find(".col-xs-12.col-sm-12.col-md-8.col-xl-8.info-box > .detail-box.gray-link > h6:nth-last-child(1) > a:nth-child(3)").text();
	}

	public getAuthorUrl(result: cheerio.Element): string | undefined {
		return this.$(result).find(".col-xs-12.col-sm-12.col-md-8.col-xl-8.info-box > .detail-box.gray-link > h6:nth-last-child(1) > a:nth-child(3)").attr("href");
	}

	public getArtName(result: cheerio.Element): string {
		return this.$(result).find(".col-xs-12.col-sm-12.col-md-8.col-xl-8.info-box > .detail-box.gray-link > h6:nth-last-child(1) > a:nth-child(2)").text();
	}

	public getArtUrl(result: cheerio.Element): string | undefined {
		return this.$(result).find(".col-xs-12.col-sm-12.col-md-8.col-xl-8.info-box > .detail-box.gray-link > h6:nth-last-child(1) > a:nth-child(2)").attr("href");
	}
}

export { Ascii2dResult };