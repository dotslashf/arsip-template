import { Storage } from "@google-cloud/storage";
import { env } from "~/env";

const BUCKET_NAME = env.GCS_BUCKET_NAME;

const storage = new Storage({
  projectId: env.GCP_PROJECT_ID,
  keyFilename: env.GOOGLE_APPLICATION_CREDENTIALS,
});

export const bucket = storage.bucket(BUCKET_NAME);

export const generateV4WriteSignedUrl = async (
  fileName: string,
  contentType: string,
) => {
  const [url] = await storage
    .bucket(BUCKET_NAME)
    .file(fileName)
    .getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000,
      contentType,
    });
  return url;
};

export const deleteBucketFile = async (fileName: string) => {
  try {
    const fileUuid = fileName.split("/");
    await storage
      .bucket(BUCKET_NAME)
      .file(fileUuid[fileUuid.length - 1]!)
      .delete();
  } catch (err) {
    console.error("ERROR:", err);
  }
};
