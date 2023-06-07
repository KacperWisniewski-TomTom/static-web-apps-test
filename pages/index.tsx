import { Inter } from "next/font/google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formSchema, NewPostForm } from "@/schemas/newPost";
import PostList from "@/components/postList";
import useSWR from 'swr';
import { Post } from "@prisma/client";

const inter = Inter({ subsets: ["latin"] });
const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json())

export default function Home() {
  const { data, error, isLoading, mutate } = useSWR<Post[]>('/api/posts', fetcher);
  const form = useForm<NewPostForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      title: "",
    },
  });

  const onSubmit = async (values: NewPostForm) => {
    await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    mutate();
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div>
        <h1>All posts</h1>
        <PostList posts={data} error={error} isLoading={isLoading}/>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="foo.bar@tomtom.com" {...field} />
                </FormControl>
                <FormDescription>This is your email.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="I like pancakes." {...field} />
                </FormControl>
                <FormDescription>This is post&apos;s title.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </Form>
      {form.formState.isSubmitSuccessful ? (
        <Label>Form submitted successfully!</Label>
      ) : null}
    </main>
  );
}
