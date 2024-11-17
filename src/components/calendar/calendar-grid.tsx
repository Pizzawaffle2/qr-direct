"use client";

import * as React from "react";
import { useState, useEffect, useMemo, useRef } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getWeek } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/types/calendar";
import { Plus, X, Clock } from "lucide-react";
import { 
  ThemeFrame, 
  DATE_DECORATIONS, 
  getFrameTypeForDate, 
  getDecorationForDate 
} from './calendar-frames';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

interface CalendarGridProps {
  month: number;
  year: number;
  events: CalendarEvent[];
  isEditing: boolean;
  onAddEvent: (event: CalendarEvent) => void;
  onUpdateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  onRemoveEvent: (id: string) => void;
  theme: {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      border: string;
    };
  };
  settings: {
    firstDayOfWeek: 0 | 1; // 0 for Sunday, 1 for Monday
    showWeekNumbers: boolean;
    showHolidays: boolean;
    showLunarPhases: boolean;
  };
}

export function CalendarGrid({
  month,
  year,
  events,
  isEditing,
  onAddEvent,
  onUpdateEvent,
  onRemoveEvent,
  theme,
  settings
}: CalendarGridProps) {
  // Generate calendar dates
  const calendarDates = useMemo(() => {
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(start);
    
    // Adjust for week start
    const firstDay = start.getDay();
    const startOffset = settings.firstDayOfWeek === 1 ? 
      (firstDay === 0 ? 6 : firstDay - 1) : 
      firstDay;

    // Add days before the start of month if needed
    const daysToAdd = startOffset > 0 ? Array.from({ length: startOffset }, (_, i) => 
      new Date(year, month, -startOffset + i)
    ) : [];

    // Get all days in the month
    const monthDays = eachDayOfInterval({ start, end });

    // Calculate how many days we need after the month to complete the grid
    const totalDays = daysToAdd.length + monthDays.length;
    const remainingDays = (7 - (totalDays % 7)) % 7;
    const endPadding = remainingDays > 0 ? Array.from({ length: remainingDays }, (_, i) => 
      new Date(year, month + 1, i + 1)
    ) : [];

    return [...daysToAdd, ...monthDays, ...endPadding];
  }, [month, year, settings.firstDayOfWeek]);

  // Get frame type based on current month
  const frameType = useMemo(() => 
    getFrameTypeForDate(new Date(year, month)), 
    [year, month]
  );

  // Split dates into weeks for rendering
  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < calendarDates.length; i += 7) {
      result.push(calendarDates.slice(i, i + 7));
    }
    return result;
  }, [calendarDates]);

  return (
    <ThemeFrame
      type={frameType}
      cornerStyle={frameType === 'christmas' || frameType === 'autumn' ? frameType : undefined}
      color={theme.colors.primary}
      className="rounded-xl overflow-hidden"
    >
      {/* Header row with weekday names */}
      <div 
        className="grid grid-cols-7 border-b"
        style={{ 
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.border
        }}
      >
        {weeks[0].map((date, index) => (
          <div
            key={`header-${index}`}
            className="p-2 text-center"
          >
            <span className="text-sm font-medium text-white">
              {format(date, 'EEE')}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-border">
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={`week-${weekIndex}`}>
            {settings.showWeekNumbers && (
              <div 
                className="p-2 text-center text-sm text-muted-foreground bg-muted/5"
                style={{ color: theme.colors.text }}
              >
                {getWeek(week[0])}
              </div>
            )}
            {week.map((date) => (
              <CalendarCell
                key={date.toISOString()}
                date={date}
                events={events.filter(event => 
                  format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                )}
                isEditing={isEditing}
                onAddEvent={onAddEvent}
                onUpdateEvent={onUpdateEvent}
                onRemoveEvent={onRemoveEvent}
                theme={theme}
                isCurrentMonth={isSameMonth(date, new Date(year, month))}
                decoration={getDecorationForDate(
                  date,
                  settings.showHolidays && isHoliday(date),
                  events.length > 0
                )}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </ThemeFrame>
  );
}

interface CalendarCellProps {
  date: Date;
  events: CalendarEvent[];
  isEditing: boolean;
  onAddEvent: (event: CalendarEvent) => void;
  onUpdateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  onRemoveEvent: (id: string) => void;
  theme: CalendarGridProps['theme'];
  isCurrentMonth: boolean;
  decoration: keyof typeof DATE_DECORATIONS;
}

function CalendarCell({
  date,
  events,
  isEditing,
  onAddEvent,
  onUpdateEvent,
  onRemoveEvent,
  theme,
  isCurrentMonth,
  decoration
}: CalendarCellProps) {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '' });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddingEvent && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingEvent]);

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return;
    
    onAddEvent({
      id: crypto.randomUUID(),
      title: newEvent.title,
      date: date,
      type: 'event'
    });

    setNewEvent({ title: '' });
    setIsAddingEvent(false);
  };

  return (
    <div
      className={cn(
        "min-h-[120px] relative group p-2",
        "transition-colors duration-200",
        !isCurrentMonth && "opacity-50",
        isToday(date) && "bg-primary/5",
        isEditing && "hover:bg-accent/5"
      )}
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Date number and add button */}
      <div className="flex items-center justify-between">
        <span 
          className={cn(
            "text-sm",
            isToday(date) && "font-semibold"
          )}
          style={{ color: theme.colors.text }}
        >
          {format(date, 'd')}
        </span>
        {isEditing && isCurrentMonth && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsAddingEvent(true)}
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Decoration */}
      {decoration !== 'none' && (
        <div
          className="absolute top-1 right-1"
          dangerouslySetInnerHTML={{ __html: DATE_DECORATIONS[decoration] }}
          style={{ color: theme.colors.primary }}
        />
      )}

      {/* Events list */}
      <div className="space-y-1 mt-1">
        <AnimatePresence mode="popLayout">
          {events.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              isEditing={isEditing}
              onUpdate={onUpdateEvent}
              onRemove={onRemoveEvent}
              theme={theme}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Add event modal */}
      {isAddingEvent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute inset-0 p-2 bg-background border shadow-lg z-10"
          style={{ 
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border
          }}
        >
          <div className="space-y-2">
            <Input
              ref={inputRef}
              value={newEvent.title}
              onChange={(e) => setNewEvent({ title: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newEvent.title.trim()) handleAddEvent();
                if (e.key === 'Escape') setIsAddingEvent(false);
              }}
              placeholder="Add event..."
              className="text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingEvent(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAddEvent}
                disabled={!newEvent.title.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface EventItemProps {
  event: CalendarEvent;
  isEditing: boolean;
  onUpdate: (id: string, event: Partial<CalendarEvent>) => void;
  onRemove: (id: string) => void;
  theme: CalendarGridProps['theme'];
}

function EventItem({ event, isEditing, onUpdate, onRemove, theme }: EventItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="group relative"
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <div 
            className="text-xs p-1 rounded cursor-default break-words"
            style={{ backgroundColor: theme.colors.primary + '20' }}
          >
            {event.title}
          </div>
        </ContextMenuTrigger>
        {isEditing && (
          <ContextMenuContent>
            <ContextMenuItem onClick={() => onUpdate(event.id, { title: prompt('New title:', event.title) || event.title })}>
              Edit
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => onRemove(event.id)}>
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        )}
      </ContextMenu>
    </motion.div>
  );
}

// Helper function to check if a date is a holiday
function isHoliday(date: Date): boolean {
  // Implement holiday checking logic here
  return false;
}

export default CalendarGrid;