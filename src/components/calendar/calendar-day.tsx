// src/components/calendar/calendar-day.tsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WeatherData, CalendarEvent } from '@/types/calendar';

interface CalendarDayProps {
  day: number;
  events: CalendarEvent[];
  weather?: WeatherData;
  onAddEvent: (event: string) => void;
  isEditing: boolean;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  events,
  weather,
  onAddEvent,
  isEditing
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState('');

  return (
    <div className="relative min-h-24 p-1 border border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium">{day}</span>
        {isEditing && (
          <button
            type="button"
            title="Add new event"
            onClick={() => setShowAdd(true)}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors print:hidden"
          >
            <Plus className="h-3 w-3" />
          </button>
        )}
      </div>
      
      {weather && (
        <div className="text-xs text-gray-500 mt-1">
          {weather.icon} {weather.temp}°
        </div>
      )}
      
      <div className="space-y-1 mt-2">
        <AnimatePresence>
          {events?.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-xs p-1 rounded bg-blue-100 text-blue-800"
            >
              {event.title}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showAdd && (
        <div className="absolute inset-0 bg-white p-2 shadow-lg z-10">
          <input
            autoFocus
            type="text"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newEvent.trim()) {
                onAddEvent(newEvent);
                setNewEvent('');
                setShowAdd(false);
              }
            }}
            className="w-full text-sm p-1 border rounded"
            placeholder="Add event..."
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setShowAdd(false)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};