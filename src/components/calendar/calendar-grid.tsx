// src/components/calendar/calendar-grid.tsx
import { useState, useEffect, useMemo } from "react"
import { format, startOfMonth, endOfMonth, addDays, isSameMonth, isToday } from "date-fns"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface CalendarGridProps {
  month: number
  year: number
  onSelectDate: (date: Date) => void
  selectedDate?: Date
  className?: string
}

export function CalendarGrid({
  month,
  year,
  onSelectDate,
  selectedDate,
  className
}: CalendarGridProps) {
  // Generate calendar dates
  const calendarDates = useMemo(() => {
    const start = startOfMonth(new Date(year, month))
    const end = endOfMonth(start)
    const dates: Date[] = []

    let currentDate = start
    while (currentDate <= end) {
      dates.push(currentDate)
      currentDate = addDays(currentDate, 1)
    }

    return dates
  }, [month, year])

  // Week day headers
  const weekDays = useMemo(() => (
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
      <div
        key={day}
        className="text-center font-semibold text-sm text-gray-500 py-2"
      >
        {day}
      </div>
    ))
  ), [])

  return (
    <div className={cn(
      "rounded-lg bg-white shadow-sm",
      className
    )}>
      {/* Calendar Header */}
      <div className="grid grid-cols-7 gap-px border-b">
        {weekDays}
      </div>

      {/* Calendar Body */}
      <div className="grid grid-cols-7 gap-px p-2">
        <AnimatePresence mode="wait">
          {calendarDates.map((date) => (
            <CalendarCell
              key={date.toISOString()}
              date={date}
              isSelected={selectedDate ? isSameMonth(date, selectedDate) && date.getDate() === selectedDate.getDate() : false}
              onSelect={onSelectDate}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface CalendarCellProps {
  date: Date
  isSelected: boolean
  onSelect: (date: Date) => void
}

function CalendarCell({ date, isSelected, onSelect }: CalendarCellProps) {
  const isCurrentDay = isToday(date)

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(date)}
      className={cn(
        "p-2 w-full rounded-md transition-colors relative",
        "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
        isSelected && "bg-blue-500 text-white hover:bg-blue-600",
        isCurrentDay && !isSelected && "text-blue-600 font-semibold"
      )}
    >
      <span className="text-sm">
        {format(date, "d")}
      </span>
      
      {isCurrentDay && !isSelected && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="h-1 w-1 rounded-full bg-blue-500" />
        </div>
      )}
    </motion.button>
  )
}
