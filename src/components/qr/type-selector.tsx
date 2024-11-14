"use client";

import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QRTypeSelectorProps {
  types: Record<string, { name: string; icon: keyof typeof Icons }>;
  selectedType: string;
  onChange: (type: string) => void;
}

export function QRTypeSelector({
  types,
  selectedType,
  onChange,
}: QRTypeSelectorProps) {
  return (
    <div>
      {Object.entries(types).map(([key, { name, icon }]: [string, { name: string; icon: keyof typeof Icons }]) => {
        const Icon = Icons[icon];
        return (
          <Button
            key={key}
            variant={selectedType === key ? "default" : "outline"}
            className={cn(
              "flex flex-col h-auto gap-2 p-4",
              selectedType === key && "bg-primary text-primary-foreground"
            )}
            onClick={() => onChange(key)}
          >
            <Icon className="h-6 w-6" />
            <span>{name}</span>
          </Button>
        );
      })}
    </div>
  );
}