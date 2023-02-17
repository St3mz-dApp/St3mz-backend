import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import { Config } from "../config";
import { ErrorCode } from "../error/error-code";
import { ErrorException } from "../error/error-exception";

export const uploadFile = async (
  files: File[],
  fileNames: string[],
  folder: string
): Promise<string> => {
  try {
    const s3Client = new S3Client({
      region: Config.awsRegion,
      credentials: fromEnv(),
    });

    await s3Client.send(
      new PutObjectCommand({
        Bucket: Config.s3Bucket,
        Key: folder,
      })
    );

    for (const [i, file] of files.entries()) {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: Config.s3Bucket,
          Key: folder + fileNames[i],
          Body: file,
        })
      );
    }

    const fileUrl = `https://${Config.s3Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${folder}`;
    console.log("Folder url", fileUrl);

    return fileUrl;
  } catch (err: any) {
    throw new ErrorException(ErrorCode.S3UploadError, err);
  }
};
