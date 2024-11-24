// src/lib/validations/settings.ts
import {z } from 'zod';

// Type definitions for better code organization
type ValidationConfig = {
  readonly name: {
    readonly minLength: number;
    readonly maxLength: number;
  };
  readonly email: {
    readonly maxLength: number;
  };
};

// Validation configuration
const validationConfig: ValidationConfig = {
  name: {
    minLength: 2,
    maxLength: 50,
  },
  email: {
    maxLength: 254, // Maximum length for email addresses according to RFC 5321
  },
} as const;

// Validation error messages
const errorMessages = {
  name: {
    required: 'Name is required',
    tooShort: `Name must be at least ${validationConfig.name.minLength} characters`,
    tooLong: `Name must be less than ${validationConfig.name.maxLength} characters`,
    invalid: 'Name can only contain letters, numbers, and spaces',
  },
  email: {
    required: 'Email is required',
    invalid: 'Please enter a valid email address',
    tooLong: `Email must be less than ${validationConfig.email.maxLength} characters`,
  },
} as const;

// Individual field schemas with detailed validation
export const nameSchema = z
  .string()
  .min(validationConfig.name.minLength, errorMessages.name.tooShort)
  .max(validationConfig.name.maxLength, errorMessages.name.tooLong)
  .regex(/^[\p{L}\p{N}\s'-]+$/u, errorMessages.name.invalid)
  .trim();

export const emailSchema = z
  .string()
  .min(1, errorMessages.email.required)
  .max(validationConfig.email.maxLength, errorMessages.email.tooLong)
  .email(errorMessages.email.invalid)
  .trim()
  .toLowerCase();

// Main settings schema with transformed output
export const SettingsSchema = z
  .object({
    name: nameSchema.transform((val) => val.trim()),
    email: emailSchema.transform((val) => val.toLowerCase().trim()),
  })
  .strict();

// Type inference for TypeScript usage
export type Settings = z.infer<typeof SettingsSchema>;

// Validation helper function
export const validateSettings = (data: unknown): Settings => {
  return SettingsSchema.parse(data);
};

// Type inference
export type SettingsFormData = z.infer<typeof SettingsSchema>;
