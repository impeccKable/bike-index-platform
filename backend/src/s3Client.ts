import { S3Client } from '@aws-sdk/client-s3';
import { config } from './config';

const REGION = config.bucketRegion;
const s3Client = new S3Client({ region: REGION });

export { s3Client };