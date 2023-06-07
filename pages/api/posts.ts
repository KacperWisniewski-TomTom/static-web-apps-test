import dbConnect from "@/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const cosmosContainer = await dbConnect();
    const { resources: allPosts } = await cosmosContainer.items.query("SELECT p.id, p.userEmail, p.title from posts p").fetchAll();
    res.status(200).send(allPosts);
  } else {
    res.status(405).json({ message: "Method not supported." });
  }
}
