// components/ui/icons.tsx
import {Calendar, Layout, Star, type LucideIcon } from 'lucide-react';

export type IconName = 'calendar' | 'layout' | 'star';

const icons: Record<IconName, LucideIcon> = {
  calendar: Calendar,
  layout: Layout,
  star: Star,
};

interface IconsProps {
  name: IconName;
  className?: string;
}

export function Icons({ name, className }: IconsProps) {
  const Icon = icons[name];
  return <Icon className={className} />;
}
