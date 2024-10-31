// File: src/components/qr-code/qr-generator.tsx
"use client"

import { motion } from "framer-motion"
import { QRCodeTabs } from "./qr-code-tabs"
import { ParticleBackground } from "@/components/ui/particle-background"

export function QRGenerator() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <ParticleBackground />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-morphism rounded-3xl backdrop-blur-lg bg-white/5 dark:bg-gray-900/20 p-8"
        >
          <QRCodeTabs />
        </motion.div>
      </div>
    </div>
  )
}
