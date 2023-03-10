import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import { Config } from "../config";

const s3Client = new S3Client({
  region: Config.awsRegion,
  credentials: fromEnv(),
});

export const uploadFile = async (
  folder: string,
  fileName: string,
  file: File | Buffer
): Promise<string> => {
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: Config.s3Bucket,
        Key: `${folder}/${fileName}`,
        Body: file,
      })
    );

    const fileUrl = `https://${Config.s3Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${folder}/${fileName}`;
    console.log("File url", fileUrl);

    return fileUrl;
  } catch (err: any) {
    console.log("Error", err);
    return "";
  }
};
