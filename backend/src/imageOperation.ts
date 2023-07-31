import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3Client';
import { config } from './config';

export const imageUpload = async (uploadedFiles: Express.Multer.File[], thiefId: number) => {
	let baseName: string | null;
	for (const file of uploadedFiles) {
		baseName = generateUniqueFilename(file.originalname);

		if (baseName === null) {
			return;
		}

		baseName = sanitize(baseName); // remove all unwanted characters for s3 bucket
		const key = `${thiefId}/images/${baseName}`;

		const params = {
			Bucket: config.bucketName,
			Key: key,
			Body: file.buffer,
			ContentType: file.mimetype
		};

		try {
			await s3Client.send(new PutObjectCommand(params));
			console.log("Successfully uploaded " +
				params.Key +
				" to " +
				params.Bucket +
				"/" +
				params.Key);
		} catch (err) {
			console.log("Image upload failed", err);
		}
	}
}

export const imageDelete = (deletedFile: string[]) => {
	for (const file of deletedFile) {
		console.log("Deleted file", file);
	}
}

const generateUniqueFilename = (filename: string): string | null => {
	try {
		const extension = path.extname(filename);
		const basename = path.basename(filename, extension);
		const randomString = crypto.randomBytes(5).toString('hex');

		return `${basename}-${randomString}${extension}`;
	} catch (err) {
		console.log("Failed to generate unique filename", err);
		return null;
	}
}

const sanitize = (filename: string): string => {
	return filename.replace(/[^a-zA-Z0-9!_.*()'-]/g, '-');
}