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

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const form = useForm<NewPostForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      title: "",
    },
  });


  const onSubmit = (values: NewPostForm) => {
    return fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    })
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
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
                <FormDescription>
                  This is your email.
                </FormDescription>
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
                <FormDescription>
                  This is post&apos;s title.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>Submit</Button>
        </form>
      </Form>
      {form.formState.isSubmitSuccessful ? <Label>Form submitted successfully!</Label> : null}
    </main>
  );
}
