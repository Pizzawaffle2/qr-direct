// src/components/calendar/toolbar/types.ts
export type ToolbarOptionType = {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
};

export interface ToolbarSelectProps {
  label: string;
  value: string;
  options: ToolbarOptionType[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}
