import * as z from "zod"

export const formSchema = z.object({
    email: z.string().email({
      message: "Must be a valid email address.",
    }),
    title: z.string().min(2, {
      message: "Must be minimum 2 characters long.",
    }),
  });

export type NewPostForm = z.infer<typeof formSchema>