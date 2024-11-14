
// src/components/calendar/toolbar/toolbar-select.tsx
import { memo } from 'react'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ToolbarSelectProps } from './types'
import { ToolbarSelectOption } from '@/components/calendar/toolbar/types'

export const ToolbarSelect = memo(({
  label,
  value,
  options,
  onChange,
  disabled = false,
  className
}: ToolbarSelectProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label 
        htmlFor={`select-${label.toLowerCase()}`}
        className="text-sm font-medium text-gray-200"
      >
        {label}
      </Label>
      
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger 
          id={`select-${label.toLowerCase()}`}
          className={cn(
            "w-[180px] bg-gray-800/50 border-gray-700",
            "hover:bg-gray-800/70 focus:ring-2 focus:ring-blue-500/50",
            "transition-colors duration-200",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>

        <SelectContent 
          className={cn(
            "bg-gray-800 border-gray-700",
            "backdrop-blur-lg"
          )}
        >
          {options.map((option: ToolbarSelectOption) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={cn(
                "text-gray-200",
                "hover:bg-gray-700/50",
                "focus:bg-gray-700/50",
                "transition-colors duration-200",
                "flex items-center gap-2"
              )}
            >
              {option.icon && (
                <option.icon className="h-4 w-4 text-gray-400" />
              )}
              <span>{option.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {options.find((opt: ToolbarSelectOption) => opt.value === value)?.description && (
        <p className="text-xs text-gray-400 mt-1">
          {options.find((opt: ToolbarSelectOption) => opt.value === value)?.description}
        </p>
      )}
    </div>
  )
})

ToolbarSelect.displayName = 'ToolbarSelect'
