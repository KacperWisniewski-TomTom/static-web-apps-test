import dbConnect from "@/db";
import {
  BlobServiceClient,
} from "@azure/storage-blob";
import { NextApiRequest, NextApiResponse } from "next";

const AZ_STORAGE_CONNECTION_STRING = process.env.AZ_STORAGE_CONNECTION_STRING;
const AZ_BLOB_CONTAINER = process.env.AZ_BLOB_CONTAINER;

if (!AZ_STORAGE_CONNECTION_STRING || !AZ_BLOB_CONTAINER) {
  throw new Error(
    "Please define the AZ_STORAGE_CONNECTION_STRING, AZ_BLOB_CONTAINER environment variables inside .env.local"
  );
}

const blobClient = BlobServiceClient.fromConnectionString(
  AZ_STORAGE_CONNECTION_STRING
);
const containerClient = blobClient.getContainerClient(AZ_BLOB_CONTAINER);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    for await (const _ of containerClient.listBlobsFlat({
      prefix: "posts.json",
    })) {
      const blockBlobClient = containerClient.getBlockBlobClient("posts.json");
      const download = await blockBlobClient.downloadToBuffer();
      res.setHeader("Content-Disposition", 'attachment; filename="posts.json"');
      res.status(200).send(download)
      return;
    }
    res.status(404).json({
      message: "File not found, please save the posts first.",
    });
  } else if (req.method === "POST") {
    const cosmosContainer = await dbConnect();
    const { resources: allPosts } = await cosmosContainer.items.query("SELECT p.id, p.userEmail, p.title from posts p").fetchAll();
    const allPostsJson = JSON.stringify(allPosts);
    const blockBlobClient = containerClient.getBlockBlobClient("posts.json");
    const uploadResponse = await blockBlobClient.upload(
      allPostsJson,
      allPostsJson.length
    );
    if (!uploadResponse.errorCode) {
      res.status(200).json({ message: "Posts successfully saved." });
    } else {
      res.status(500).json({ message: "Something went wrong." });
    }
  } else {
    res.status(405).json({ message: "Method not supported." });
  }
}
