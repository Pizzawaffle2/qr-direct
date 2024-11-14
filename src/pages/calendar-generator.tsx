// src/pages/calendar-generator.tsx
"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { ParallaxProvider } from "react-scroll-parallax"
import { CalendarGrid } from "@/components/calendar/calendar-grid"
import { CalendarToolbar } from "@/components/calendar/calendar-toolbar"
import { CalendarExport } from "@/components/calendar/calendar-export"
import { ParticleBackground } from "@/components/ui/particle-background"
import { useCalendarSettings } from "@/hooks/use-calendar-settings"
import { cn } from "@/lib/utils"

interface CalendarSettings {
  theme: CalendarTheme
  frame: CalendarFrame
  font: CalendarFont
}

type CalendarTheme = "default" | "holiday" | "modern" | "minimal"
type CalendarFrame = "none" | "classic" | "modern" | "elegant"
type CalendarFont = "arial" | "serif" | "monospace" | "custom"

export default function CalendarGeneratorPage() {
  // Refs
  const calendarRef = useRef<HTMLDivElement>(null)

  // Custom hook for calendar settings
  const { settings, updateSetting } = useCalendarSettings({
    theme: "default",
    frame: "none",
    font: "arial"
  })

  // Date state
  const [currentDate, setCurrentDate] = useState(() => new Date())

  return (
    <ParallaxProvider>
      <CalendarLayout>
        <ParticleBackground />
        <CalendarContainer>
          <CalendarContent
            ref={calendarRef}
            currentDate={currentDate}
            settings={settings}
            onDateChange={setCurrentDate}
            onSettingsChange={updateSetting}
          />
        </CalendarContainer>
      </CalendarLayout>
    </ParallaxProvider>
  )
}

// Extracted components for better organization
interface CalendarLayoutProps {
  children: React.ReactNode
}

function CalendarLayout({ children }: CalendarLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden">
      {children}
    </div>
  )
}

interface CalendarContainerProps {
  children: React.ReactNode
}

function CalendarContainer({ children }: CalendarContainerProps) {
  return (
    <div className="container mx-auto px-4 py-24">
      {children}
    </div>
  )
}

interface CalendarContentProps {
  currentDate: Date
  settings: CalendarSettings
  onDateChange: (date: Date) => void
  onSettingsChange: <K extends keyof CalendarSettings>(
    key: K,
    value: CalendarSettings[K]
  ) => void
}

const CalendarContent = React.forwardRef<HTMLDivElement, CalendarContentProps>(
  ({ currentDate, settings, onDateChange, onSettingsChange }, ref) => {
    const handleDateSelect = (date: Date) => {
      console.log("Selected date:", date)
      onDateChange(date)
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-32"
      >
        <div className="glass-morphism rounded-3xl p-8">
          <CalendarHeader />
          <CalendarToolbar
            settings={settings}
            onThemeChange={(theme) => onSettingsChange("theme", theme)}
            onFrameChange={(frame) => onSettingsChange("frame", frame)}
            onFontChange={(font) => onSettingsChange("font", font)}
          />
          <CalendarBody
            ref={ref}
            currentDate={currentDate}
            settings={settings}
            onDateSelect={handleDateSelect}
          />
          <CalendarExport calendarRef={ref} />
        </div>
      </motion.div>
    )
  }
)

CalendarContent.displayName = "CalendarContent"

function CalendarHeader() {
  return (
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
      Create Your Custom Calendar
    </h2>
  )
}

interface CalendarBodyProps {
  currentDate: Date
  settings: CalendarSettings
  onDateSelect: (date: Date) => void
}

const CalendarBody = React.forwardRef<HTMLDivElement, CalendarBodyProps>(
  ({ currentDate, settings, onDateSelect }, ref) => {
    const calendarStyles = {
      backgroundColor: settings.theme === "holiday" ? "bg-red-100" : "bg-white",
      fontFamily: settings.font === "serif" 
        ? "font-serif" 
        : settings.font === "monospace" 
          ? "font-mono" 
          : "font-sans",
      borderImage: settings.frame !== "none" 
        ? `url(/images/frames/${settings.frame}.png) 30 stretch` 
        : "none",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "my-4 p-4 border rounded",
          calendarStyles.backgroundColor,
          calendarStyles.fontFamily
        )}
        style={{ borderImage: calendarStyles.borderImage }}
      >
        <CalendarGrid
          month={currentDate.getMonth()}
          year={currentDate.getFullYear()}
          onSelectDate={onDateSelect}
        />
      </div>
    )
  }
)

CalendarBody.displayName = "CalendarBody"

// Custom hook for calendar settings
function useCalendarSettings(initialSettings: CalendarSettings) {
  const [settings, setSettings] = useState<CalendarSettings>(initialSettings)

  const updateSetting = <K extends keyof CalendarSettings>(
    key: K,
    value: CalendarSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return {
    settings,
    updateSetting,
  }
}
