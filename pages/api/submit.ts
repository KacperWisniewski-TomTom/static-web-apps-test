// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "@/db";
import { formSchema } from "@/schemas/newPost";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const cosmosContainer = await dbConnect();
    const result = formSchema.safeParse(req.body);
    if (result.success) {
      const { email, title } = result.data;
      const newPost = await cosmosContainer.items.create({
        userEmail: email,
        title,
      });
      res.status(201).json(newPost.resource);
    } else {
      res.status(400).json({ message: result.error.message });
    }
  } else {
    res.status(405).json({ message: "Method not supported." });
  }
}
