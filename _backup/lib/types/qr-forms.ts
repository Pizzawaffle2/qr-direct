// File: src/lib/types/qr-forms.ts
import * as z from "zod"

export const baseStyleSchema = z.object({
  backgroundColor: z.string(),
  foregroundColor: z.string(),
  pattern: z.string().optional(),
  margin: z.number().min(0).max(50),
  cornerSquareStyle: z.string().optional(),
  cornerDotStyle: z.string().optional(),
  errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']),
})

export const baseFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  style: baseStyleSchema,
})

export const defaultStyleValues = {
  backgroundColor: "#FFFFFF",
  foregroundColor: "#000000",
  pattern: "squares",
  margin: 20,
  cornerSquareStyle: "square",
  cornerDotStyle: "square",
  errorCorrectionLevel: "M",
} as const

export type BaseStyleValues = z.infer<typeof baseStyleSchema>
export type BaseFormValues = z.infer<typeof baseFormSchema>

// Form-specific schemas
export const emailSchema = baseFormSchema.extend({
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().optional(),
  body: z.string().optional(),
})

export const phoneSchema = baseFormSchema.extend({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
})

export const wifiSchema = baseFormSchema.extend({
  ssid: z.string().min(1, "Network name is required"),
  password: z.string(),
  encryption: z.enum(["WEP", "WPA", "WPA2", ""]),
  hidden: z.boolean().default(false),
})

export const vcardSchema = baseFormSchema.extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  organization: z.string().optional(),
  email: z.string().email("Please enter a valid email").optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number").optional(),
  website: z.string().url("Please enter a valid URL").optional(),
  address: z.string().optional(),
})