// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from '@/db'
import Post from '@/model/post';
import { formSchema } from '@/schemas/newPost'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  if (req.method === "POST") {
    const result = formSchema.safeParse(req.body)
    if (result.success) {
        const { email, title } = result.data
        const newPost = await Post.create({
            userEmail: email,
            title
        })
        res.status(201).json(newPost)
    } else {
        res.status(400).json({ message: result.error.message })
    }
  } else {
    res.status(405).json({ message: "Method not supported." })
  }
}
