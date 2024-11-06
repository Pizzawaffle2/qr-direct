// src/components/qr/forms/phone-form.tsx
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
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
})

interface PhoneFormProps {
  value: Partial<QRCodeData>
  onChange: (value: Partial<QRCodeData>) => void
}

export function PhoneForm({ value, onChange }: PhoneFormProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: value.title || "",
      phone: value.phone || "",
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
                <Input placeholder="Phone QR Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input 
                  type="tel" 
                  placeholder="+1234567890" 
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