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

// upload images to S3 bucket
export async function uploadImage(
	uploadedFiles: Express.Multer.File[],
	thiefId: number
) {
	const promises = uploadedFiles.map((file) => {
		// define the key for S3 bucket object
		const key = `thiefs/${thiefId}/images/${file.originalname}`;

		const params = {
			Bucket: config.bucketName,
			Key: key,
			Body: file.buffer,
			ContentType: file.mimetype,
			CacheControl: 'max-age=3600',
		};

		return s3Client
			.send(new PutObjectCommand(params))
			.then(() => {
				console.log(`Uploading ${params.Key} to ${params.Bucket}`);
			})
			.catch((err) => {
				throw new ImageUploadError(`Error uploaidng image to s3: ${err}`);
			});
	});
	return Promise.all(promises);
}

// delete images from S3 bucket
export async function deleteImage(deletedFile: string[], thiefId: string) {
	const promises = [];
	for (const filename of deletedFile) {
		const key = `thiefs/${thiefId}/images/${filename}`;
		const params = {
			Bucket: config.bucketName,
			Key: key,
		};

		promises.push(
			s3Client
				.send(new DeleteObjectCommand(params))
				.then(() => {
					console.log(
						`Deleting object ${key} from bucket ${config.bucketName}`
					);
				})
				.catch((err) => {
					throw new ImageDeletionError(`Error deleting object from s3: ${err}`);
				})
		);
	}
	return Promise.all(promises);
}

// get images from S3 bucket
export async function getImage(thiefId: string): Promise<string[]> {
	const prefix = `thiefs/${thiefId}/images/`;

	const params = {
		Bucket: config.bucketName,
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

	let urls: string[] = [];
	try {
		// get temporary URL of images
		urls = await getTempImageUrl(keys);
	} catch (err) {
		throw new ImageGetError(`Error getting signed URLs: ${err}`);
	}

	return urls;
}

// generate temporary URLs for S3 objects
async function getTempImageUrl(
	keys: (string | undefined)[]
): Promise<string[]> {
	const urls: string[] = [];

	for (const key of keys) {
		const params = {
			Bucket: config.bucketName,
			Key: key,
		};

		const url = await getSignedUrl(s3Client, new GetObjectCommand(params), {
			expiresIn: 3600,
		});
		urls.push(url);
	}

	return urls;
}
