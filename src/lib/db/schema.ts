
// src/lib/db/schema.ts
import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email(),
  emailVerified: z.date().optional(),
  image: z.string().optional(),
})

export const qrCodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  content: z.record(z.any()),
  backgroundColor: z.string(),
  foregroundColor: z.string(),
  logo: z.string().optional(),
  userId: z.string().optional(),
  teamId: z.string().optional(),
  created: z.date(),
  updated: z.date(),
})