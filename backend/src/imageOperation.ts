import {
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
	ListObjectsCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from './s3Client';
import { config } from './config';

// custom error class for image errors
export class ImageUploadError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ImageUploadError';
	}
}
export class ImageDeletionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ImageDeletionError';
	}
}
export class ImageGetError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ImageGetError';
	}
}

const fileTypeFolders: { [key: string]: string } = {
	'application/pdf': 'pdfs',
	'text/plain': 'txts',
	'application/msword': 'docs',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docs',
	'application/vnd.ms-excel': 'xls',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xls',
};

function getFolderName(type: string): string {
	return fileTypeFolders[type] || 'images';
}

const s3ParamsBase = {
	Bucket: config.bucketName,
}

// upload images to S3 bucket
export async function uploadImage(uploadedFiles: Express.Multer.File[], thiefId: number) {
	const promises = uploadedFiles.map(async (file) => {
		const folderName = getFolderName(file.mimetype);
		const key = `thiefs/${thiefId}/${folderName}/${file.originalname}`;
		const params = {
			...s3ParamsBase,
			Key: key,
			Body: file.buffer,
			ContentType: file.mimetype,
			CacheControl: 'max-age=3600',
		};

		try {
			await s3Client.send(new PutObjectCommand(params));
			console.log(`Uploaded ${key} to ${config.bucketName}`);
		} catch (err) {
			throw new ImageUploadError(`Error uploading ${key} to S3: ${err}`);
		}
	});

	await Promise.all(promises);
}

// delete images from S3 bucket
export async function deleteImage(deletedFile: string[]) {
	const promises = deletedFile.map(async filename => {
		const params = {
			...s3ParamsBase,
			Key: filename,
		};

		try {
			await s3Client.send(new DeleteObjectCommand(params));
			console.log(`Deleting object ${filename} from bucket ${config.bucketName}`);
		} catch (err) {
			throw new ImageDeletionError(`Error deleting object from s3: ${err}`);
		}
	});

	await Promise.all(promises);
}

// get images from S3 bucket
export async function getImage(thiefId: string): Promise<string[]> {
	const prefix = `thiefs/${thiefId}/`;

	const params = {
		...s3ParamsBase,
		Prefix: prefix,
	};

	let response;
	try {
		// get the meta data from s3 bucket to extract keys to generate temporary urls
		response = await s3Client.send(new ListObjectsCommand(params));
	} catch (err) {
		throw new ImageGetError(`Error getting object list from s3: ${err}`);
	}

	// extract keys from response
	const keys: (string | undefined)[] =
		response.Contents?.map((content) => content.Key) || [];

	return getTempImageUrl(keys);
}

// generate temporary URLs for S3 objects
async function getTempImageUrl(keys: (string | undefined)[]): Promise<string[]> {
	const promises = keys.map(async key => {
		const params = {
			...s3ParamsBase,
			Key: key,
		};

		try {
			return await getSignedUrl(s3Client, new GetObjectCommand(params), { expiresIn: 3600 });
		} catch (err) {
			throw new ImageGetError(`Error getting signed URL for key ${key}: ${err}`);
		}
	})

	return Promise.all(promises);
}