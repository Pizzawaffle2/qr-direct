// src/lib/validations/config.ts
import { z } from "zod"
import { TEAM_CONFIG, QR_CONFIG, SUBSCRIPTION_PLANS } from "@/config"

// Base schemas
export const hexColorSchema = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color code")

export const urlSchema = z
  .string()
  .url()
  .or(z.string().regex(/^\/[a-zA-Z0-9-_/]*$/, "Invalid URL format"))

// QR Code Schemas
export const qrStyleSchema = z.object({
  size: z.number().min(QR_CONFIG.minSize).max(QR_CONFIG.maxSize),
  margin: z.number().min(0).max(10),
  errorCorrection: z.enum(["L", "M", "Q", "H"]),
  darkColor: hexColorSchema,
  lightColor: hexColorSchema,
  logo: z.string().url().optional(),
})

export const qrUrlSchema = z.object({
  type: z.literal("url"),
  url: z.string().url("Please enter a valid URL"),
})

export const qrTextSchema = z.object({
  type: z.literal("text"),
  text: z.string().min(1, "Text is required"),
})

export const qrEmailSchema = z.object({
  type: z.literal("email"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().optional(),
  body: z.string().optional(),
})

export const qrPhoneSchema = z.object({
  type: z.literal("phone"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
})

export const qrSmsSchema = z.object({
  type: z.literal("sms"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
  message: z.string().optional(),
})

export const qrWifiSchema = z.object({
  type: z.literal("wifi"),
  ssid: z.string().min(1, "SSID is required"),
  password: z.string().optional(),
  networkType: z.enum(["WEP", "WPA", "nopass"]),
  hidden: z.boolean().default(false),
})

export const qrLocationSchema = z.object({
  type: z.literal("location"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  name: z.string().optional(),
})

export const qrVcardSchema = z.object({
  type: z.literal("vcard"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  organization: z.string().optional(),
  title: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
})

export const qrDataSchema = z.discriminatedUnion("type", [
  qrUrlSchema,
  qrTextSchema,
  qrEmailSchema,
  qrPhoneSchema,
  qrSmsSchema,
  qrWifiSchema,
  qrLocationSchema,
  qrVcardSchema,
])

// Subscription Schemas
export const subscriptionLimitsSchema = z.object({
  qrCodes: z.number(),
  templates: z.number(),
  storage: z.number(),
  analytics: z.enum(["basic", "advanced", "enterprise"]),
  teamMembers: z.number(),
})

export const paidSubscriptionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: z.enum([
    "incomplete",
    "incomplete_expired",
    "trialing",
    "active",
    "past_due",
    "canceled",
    "unpaid",
  ]),
  plan: z.enum(["pro", "enterprise"]),
  priceId: z.string(),
  quantity: z.number().min(1),
  cancelAtPeriodEnd: z.boolean(),
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  endedAt: z.date().nullable(),
  canceledAt: z.date().nullable(),
  trialEndsAt: z.date().nullable(),
})

// Team Schemas
export const teamRoleSchema = z.enum(["OWNER", "ADMIN", "MEMBER", "VIEWER"])

export const teamInviteSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  role: teamRoleSchema,
  teamId: z.string(),
  expiresAt: z.date().optional(),
})

export const teamCreateSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
})

export const teamMemberSchema = z.object({
  userId: z.string(),
  teamId: z.string(),
  role: teamRoleSchema,
  invitedBy: z.string(),
  joinedAt: z.date().optional(),
  expiresAt: z.date().optional(),
})

// Template Schemas
export const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  style: qrStyleSchema,
  isPublic: z.boolean().default(false),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

// Analytics Schemas
export const analyticsEventSchema = z.object({
  qrCodeId: z.string(),
  event: z.enum(["scan", "view", "click"]),
  metadata: z.record(z.unknown()).optional(),
  userAgent: z.string().optional(),
  ip: z.string().optional(),
  referer: z.string().optional(),
  timestamp: z.date(),
})

// API Request Validation Schemas
export const apiKeyCreateSchema = z.object({
  name: z.string().min(1, "API key name is required"),
  expiresAt: z.date().optional(),
  scopes: z.array(z.string()).optional(),
})

export const apiRateLimitSchema = z.object({
  window: z.number(),
  max: z.record(z.number()),
})

// Usage Tracking Schemas
export const usageSchema = z.object({
  qrCodesCreated: z.number(),
  templatesCreated: z.number(),
  storage: z.number(),
  apiCalls: z.number(),
  period: z.date(),
})

// Settings Schemas
export const userSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  defaultQRStyle: qrStyleSchema.optional(),
  emailNotifications: z.boolean(),
  analyticsEnabled: z.boolean(),
})

// Environment Variables Schema
export const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  DATABASE_URL: z.string(),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  STRIPE_API_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_PRO_PRICE_ID: z.string().min(1),
  STRIPE_ENTERPRISE_PRICE_ID: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
})

// Utility function to validate environment variables
export function validateEnv() {
  try {
    envSchema.parse(process.env)
    return true
  } catch (error) {
    console.error("Invalid environment variables:", error)
    return false
  }
}