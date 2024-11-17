"use client";

import { useState } from 'react';
import { 
  addDays, 
  addWeeks, 
  addMonths, 
  addYears,
  isSameDay,
  eachDayOfInterval,
  isWithinInterval
} from 'date-fns';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Repeat, 
  Calendar,
  CheckCircle2
} from "lucide-react";

interface RecurringEventProps {
  startDate: Date;
  endDate?: Date;
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval?: number;
  weekdays?: number[];
  monthDay?: number;
  exceptions?: Date[];
  occurrences?: number;
}

export function createRecurringEvents(
  baseEvent: RecurringEventProps
): Date[] {
  const dates: Date[] = [];
  const { startDate, endDate, frequency, interval = 1, weekdays, monthDay, exceptions = [], occurrences } = baseEvent;

  // Calculate end based on occurrences or endDate
  const maxDate = endDate || (occurrences 
    ? addYears(startDate, 10) // Reasonable maximum
    : addYears(startDate, 1)); // Default to 1 year if no end specified

  let currentDate = startDate;
  let count = 0;

  while (currentDate <= maxDate && (!occurrences || count < occurrences)) {
    if (!exceptions.some(date => isSameDay(date, currentDate))) {
      switch (frequency) {
        case 'daily':
          dates.push(currentDate);
          currentDate = addDays(currentDate, interval);
          break;

        case 'weekly':
          if (weekdays) {
            weekdays.forEach(day => {
              const dayDate = addDays(currentDate, (day - currentDate.getDay() + 7) % 7);
              if (dayDate <= maxDate) {
                dates.push(dayDate);
              }
            });
            currentDate = addWeeks(currentDate, interval);
          } else {
            dates.push(currentDate);
            currentDate = addWeeks(currentDate, interval);
          }
          break;

        case 'monthly':
          if (monthDay) {
            const targetDay = monthDay;
            const monthDate = new Date(currentDate);
            monthDate.setDate(targetDay);
            if (monthDate <= maxDate) {
              dates.push(monthDate);
            }
            currentDate = addMonths(currentDate, interval);
          } else {
            dates.push(currentDate);
            currentDate = addMonths(currentDate, interval);
          }
          break;

        case 'yearly':
          dates.push(currentDate);
          currentDate = addYears(currentDate, interval);
          break;
      }
      count++;
    } else {
      currentDate = addDays(currentDate, 1);
    }
  }

  return dates;
}

export function RecurringEventForm({
  onSubmit,
  initialValues
}: {
  onSubmit: (values: RecurringEventProps) => void;
  initialValues?: Partial<RecurringEventProps>;
}) {
  const [values, setValues] = useState<RecurringEventProps>({
    startDate: new Date(),
    title: '',
    frequency: 'weekly',
    interval: 1,
    ...initialValues
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Repeat</Label>
        <Select
          value={values.frequency}
          onValueChange={(val: RecurringEventProps['frequency']) => 
            setValues(prev => ({ ...prev, frequency: val }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {values.frequency === 'weekly' && (
        <div className="space-y-2">
          <Label>Repeat on</Label>
          <div className="flex gap-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <Button
                key={i}
                variant={values.weekdays?.includes(i) ? "default" : "outline"}
                className="w-8 h-8 p-0"
                onClick={() => {
                  const weekdays = values.weekdays || [];
                  setValues(prev => ({
                    ...prev,
                    weekdays: weekdays.includes(i) 
                      ? weekdays.filter(d => d !== i)
                      : [...weekdays, i]
                  }));
                }}
              >
                {day}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="space-y-2 flex-1">
          <Label>Interval</Label>
          <Input
            type="number"
            min={1}
            value={values.interval}
            onChange={e => setValues(prev => ({ 
              ...prev, 
              interval: parseInt(e.target.value) || 1 
            }))}
          />
        </div>

        <div className="space-y-2 flex-1">
          <Label>Occurrences</Label>
          <Input
            type="number"
            min={1}
            value={values.occurrences}
            onChange={e => setValues(prev => ({ 
              ...prev, 
              occurrences: parseInt(e.target.value) || undefined 
            }))}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          Advanced
        </Button>
        <Button
          onClick={() => onSubmit(values)}
        >
          Create Recurring Event
        </Button>
      </div>

      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t">
          {/* Add advanced options like exceptions */}
        </div>
      )}
    </div>
  );
}