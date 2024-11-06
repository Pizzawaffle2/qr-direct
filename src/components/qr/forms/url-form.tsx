// src/components/qr/forms/url-form.tsx

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
import { QRCodeData } from "@/types/qr"

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Please enter a valid URL"),
})

interface URLFormProps {
  value: Partial<QRCodeData>
  onChange: (value: Partial<QRCodeData>) => void
}

export function URLForm({ value, onChange }: URLFormProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: value.title || "",
      url: value.url || "",
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
                <Input placeholder="My Website" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}