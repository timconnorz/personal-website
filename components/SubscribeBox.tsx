"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addSubscriber } from "@/app/actions";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { EmailExistsError } from "@/lib/types";
import JSConfetti from 'js-confetti'

const FormSchema = z.object({
  email: z.string().email(),
})

const SubscribeForm = ({ closeDialog }: 
  {
    closeDialog: () => void;
  }
  ) => {
    
  const jsConfetti = new JSConfetti();

  // 1. Define your form.
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    addSubscriber(data.email).then((res) => {
      jsConfetti.addConfetti({
        emojis: ['❤️', '✉️'],
     });
      closeDialog();
    }).catch((err: any) => {
      console.log(err.message)
      if (err.message === "Email already exists") {
        form.setError("email", {
          type: "manual",
          message: "Email already exists",
        })
      } else {
        form.setError("email", {
          type: "manual",
          message: "Error",
        })
      }
    })
  }

  return (

  <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Email</FormLabel> */}
              <FormControl>
                <Input
                  placeholder="bob@example.com"
                  type="email"  
                  {...field}                
                />
              </FormControl>
              {form.formState.errors.email && (
          <FormMessage>{form.formState.errors.email.message}</FormMessage>
        )}
            </FormItem>
          )}
        />
        <div className="flex flex-row justify-end"><Button type="submit">🎉 Submit</Button></div>
      </form>
    </Form>
  )
}


const SubscribeBox = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Card className="inline-block items-center justify-center py-1 px-2">
      <CardHeader className="flex flex-col items-center pb-0">
        <CardTitle className="mt-0 mb-0 text-md">
          <Image
            src="/mailicon.png"
            alt="mail icon"
            width={30}
            height={30}
            className="w-5 h-5 transform -rotate-12 inline mr-1"
          />
          Get updates from me
        </CardTitle>
        <CardDescription className="text-xs mb-0">
          I send emails very rarely
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center mt-0 pt-4">
        <Dialog open={open}>
          <DialogTrigger onClick={() => setOpen(true)} className="border border-1 p-2 rounded-md bg-gray-800 text-white text-sm">
            Subscribe
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogTitle className="mt-5 mb-0 leading-7 font-normal text-gray-700">
              Enter your email to recieve periodic email updates from me
            </DialogTitle>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <SubscribeForm closeDialog={() => setOpen(false)}/>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SubscribeBox;
