// File: src/lib/types/qr-styles.ts
import * as z from "zod"

export const QRStyleSchema = z.object({
  // Basic Settings
  size: z.number().min(100).max(1000).default(300),
  margin: z.number().min(0).max(50).default(4),
  shape: z.enum(["square", "rounded", "dots"]).default("square"),
  errorCorrectionLevel: z.enum(["L", "M", "Q", "H"]).default("M"),
  
  // Colors
  colorScheme: z.object({
    background: z.string().default("#FFFFFF"),
    foreground: z.string().default("#000000"),
    gradient: z.object({
      type: z.enum(["linear", "radial"]).default("linear"),
      start: z.string(),
      end: z.string(),
      direction: z.number().min(0).max(360).optional(),
    }).optional(),
  }),

  // Pattern & Style
  pattern: z.enum(["squares", "dots", "rounded"]).default("squares"),
  cornerSquareStyle: z.enum(["square", "dot", "extra-rounded"]).default("square"),
  cornerDotStyle: z.enum(["square", "dot"]).default("square"),

  // Logo/Image
  logo: z.object({
    image: z.string(),
    size: z.number().min(20).max(150).default(50),
    margin: z.number().min(0).max(20).default(5),
  }).optional(),
})

export type QRStyle = z.infer<typeof QRStyleSchema>

export const defaultStyleValues: QRStyle = {
  size: 300,
  margin: 4,
  shape: "square",
  errorCorrectionLevel: "M",
  colorScheme: {
    background: "#FFFFFF",
    foreground: "#000000",
  },
  pattern: "squares",
  cornerSquareStyle: "square",
  cornerDotStyle: "square",
}
