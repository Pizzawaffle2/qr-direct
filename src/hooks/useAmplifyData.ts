// src/hooks/useAmplifyData.ts
import {generateClient } from 'aws-amplify/api';
import {Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

export function useCalendars() {
  const fetchCalendars = async () => {
    return await client.models.Calendar.list();
  };

  const createCalendar = async (input: CreateCalendarInput) => {
    return await client.models.Calendar.create(input);
  };

  const updateCalendar = async (input: UpdateCalendarInput) => {
    return await client.models.Calendar.update(input);
  };

  return {
    fetchCalendars,
    createCalendar,
    updateCalendar
  };
}

export function useEvents() {
  const fetchEvents = async (calendarId: string) => {
    return await client.models.Event.list({
      filter: {
        calendarId: {
          eq: calendarId
        }
      }
    });
  };

  const moveEvent = async (eventId: string, newDate: Date) => {
    return await client.models.Event.update({
      id: eventId,
      date: newDate.toISOString()
    });
  };

  return {
    fetchEvents,
    moveEvent
  };
}