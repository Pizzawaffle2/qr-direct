// src/components/qr/forms/vcard-form.tsx
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
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { QRCodeData } from "@/types/qr"
import { Separator } from "@/components/ui/separator"

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  organization: z.string().optional(),
  jobTitle: z.string().optional(),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number").optional().or(z.literal("")),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  address: z.string().optional(),
})

interface VCardFormProps {
  value: Partial<QRCodeData>
  onChange: (value: Partial<QRCodeData>) => void
}

export function VCardForm({ value, onChange }: VCardFormProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: value.title || "",
      firstName: value.firstName || "",
      lastName: value.lastName || "",
      organization: value.organization || "",
      jobTitle: value.jobTitle || "",
      email: value.email || "",
      phone: value.phone || "",
      website: value.website || "",
      address: value.address || "",
    },
  })

  const onSubmit = (data: z.infer<typeof schema>) => {
    onChange(data)
  }

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>QR Code Title</FormLabel>
              <FormControl>
                <Input placeholder="Contact QR Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="my-4" />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Personal Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Company Ltd." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Contact Information</h3>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Optional)</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
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
                <FormLabel>Phone (Optional)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website (Optional)</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address (Optional)</FormLabel>
                <FormControl>
                // src/components/qr/forms/vcard-form.tsx (continued)
                  <Textarea 
                    placeholder="Enter complete address..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter the full address including street, city, state, and postal code
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Social Media (Optional)</h3>

          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn Profile</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter/X Profile</FormLabel>
                <FormControl>
                  <Input placeholder="https://twitter.com/username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Additional Information</h3>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any additional information..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Add any additional information you want to include in the vCard
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}