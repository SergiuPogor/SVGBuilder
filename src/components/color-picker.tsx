import React from 'react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Paintbrush } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  setColor: (color: string) => void;
  triggerLabel?: string;
  availableColors?: string[];
}

const DEFAULT_COLORS = [
  // Theme Colors (approximations based on globals.css HSL)
  'hsl(0 0% 98%)', // background light
  'hsl(240 10% 3.9%)', // foreground light
  'hsl(180 100% 25%)', // primary light (teal)
  'hsl(0 84.2% 60.2%)', // destructive light
  'hsl(0 0% 3.9%)', // background dark
  'hsl(0 0% 98%)', // foreground dark
  'hsl(180 80% 45%)', // primary dark (brighter teal)
  'hsl(0 62.8% 30.6%)', // destructive dark

  // Standard Colors
  '#FF0000', // Red
  '#FFA500', // Orange
  '#FFFF00', // Yellow
  '#008000', // Green
  '#0000FF', // Blue
  '#4B0082', // Indigo
  '#EE82EE', // Violet
  '#FFFFFF', // White
  '#808080', // Gray
  '#000000', // Black
  'transparent', // Transparent
];

export function ColorPicker({
  color,
  setColor,
  triggerLabel,
  availableColors = DEFAULT_COLORS,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          aria-label={triggerLabel || 'Select Color'}
        >
          <div
            className="h-4 w-4 rounded-full border"
            style={{ backgroundColor: color === 'transparent' ? 'white' : color,
                     border: color === 'transparent' ? '1px solid hsl(var(--border))' : undefined,
                     backgroundImage: color === 'transparent' ? `url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2' stroke='hsl(var(--foreground))' stroke-width='0.5'/%3E%3C/svg%3E")` : undefined
            }}
          />
          {triggerLabel && <span>{triggerLabel}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="grid grid-cols-5 gap-2">
          {availableColors.map((c) => (
            <button
              key={c}
              className={cn(
                'h-6 w-6 rounded-full border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                c === color && 'ring-2 ring-ring ring-offset-2'
              )}
              style={{
                 backgroundColor: c === 'transparent' ? 'white' : c,
                 border: c === 'transparent' ? '1px solid hsl(var(--border))' : undefined,
                 backgroundImage: c === 'transparent' ? `url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2' stroke='hsl(var(--foreground))' stroke-width='0.5'/%3E%3C/svg%3E")` : undefined
              }}
              onClick={() => {
                setColor(c);
                setIsOpen(false);
              }}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
