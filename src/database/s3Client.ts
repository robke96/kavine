import { s3, S3Client } from "bun";
// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
    accessKeyId: process.env.S3_ACCESSKEYID as string,
    secretAccessKey: process.env.S3_SECRETACCESSKEY as string,
    endpoint: process.env.S3_ENDPOINT as string,
    bucket: process.env.S3_BUCKETNAME as string,
})

export const uploadToS3 = async (fileName: string, file: any) => {
    try {
        const s3file = client.file(fileName);
        await s3file.write(file);

        const endpoint = process.env.S3_ENDPOINT as string
        const url = `${endpoint}/${s3file.bucket}/${s3file.name}`;

        return url;
    } catch (error) {
        console.log("ERROR Uploading file ", error);
    }
}

export default client;