import { Storage } from '@google-cloud/storage';

const serviceAccount = process.env.INDOME_GCP_SERVICE_ACCOUNT!;
const bucketName = process.env.INDOME_GCP_BUCKET!;

const storage = new Storage(serviceAccount ? {
  credentials: JSON.parse(serviceAccount),
} : {});

if (!bucketName) {
  throw new Error('Please configure the bucket name setting!');
}

export const indomeBucket = storage.bucket(bucketName);
