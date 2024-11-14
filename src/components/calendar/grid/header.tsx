// src/components/calendar/grid/header.tsx
import { memo } from 'react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

export const CalendarHeader = memo(() => {
  return (
    <div className="grid grid-cols-7 gap-px border-b">
      {WEEKDAYS.map((day) => (
        <div
          key={day}
          className="text-center font-semibold text-sm text-gray-500 py-2"
        >
          {day}
        </div>
      ))}
    </div>
  )
})

CalendarHeader.displayName = 'CalendarHeader'
