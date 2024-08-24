import { Storage } from "@google-cloud/storage";
import { env } from "~/env";

const storage = new Storage({
  projectId: env.GCP_PROJECT_ID,
  keyFilename: env.GOOGLE_APPLICATION_CREDENTIALS,
});

export const bucket = storage.bucket(env.GCS_BUCKET_NAME);

export const generateV4WriteSignedUrl = async (
  fileName: string,
  contentType: string,
) => {
  const [url] = await storage
    .bucket(env.GCS_BUCKET_NAME)
    .file(fileName)
    .getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000,
      contentType,
    });
  console.log("url", url);
  return url;
};
