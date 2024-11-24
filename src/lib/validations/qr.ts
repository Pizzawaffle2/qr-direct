// src/lib/validations/qr.ts

import {z } from 'zod';

export const qrBaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
});

export const qrUrlSchema = qrBaseSchema.extend({
  type: z.literal('url'),
  url: z.string().url('Please enter a valid URL'),
});

export const qrTextSchema = qrBaseSchema.extend({
  type: z.literal('text'),
  text: z.string().min(1, 'Text is required').max(1000),
});

export const qrEmailSchema = qrBaseSchema.extend({
  type: z.literal('email'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().optional(),
  body: z.string().optional(),
});

export const qrPhoneSchema = qrBaseSchema.extend({
  type: z.literal('phone'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
});

export const qrSmsSchema = qrBaseSchema.extend({
  type: z.literal('sms'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
  message: z.string().optional(),
});

export const qrWifiSchema = qrBaseSchema.extend({
  type: z.literal('wifi'),
  ssid: z.string().min(1, 'SSID is required'),
  password: z.string().optional(),
  networkType: z.enum(['WEP', 'WPA', 'nopass']),
  hidden: z.boolean().default(false),
});

export const qrLocationSchema = qrBaseSchema.extend({
  type: z.literal('location'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  name: z.string().optional(),
});

export const qrStyleSchema = z.object({
  size: z.number().min(100).max(1000).default(400),
  margin: z.number().min(0).max(10).default(4),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid background color'),
  foregroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid foreground color'),
  errorCorrection: z.enum(['L', 'M', 'Q', 'H']).default('M'),
  logo: z.string().url().optional(),
});

export const qrCreateSchema = z.object({
  data: z.discriminatedUnion('type', [
    qrUrlSchema,
    qrTextSchema,
    qrEmailSchema,
    qrPhoneSchema,
    qrSmsSchema,
    qrWifiSchema,
    qrLocationSchema,
  ]),
  style: qrStyleSchema,
});
