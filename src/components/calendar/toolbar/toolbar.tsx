// src/components/calendar/toolbar/toolbar.tsx
import { memo } from 'react'
import { ToolbarSelect } from './toolbar-select'
import { TOOLBAR_OPTIONS } from './constants'
import { cn } from '@/lib/utils'

interface ToolbarProps {
  settings: {
    theme: string
    frame: string
    font: string
  }
  onSettingChange: (key: string, value: string) => void
  disabled?: boolean
  className?: string
}

export const Toolbar = memo(({
  settings,
  onSettingChange,
  disabled = false,
  className
}: ToolbarProps) => {
  const handleChange = (key: string) => (value: string) => {
    onSettingChange(key, value)
  }

  return (
    <div
      className={cn(
        "flex flex-wrap gap-6 p-4",
        "border-b border-gray-200/10",
        "bg-gray-900/50 backdrop-blur-sm",
        "transition-colors duration-200",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      role="toolbar"
      aria-label="Calendar customization options"
    >
      <ToolbarSelect
        label="Theme"
        value={settings.theme}
        options={TOOLBAR_OPTIONS.theme}
        onChange={handleChange('theme')}
        disabled={disabled}
      />

      <ToolbarSelect
        label="Frame"
        value={settings.frame}
        options={TOOLBAR_OPTIONS.frame}
        onChange={handleChange('frame')}
        disabled={disabled}
      />

      <ToolbarSelect
        label="Font"
        value={settings.font}
        options={TOOLBAR_OPTIONS.font}
        onChange={handleChange('font')}
        disabled={disabled}
      />
    </div>
  )
})

Toolbar.displayName = 'Toolbar'
