import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { s3 } from "../config/s3.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucket = process.env.AWS_S3_BUCKET_NAME;

const extensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

type ImageMimeType = keyof typeof extensions;

export async function uploadProductImage(file: {
  buffer: Buffer;
  mimetype: string;
}) {
  if (!bucket) {
    throw new Error("AWS_S3_BUCKET_NAME não configurada");
  }

  if (!(file.mimetype in extensions)) {
    throw new Error("Formato de imagem não permitido");
  }

  const mimeType = file.mimetype as ImageMimeType;
  const key = `products/${randomUUID()}.${extensions[mimeType]}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: mimeType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return { key };
}

export async function deleteProductImage(key: string) {
  if (!bucket) {
    throw new Error("AWS_S3_BUCKET_NAME não configurada");
  }

  if (!key.startsWith("products/")) {
    throw new Error("Chave de imagem inválida");
  }

  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

export async function createProductImageUrl(key: string) {
  if (!bucket) {
    throw new Error("AWS_S3_BUCKET_NAME não configurada");
  }

  if (!key.startsWith("products/")) {
    throw new Error("Chave de imagem inválida");
  }

  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
    { expiresIn: 900 },
  );
}
