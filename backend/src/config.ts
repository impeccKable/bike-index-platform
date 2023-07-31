import dotenv from 'dotenv';

dotenv.config();

const { DB_USER, DB_PASSWORD, BUCKET_NAME, BUCKET_REGION } = process.env;

if (DB_USER === undefined || DB_PASSWORD === undefined || BUCKET_NAME === undefined || BUCKET_REGION === undefined) {
	throw new Error('Missing necessary environment variables');
}

export const config = {
	dbUser: DB_USER,
	dbPassword: DB_PASSWORD,
	bucketName: BUCKET_NAME,
	bucketRegion: BUCKET_REGION,
};
