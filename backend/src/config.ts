import dotenv from 'dotenv';
import { S3Client } from '@aws-sdk/client-s3';

const pgp = require('pg-promise')();

dotenv.config();
const { DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD, BUCKET_NAME, BUCKET_REGION } = process.env;
if (DB_HOST === undefined || DB_DATABASE === undefined || DB_USER === undefined || DB_PASSWORD === undefined || BUCKET_NAME === undefined || BUCKET_REGION === undefined) {
	throw new Error('Missing necessary environment variables');
}

export const config = {
	dbHost:       DB_HOST,
	dbDatabase:   DB_DATABASE,
	dbUser:       DB_USER,
	dbPassword:   DB_PASSWORD,
	bucketName:   BUCKET_NAME,
	bucketRegion: BUCKET_REGION,
};

export const db = pgp({
	host:     config.dbHost,
	port:     5432,
	database: config.dbDatabase,
	user:     config.dbUser,
	password: config.dbPassword,
});

export const s3Client = new S3Client({ region: config.bucketRegion });
