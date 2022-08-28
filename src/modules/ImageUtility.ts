import axios from "axios";
import sharp from "sharp";
import { BufferExtension } from "../interfaces/BufferExtension";

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
		let newSearch: BufferExtension = await sharp(searchImg).grayscale().raw().toBuffer({ resolveWithObject: true });
		let newResult: BufferExtension = await sharp(resultImg).grayscale().raw().toBuffer({ resolveWithObject: true });

		if(!searchMeta.width || !searchMeta.height || !resultMeta.width || !resultMeta.height) return false;
		else if(searchMeta.width != resultMeta.width || searchMeta.height != resultMeta.width) {
			const resizeWidth = searchMeta.width > resultMeta.width ? resultMeta.width : searchMeta.width;
			const reszieHeight = searchMeta.height > resultMeta.height ? resultMeta.height : searchMeta.height;
			newSearch = await sharp(searchImg).resize(resizeWidth, reszieHeight)
				.grayscale().raw().toBuffer({ resolveWithObject: true });
			newResult = await sharp(resultImg).resize(resizeWidth, reszieHeight)
				.grayscale().raw().toBuffer({ resolveWithObject: true });
		}

		const searchArray = new Uint8ClampedArray(newSearch.data);
		const resultArray = new Uint8ClampedArray(newResult.data);
		let sum: number = 0;

		for(let i=0; i<searchArray.length; i++) {
			sum += Math.pow(searchArray[i] - resultArray[i], 2);
		}

		let rmsd = Math.sqrt(sum / searchArray.length);
		console.log((255-rmsd)/255);
	}
}

export { ImageUtility };