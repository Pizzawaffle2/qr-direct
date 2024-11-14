// src/components/calendar/grid/index.tsx
import { useMemo, memo } from 'react'
import { format, isToday, isSameMonth, isSameDay } from 'date-fns'
import { cn } from '@/lib/utils'

// Types
interface CalendarDate {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isDisabled: boolean
}

interface CalendarGridProps {
  selectedDate?: Date
  currentMonth: Date
  onDateSelect: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  className?: string
}

// Constants
const DAYS_IN_WEEK = 7
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

// Utility functions
const isDateDisabled = (date: Date, minDate?: Date, maxDate?: Date): boolean => {
  if (minDate && date < minDate) return true
  if (maxDate && date > maxDate) return true
  return false
}

const getCalendarDays = (
  currentMonth: Date,
  selectedDate?: Date,
  minDate?: Date,
  maxDate?: Date
): CalendarDate[] => {
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
  
  // Get the first day to display (including days from previous month)
  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay())

  const days: CalendarDate[] = []
  const totalDays = DAYS_IN_WEEK * 6 // 6 weeks

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)

    days.push({
      date: currentDate,
      isCurrentMonth: isSameMonth(currentDate, currentMonth),
      isToday: isToday(currentDate),
      isSelected: selectedDate ? isSameDay(currentDate, selectedDate) : false,
      isDisabled: isDateDisabled(currentDate, minDate, maxDate)
    })
  }

  return days
}

// Components
const CalendarHeader = memo(() => (
  <div className="grid grid-cols-7 mb-2">
    {WEEKDAYS.map((day) => (
      <div
        key={day}
        className="text-center py-2 text-sm font-medium text-gray-500"
      >
        {day}
      </div>
    ))}
  </div>
))

CalendarHeader.displayName = 'CalendarHeader'

const CalendarCell = memo(({ 
  date, 
  onSelect 
}: { 
  date: CalendarDate
  onSelect: (date: Date) => void 
}) => (
  <button
    type="button"
    onClick={() => !date.isDisabled && onSelect(date.date)}
    disabled={date.isDisabled}
    className={cn(
      "w-full aspect-square p-1 relative",
      "rounded-lg transition-colors duration-200",
      "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
      date.isCurrentMonth 
        ? "text-gray-900 dark:text-gray-100" 
        : "text-gray-400 dark:text-gray-600",
      date.isDisabled && "opacity-50 cursor-not-allowed",
      date.isSelected && "bg-blue-500 text-white",
      !date.isDisabled && !date.isSelected && "hover:bg-gray-100 dark:hover:bg-gray-800",
      date.isToday && !date.isSelected && "text-blue-600 dark:text-blue-400 font-semibold"
    )}
  >
    <span className="text-sm">
      {format(date.date, 'd')}
    </span>
    {date.isToday && !date.isSelected && (
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
        <div className="h-1 w-1 rounded-full bg-current" />
      </div>
    )}
  </button>
))

CalendarCell.displayName = 'CalendarCell'

// Main Component
export const CalendarGrid = memo(({
  selectedDate,
  currentMonth,
  onDateSelect,
  minDate,
  maxDate,
  className
}: CalendarGridProps) => {
  const calendarDays = useMemo(() => 
    getCalendarDays(currentMonth, selectedDate, minDate, maxDate),
    [currentMonth, selectedDate, minDate, maxDate]
  )

  return (
    <div className={cn("p-4 bg-white dark:bg-gray-900 rounded-lg", className)}>
      <CalendarHeader />
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <CalendarCell
            key={day.date.toISOString()}
            date={day}
            onSelect={onDateSelect}
          />
        ))}
      </div>
    </div>
  )
})

CalendarGrid.displayName = 'CalendarGrid'
