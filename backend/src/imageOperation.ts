import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from './s3Client';
import { config } from './config';

export class ImageUploadError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ImageUploadError";
	}
}

export class ImageDeletionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ImageDeletionError";
	}
}

export class ImageGetError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ImageGetError";
	}
}

export const uploadImage = async (uploadedFiles: Express.Multer.File[], thiefId: number) => {
	let baseName: string | null;
	for (const file of uploadedFiles) {
		baseName = generateUniqueFilename(file.originalname);

		// if generate name fails return
		if (baseName === null) {
			throw new ImageUploadError("Fail to generate unique file name");
		}

		// sanitize the name for s3 bucket
		baseName = sanitize(baseName);

		const key = `thiefs/${thiefId}/images/${baseName}`;

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
				params.Bucket);
		} catch (err) {
			throw new ImageUploadError(`Error uploaidng image to s3: ${err}`);
		}
	}
}

export const deleteImage = async (deletedFile: string[]) => {
	for (const key of deletedFile) {
		const params = {
			Bucket: config.bucketName,
			Key: key
		};

		try {
			await s3Client.send(new DeleteObjectCommand(params));
			console.log(`Object ${key} deleted from bucket ${config.bucketName}`);	
		} catch (err) {
			throw new ImageDeletionError(`Error deleting object from s3: ${err}`);
		}
	}
}

export const getImage = async (thiefId: string): Promise<string[]> => {
	const prefix = `thiefs/${thiefId}/images/`;

	const params = {
		Bucket: config.bucketName,
		Prefix: prefix
	};

	let response;
	try {
		response = await s3Client.send(new ListObjectsCommand(params));
	} catch (err) {
		throw new ImageGetError(`Error getting object list from s3: ${err}`);
	}

	const keys: (string | undefined)[] = response.Contents?.map (content => content.Key) || [];

	let urls: string[] = [];
	try {
		urls = await getTempImageUrl(keys);
	} catch (err) {
		throw new ImageGetError(`Error getting signed URLs: ${err}`);
	}

	return urls;
} 

const getTempImageUrl = async (keys: (string | undefined)[]): Promise<string[]> => {
	const urls: string[] = [];

	for (const key of keys) {
		const params = {
			Bucket: config.bucketName,
			Key: key
		};

		const url = await getSignedUrl(s3Client, new GetObjectCommand(params), { expiresIn: 3600 });
		urls.push(url);
	}

	return urls;
}


const generateUniqueFilename = (filename: string): string | null => {
	try {
		const extension = path.extname(filename);
		const basename = path.basename(filename, extension);
		const randomString = crypto.randomBytes(5).toString('hex');

		return `${basename}-${randomString}${extension}`;
	} catch (err) {
		return null;
	}
}

const sanitize = (filename: string): string => {
	return filename.replace(/[^a-zA-Z0-9!_.*()'-]/g, '-');
}