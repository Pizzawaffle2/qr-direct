import React, { useState, useRef } from 'react';
import {CalendarEvent, WeatherData } from '@/types/calendar';
import {motion, AnimatePresence } from 'framer-motion';
import {Button } from '@/components/ui/button';
import {Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import {Textarea } from '@/components/ui/textarea';
import {Plus, X, Menu } from 'lucide-react';
import {cn } from '@/lib/utils';

interface CalendarEventType {
  id: string;
  title: string;
  date: string;
  type: 'event' | 'reminder';
}

export interface CalendarDayProps {
  day: number;
  events: CalendarEvent[];
  weather: WeatherData;
  onAddEvent: (event: CalendarEvent) => void;
  isEditing: boolean;
  onRemoveEvent: (id: string) => void;
  onUpdateEvents: (events: CalendarEvent[]) => void;
}
export const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  events,
  isEditing,
  onRemoveEvent,
  onUpdateEvents,
  onAddEvent,
}) => {
  const [quickAdd, setQuickAdd] = useState('');
  const [isAddingText, setIsAddingText] = useState(false);
  const quickAddRef = useRef<HTMLInputElement>(null);

  const addQuickEvent = () => {
    onAddEvent({
      id: crypto.randomUUID(),
      title: quickAdd,
      date: new Date(),
      type: 'event',
    });

    setQuickAdd('');
  };

  const onUpdateEvent = (id: string, updatedEvent: { title: string }) => {
    const updatedEvents = events.map((event) =>
      event.id === id ? { ...event, ...updatedEvent } : event
    );
    onUpdateEvents(updatedEvents);
  };

  return (
    <div className="group h-full p-2 hover:bg-gray-50/50">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium">{day}</span>
        {isEditing && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Type an event..."
                  value={quickAdd}
                  onValueChange={setQuickAdd}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addQuickEvent();
                  }}
                />
                <CommandList>
                  <CommandGroup heading="Quick Actions">
                    <CommandItem onSelect={() => setIsAddingText(true)}>
                      <Menu className="mr-2 h-4 w-4" />
                      Add detailed note
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Events display */}
      <div className="space-y-1">
        <AnimatePresence>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                'group/event relative rounded-sm p-1.5 text-sm',
                'hover:bg-white/50 hover:ring-1 hover:ring-gray-200',
                event.type === 'reminder' ? 'bg-gray-50' : 'bg-blue-50/50'
              )}
            >
              <div className="flex min-h-[20px] items-start gap-1">
                {event.type === 'event&apos; ? (
                  <Textarea
                    value={event.title}
                    onChange={(e) => onUpdateEvent(event.id, { title: e.target.value })}
                    className="min-h-[60px] resize-none bg-transparent text-xs"
                    placeholder="Add note..."
                    disabled={!isEditing}
                  />
                ) : (
                  <span className="text-xs">{event.title}</span>
                )}
              </div>
              {isEditing && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveEvent(event.id)}
                  className="absolute -right-1 -top-1 h-5 w-5 p-0 opacity-0 group-hover/event:opacity-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Quick add input - visible on hover when editing */}
        {isEditing && !events.length && (
          <input
            ref={quickAddRef}
            type="text"
            placeholder="Click to add..."
            className="w-full cursor-text border-0 bg-transparent px-1.5 py-1 text-xs placeholder:text-gray-400 focus:ring-0"
            value={quickAdd}
            onChange={(e) => setQuickAdd(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === &apos;Enter') addQuickEvent();
            }}
          />
        )}
      </div>
    </div>
  );
};
