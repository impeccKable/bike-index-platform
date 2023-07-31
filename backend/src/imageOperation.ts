import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

export const imageUpload = (uploadedFiles: Express.Multer.File[]) => {
	let filename: string;
	for (const file of uploadedFiles) {
		filename = generateUniqueFilename(file.originalname);
		console.log(filename);
		// console.log("mimetype", file.mimetype);
		// console.log("buffer", file.buffer);
	}
}

export const imageDelete = (deletedFile: string[]) => {
	for (const file of deletedFile) {
		console.log("Deleted file", file);
	}
}

const generateUniqueFilename = (filename: string): string => {
	const extension = path.extname(filename);
	const basename = path.basename(filename, extension).replace(/\s/g, '-');

	const randomString = crypto.randomBytes(5).toString('hex');

	return `${basename}-${randomString}${extension}`;
}