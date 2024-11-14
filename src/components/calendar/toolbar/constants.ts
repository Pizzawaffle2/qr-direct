
// src/components/calendar/toolbar/constants.ts
import { 
    Palette, 
    Frame, 
    Type 
  } from 'lucide-react'
  
  export const TOOLBAR_OPTIONS = {
    theme: [
      {
        value: 'default',
        label: 'Default',
        icon: Palette,
        description: 'Clean and modern design'
      },
      {
        value: 'minimal',
        label: 'Minimal',
        icon: Palette,
        description: 'Simple and elegant'
      }
    ],
    frame: [
      {
        value: 'none',
        label: 'None',
        icon: Frame,
        description: 'No frame border'
      },
      {
        value: 'basic',
        label: 'Basic',
        icon: Frame,
        description: 'Simple border frame'
      }
    ],
    font: [
      {
        value: 'sans',
        label: 'Sans Serif',
        icon: Type,
        description: 'Clean and modern font'
      },
      {
        value: 'serif',
        label: 'Serif',
        icon: Type,
        description: 'Traditional style font'
      }
    ]
  } as const
  