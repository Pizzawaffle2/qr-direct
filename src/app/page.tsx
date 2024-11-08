// src/app/page.tsx
"use client"

import { QRCodeTabs } from "@/components/qr-code-tabs"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useHistoryStore } from "@/lib/store/history-store"
import { format } from "date-fns"
import Link from "next/link"
import { Parallax, ParallaxProvider } from 'react-scroll-parallax'
import { motion, AnimatePresence } from "framer-motion"
import { 
  FileText, 
  Share2, 
  Database, 
  ArrowRight, 
  Download, 
  History,
  Zap,
  Shield,
  BarChart,
  Palette,
  Globe,
  Users
} from "lucide-react"
import { ParticleBackground } from "@/components/ui/particle-background"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SUBSCRIPTION_PLANS } from "@/config/subscription"
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { CalendarToolbar } from "@/components/calendar/calendar-toolbar";
import { CalendarExport } from "@/components/calendar/calendar-export";
import { useRef, useState } from "react";

const features = [
  { 
    icon: FileText, 
    title: "Multiple QR Types",
    description: "Generate QR codes for URLs, WiFi, vCards, text, email, and more",
    color: "text-blue-400"
  },
  {
    icon: Palette,
    title: "Custom Design",
    description: "Customize colors, add logos, and choose from various styles",
    color: "text-purple-400"
  },
  {
    icon: BarChart,
    title: "Advanced Analytics",
    description: "Track scans, locations, and engagement in real-time",
    color: "text-green-400"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Secure QR codes with advanced encryption and protection",
    color: "text-red-400"
  },
  {
    icon: Globe,
    title: "Dynamic QR Codes",
    description: "Update content anytime without regenerating codes",
    color: "text-yellow-400"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together with your team on QR campaigns",
    color: "text-pink-400"
  }
]

const calendarRef = useRef<HTMLDivElement>(null);
const [month, setMonth] = useState(new Date().getMonth());
const [year, setYear] = useState(new Date().getFullYear());
const [theme, setTheme] = useState("default");
const [frame, setFrame] = useState("none");
const [font, setFont] = useState("arial");

const handleThemeChange = (selectedTheme: string) => setTheme(selectedTheme);
const handleFrameChange = (selectedFrame: string) => setFrame(selectedFrame);
const handleFontChange = (selectedFont: string) => setFont(selectedFont);

const stats = [
  { 
    label: "QR Codes Generated", 
    value: "1M+",
    description: "Trusted by businesses worldwide"
  },
  { 
    label: "Active Users", 
    value: "50K+",
    description: "Growing community of creators"
  },
  { 
    label: "Scan Rate", 
    value: "99.9%",
    description: "Industry-leading reliability"
  }
]

export default function Home() {
  const { data: session } = useSession()
  const { history } = useHistoryStore()
  
  return (
    <ParallaxProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden">
        <ParticleBackground />

        <div className="container mx-auto px-4 py-24">
          {/* Hero Section */}
          <Parallax translateY={[-20, 20]}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto mb-20"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <Badge
                  variant="outline"
                  className="px-4 py-1 border-blue-400/20 bg-blue-400/10"
                >
                  <Zap className="mr-2 h-4 w-4 text-blue-400" />
                  New: AI-powered QR code templates
                </Badge>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Create Professional
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  QR Codes and Calendars Instantly
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-8">
                Generate beautiful, trackable QR codes and customized printable calendars for your brand.
                Trusted by over 50,000 businesses worldwide.
              </p>

              {!session ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                    asChild
                  >
                    <Link href="/register">
                      Get Started Free
                      <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              ) : (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                  asChild
                >
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              )}
            </motion.div>
          </Parallax>

          {/* QR Code Generator Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-32"
          >
            <div className="glass-morphism rounded-3xl p-8">
              <QRCodeTabs />
            </div>
          </motion.div>

          {/* Calendar Generator Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-32"
          >
            <div className="glass-morphism rounded-3xl p-8">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
                Create Your Custom Calendar
              </h2>
              <CalendarToolbar
                onThemeChange={handleThemeChange}
                onFrameChange={handleFrameChange}
                onFontChange={handleFontChange}
              />
              <div
                ref={calendarRef}
                className={`my-4 p-4 border rounded ${theme === "holiday" ? "bg-red-100" : "bg-white"} ${
                  font === "serif" ? "font-serif" : font === "monospace" ? "font-mono" : "font-sans"
                }`}
                style={{
                  borderImage: frame !== "none" ? `url(/images/frames/${frame}.png) 30 stretch` : "none",
                }}
              >
                <CalendarGrid
                  month={month}
                  year={year}
                  onSelectDate={(date) => console.log("Selected date:", date)}
                />
              </div>
              <CalendarExport calendarRef={calendarRef} />
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-32"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-400 text-center mb-12">
              Powerful features to create and manage your QR codes
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-morphism h-full">
                      <CardContent className="p-6">
                        <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Stats Section */}
          <div className="mb-32">
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-morphism p-6 rounded-2xl text-center"
                >
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-white mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-400">
                    {stat.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent QR Codes */}
          {session && history.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-morphism rounded-3xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Recent QR Codes</h2>
                <Button 
                  variant="outline"
                  className="hover:bg-white/10"
                  asChild
                >
                  <Link href="/history">
                    <History className="mr-2 h-4 w-4" />
                    View History
                  </Link>
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {history.slice(0, 3).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-morphism p-4 rounded-xl"
                    >
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="w-full mb-4 rounded-lg"
                      />
                      <h3 className="text-white font-medium mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Created {format(new Date(item.created), 'PPp')}
                      </p>
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                      >
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-32"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-400 mb-8">
              Join thousands of businesses using QR Direct
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
              asChild
            >
              <Link href={session ? "/dashboard" : "/register"}>
                {session ? "Go to Dashboard" : "Create Free Account"}
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </ParallaxProvider>
  )
}