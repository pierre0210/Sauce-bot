import axios from "axios";
import sharp from "sharp";

class ImageUtility {
	urlSearch: string;
	urlResult: string;

	constructor(urlSearch: string, urlResult: string) {
		this.urlSearch = urlSearch;
		this.urlResult = urlResult;
	}

	public async getSearchImg(): Promise<Buffer> {
		const search = (await axios({ url: this.urlSearch, responseType: "arraybuffer" })).data as Buffer;
		return search;
	}

	public async getResultImg(): Promise<Buffer> {
		const result = (await axios({ url: this.urlResult, responseType: "arraybuffer" })).data as Buffer;
		return result;
	}

	private async getMetadata(img: Buffer): Promise<sharp.Metadata> {
		const metadata = await sharp(img).metadata();
		return metadata;
	}

	public async compareImages(searchImg: Buffer, resultImg: Buffer) {
		const searchMeta = await this.getMetadata(searchImg);
		const resultMeta = await this.getMetadata(resultImg);
		let newSearch: Buffer = searchImg;
		let newResult: Buffer = resultImg;
		if(!searchMeta.width || !searchMeta.height || !resultMeta.width || !resultMeta.height) return false;
		else if(searchMeta.width != resultMeta.width || searchMeta.height != resultMeta.width) {
			const resizeWidth = searchMeta.width > resultMeta.width ? resultMeta.width : searchMeta.width;
			const reszieHeight = searchMeta.height > resultMeta.height ? resultMeta.height : searchMeta.height;
			newSearch = await sharp(searchImg).resize(resizeWidth, reszieHeight).toBuffer();
			newResult = await sharp(resultImg).resize(resizeWidth, reszieHeight).toBuffer();
		}
		
		//console.log(encodeSearch);
		//console.log(encodeResult);
		let difference: number = 0;
		
		console.log(difference);
	}
}

export { ImageUtility };