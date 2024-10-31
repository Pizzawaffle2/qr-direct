// File: src/lib/types/qr-code.ts
import * as z from "zod"

export const WifiSecurityTypes = ["WEP", "WPA", "WPA2", "nopass"] as const

export const QRDataSchema = {
  url: z.object({
    type: z.literal("URL"),
    url: z.string().url({ message: "Please enter a valid URL" })
  }),
  wifi: z.object({
    type: z.literal("WIFI"),
    ssid: z.string().min(1, "Network name is required"),
    password: z.string(),
    security: z.enum(WifiSecurityTypes),
    hidden: z.boolean().default(false)
  }),
  vcard: z.object({
    type: z.literal("VCARD"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(1, "Phone number is required"),
    company: z.string().optional(),
    title: z.string().optional(),
    url: z.string().url().optional(),
    address: z.string().optional()
  }),
  email: z.object({
    type: z.literal("EMAIL"),
    email: z.string().email("Please enter a valid email"),
    subject: z.string().optional(),
    body: z.string().optional()
  }),
  phone: z.object({
    type: z.literal("PHONE"),
    number: z.string().min(1, "Phone number is required")
  })
}

export type QRCodeData = 
  | z.infer<typeof QRDataSchema.url>
  | z.infer<typeof QRDataSchema.wifi>
  | z.infer<typeof QRDataSchema.vcard>
  | z.infer<typeof QRDataSchema.email>
  | z.infer<typeof QRDataSchema.phone>