// File: src/components/ui/icon-grid.tsx
'use client';

import { useState } from 'react';
import { IconLoader } from './icon-loader';
import { socialIcons } from '@/lib/data/social-icons';
import { motion } from 'framer-motion';
import { Button } from './button';
import { IconCategory } from '@/lib/data/social-icons';
import { cn } from '@/lib/utils';

interface IconGridProps {
  onSelect?: (icon: string) => void;
  selectedIcon?: string;
  category?: IconCategory;
  showColors?: boolean;
}

export function IconGrid({ onSelect, selectedIcon, category, showColors = true }: IconGridProps) {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const filteredIcons = category
    ? socialIcons.filter((icon) => icon.categories.includes(category))
    : socialIcons;

  return (
    <div className="grid grid-cols-4 gap-4">
      {filteredIcons.map((icon) => (
        <motion.div key={icon.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="button"
            variant="outline"
            className={cn(
              'relative aspect-square w-full overflow-hidden p-2',
              selectedIcon === icon.icon && 'ring-2 ring-primary',
              hoveredIcon === icon.icon && 'bg-accent'
            )}
            onClick={(e) => {
              e.preventDefault();
              onSelect?.(icon.icon);
            }}
            onMouseEnter={() => setHoveredIcon(icon.icon)}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <IconLoader
              icon={icon.icon}
              color={showColors ? icon.color : undefined}
              size={32}
              className="transition-all duration-300"
            />
            {hoveredIcon === icon.icon && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-1 left-0 right-0 text-center text-xs text-muted-foreground"
              >
                {icon.name}
              </motion.div>
            )}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
