import { OutputInfo } from "sharp";

export interface BufferExtension {
	data: Buffer;
	info: OutputInfo;
}