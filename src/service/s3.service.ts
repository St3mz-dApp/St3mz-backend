import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import { Config } from "../config";

const s3Client = new S3Client({
  region: Config.awsRegion,
  credentials: fromEnv(),
});

export const createFolder = async (folder: string): Promise<boolean> => {
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: Config.s3Bucket,
        Key: folder,
      })
    );

    const fileUrl = `https://${Config.s3Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${folder}`;
    console.log("Folder url", fileUrl);

    return true;
  } catch (err: any) {
    console.log("Error", err);
    return false;
  }
};

export const uploadFile = async (
  folder: string,
  file: File
): Promise<string> => {
  try {
    const res = await s3Client.send(
      new PutObjectCommand({
        Bucket: Config.s3Bucket,
        Key: folder + file.name,
        Body: file,
      })
    );

    const fileUrl = `https://${Config.s3Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${folder}/${file.name}`;
    console.log("File url", fileUrl);

    return fileUrl;
  } catch (err: any) {
    console.log("Error", err);
    return "";
  }
};
