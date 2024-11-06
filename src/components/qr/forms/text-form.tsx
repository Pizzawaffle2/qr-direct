// src/components/qr/forms/text-form.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { QRCodeData } from "@/types/qr"

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  text: z.string().min(1, "Text is required").max(1000, "Text is too long"),
})

interface TextFormProps {
  value: Partial<QRCodeData>
  onChange: (value: Partial<QRCodeData>) => void
}

export function TextForm({ value, onChange }: TextFormProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: value.title || "",
      text: value.text || "",
    },
  })

  const onSubmit = (data: z.infer<typeof schema>) => {
    onChange(data)
  }

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Text QR Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your text here..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
