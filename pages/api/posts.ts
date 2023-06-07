import dbConnect from "@/db";
import Post from "@/model/post";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  if (req.method === "GET") {
    const posts = await Post.find({});
    res.status(200).send(posts);
  } else {
    res.status(405).json({ message: "Method not supported." });
  }
}
