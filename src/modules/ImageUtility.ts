import axios from "axios";
import path from "path";
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

	public async compareImages(searchImg: Buffer, resultImg: Buffer): Promise<boolean> {
		const searchMeta = await this.getMetadata(searchImg);
		const resultMeta = await this.getMetadata(resultImg);
		let newSearch: BufferExtension = await sharp(searchImg).raw().toBuffer({ resolveWithObject: true });
		let newResult: BufferExtension = await sharp(resultImg).raw().toBuffer({ resolveWithObject: true });

		if(!searchMeta.width || !searchMeta.height || !resultMeta.width || !resultMeta.height) return false;
		else if(searchMeta.width != resultMeta.width || searchMeta.height != resultMeta.width) {
			const resizeWidth = searchMeta.width > resultMeta.width ? resultMeta.width : searchMeta.width;
			const reszieHeight = searchMeta.height > resultMeta.height ? resultMeta.height : searchMeta.height;
			newSearch = await sharp(searchImg).resize(resizeWidth, reszieHeight)
				.raw().toBuffer({ resolveWithObject: true });
			newResult = await sharp(resultImg).resize(resizeWidth, reszieHeight)
				.raw().toBuffer({ resolveWithObject: true });
		}

		const searchArray = new Uint8ClampedArray(newSearch.data);
		const resultArray = new Uint8ClampedArray(newResult.data);
		let sum: number[] = [0, 0, 0, 0];
		let R: number[] = [];
		let G: number[] = [];
		let B: number[] = [];
		let A: number[] = [];

		for(let i=0; i<searchArray.length; i+=4) {
			sum[0] += Math.pow(searchArray[i] - resultArray[i], 2);
			R.push(searchArray[i], resultArray[i]);
			sum[1] += Math.pow(searchArray[i+1] - resultArray[i+1], 2);
			G.push(searchArray[i+1], resultArray[i+1]);
			sum[2] += Math.pow(searchArray[i+2] - resultArray[i+2], 2);
			B.push(searchArray[i+2], resultArray[i+2]);
			sum[3] += Math.pow(searchArray[i+3] - resultArray[i+3], 2);
			A.push(searchArray[i+3], resultArray[i+3]);
		}

		R.sort((a, b) => a - b);
		G.sort((a, b) => a - b);
		B.sort((a, b) => a - b);
		A.sort((a, b) => a - b);

		let rms: number = 0;
		rms += Math.sqrt(sum[0] / (searchArray.length / 4)) / (R[R.length-1] - R[0]);
		rms += Math.sqrt(sum[1] / (searchArray.length / 4)) / (G[G.length-1] - G[0]);
		rms += Math.sqrt(sum[2] / (searchArray.length / 4)) / (B[B.length-1] - B[0]);
		rms += Math.sqrt(sum[3] / (searchArray.length / 4)) / (A[A.length-1] - A[0]);
		rms /= 4;
		rms = Math.round(rms*1000)/1000;

		let psnr: number = 10 * Math.log10(Math.pow(255, 2) / ((1 / (3 * searchArray.length / 4)) * (sum[0] + sum[1] + sum[2])));
		psnr = Math.round(psnr*100)/100;
		
		console.log(psnr);
		console.log(rms);

		let result: boolean = false;
		const configFilePath = path.join(process.cwd(), "prod", "config.json");
		const config = await import(configFilePath);
		if(config.SauceMaxNRMS > rms || config.SauceMinPSNR < psnr) result = true;

		return result;
	}
	/*
	public async compareImagesEntropy(searchImg: Buffer, resultImg: Buffer): Promise<number> {
		const searchMeta = await this.getMetadata(searchImg);
		const resultMeta = await this.getMetadata(resultImg);
		let newSearch: BufferExtension = await sharp(searchImg).raw().toBuffer({ resolveWithObject: true });
		let newResult: BufferExtension = await sharp(resultImg).raw().toBuffer({ resolveWithObject: true });

		if(!searchMeta.width || !searchMeta.height || !resultMeta.width || !resultMeta.height) return 1;
		else if(searchMeta.width != resultMeta.width || searchMeta.height != resultMeta.width) {
			const resizeWidth = searchMeta.width > resultMeta.width ? resultMeta.width : searchMeta.width;
			const reszieHeight = searchMeta.height > resultMeta.height ? resultMeta.height : searchMeta.height;
			newSearch = await sharp(searchImg).resize(resizeWidth, reszieHeight)
				.raw().toBuffer({ resolveWithObject: true });
			newResult = await sharp(resultImg).resize(resizeWidth, reszieHeight)
				.raw().toBuffer({ resolveWithObject: true });
			sharp(searchImg)
		}
		const searchArray = new Uint8ClampedArray(newSearch.data);
		const resultArray = new Uint8ClampedArray(newResult.data);
	}
	*/
}

export { ImageUtility };