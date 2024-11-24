// src/lib/calendar/lunar-utils.ts
export const LUNAR_PHASES = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'] as const;

export function getLunarPhase(date: Date): number {
  const LUNAR_MONTH = 29.53059;
  const KNOWN_NEW_MOON = new Date(2000, 0, 6).getTime();
  const diff = date.getTime() - KNOWN_NEW_MOON;
  const days = diff / (1000 * 60 * 60 * 24);
  const phase = ((days % LUNAR_MONTH) / LUNAR_MONTH) * 8;
  return Math.round(phase) % 8;
}

export function getLunarPhaseEmoji(date: Date): string {
  return LUNAR_PHASES[getLunarPhase(date)];
}

export function getLunarPhaseDescription(date: Date): string {
  const phaseNames = [
    'New Moon',
    'Waxing Crescent',
    'First Quarter',
    'Waxing Gibbous',
    'Full Moon',
    'Waning Gibbous',
    'Last Quarter',
    'Waning Crescent',
  ];
  return phaseNames[getLunarPhase(date)];
}
