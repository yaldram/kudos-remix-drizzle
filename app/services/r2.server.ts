import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fetch, unstable_parseMultipartFormData } from "@remix-run/node";
import type { UploadHandler } from "@remix-run/node";
import cuid from "cuid";

if (
  !process.env.CLOUDFARE_PUBLIC_URL ||
  !process.env.CLOUDFARE_R2_BUCKET_NAME ||
  !process.env.CLOUDFARE_ACCOUNT_ID ||
  !process.env.CLOUDFARE_R2_ACCESS_KEY_ID ||
  !process.env.CLOUDFARE_R2_SECRET_ACCESS_KEY
) {
  throw new Error("Cloudfare Bucket not Setup");
}

const s3Client = new S3({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFARE_R2_SECRET_ACCESS_KEY,
  },
});

export const uploadHandler: UploadHandler = async ({
  name,
  filename = "",
  data,
  contentType,
}) => {
  if (name !== "profile-pic") return;

  const objectName = `${cuid()}.${filename.split(".").slice(-1)}`;
  const bucketName = process.env.CLOUDFARE_R2_BUCKET_NAME;

  const signedUrl = await getSignedUrl(
    s3Client,
    new PutObjectCommand({
      Bucket: bucketName,
      Key: objectName,
      ContentType: contentType,
    }),
    { expiresIn: 60 * 10 } // 600 seconds
  );

  const fileData = await convertToBuffer(data);

  try {
    await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-type": contentType,
      },
      body: fileData,
    });
  } catch (error) {
    console.log("Error Uploading file to cloudfare", error);
  }

  return `${process.env.CLOUDFARE_PUBLIC_URL}/${objectName}`;
};

async function convertToBuffer(buffer: AsyncIterable<Uint8Array>) {
  const result = [];
  for await (const chunk of buffer) {
    result.push(chunk);
  }

  return Buffer.concat(result);
}

export async function uploadAvatar(request: Request) {
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const file = formData.get("profile-pic")?.toString() || "";

  return file;
}
