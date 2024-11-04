// src/lib/validations/settings.ts
import * as z from "zod";

export const SettingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  // ... other settings fields with validation rules
});