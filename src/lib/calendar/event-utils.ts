import {CalendarEvent } from '@/types/calendar';

export function createEvent(
  title: string,
  date: Date,
  type: CalendarEvent['type'] = 'event'
): CalendarEvent {
  return {
    id: crypto.randomUUID(),
    title,
    date,
    type,
    color: getEventColor(type),
  };
}

export function getEventColor(type: CalendarEvent['type']): string {
  switch (type) {
    case 'holiday':
      return '#EF4444';
    case 'note':
      return '#8B5CF6';
    default:
      return '#3B82F6';
  }
}

export function groupEventsByDate(events: CalendarEvent[]): Record<string, CalendarEvent[]> {
  return events.reduce(
    (grouped, event) => {
      const dateKey = event.date.toISOString().split('T')[0];
      return {
        ...grouped,
        [dateKey]: [...(grouped[dateKey] || []), event],
      };
    },
    {} as Record<string, CalendarEvent[]>
  );
}

export function sortDayEvents(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => {
    if (a.type === 'holiday') return -1;
    if (b.type === 'holiday') return 1;
    if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
    return a.title.localeCompare(b.title);
  });
}
