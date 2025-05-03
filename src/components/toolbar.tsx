"use client";

import type { Tool } from '@/types/shapes';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RectangleHorizontal, Circle, Minus, PenTool, Type, Download, MousePointer } from 'lucide-react';

interface ToolbarProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  onExport: () => void;
}

export function Toolbar({ activeTool, setActiveTool, onExport }: ToolbarProps) {
  const tools: { name: Tool; label: string; icon: React.ReactNode }[] = [
    { name: 'select', label: 'Select', icon: <MousePointer /> },
    { name: 'rectangle', label: 'Rectangle', icon: <RectangleHorizontal /> },
    { name: 'circle', label: 'Circle', icon: <Circle /> },
    { name: 'line', label: 'Line', icon: <Minus /> },
    { name: 'pen', label: 'Pen/Path', icon: <PenTool /> },
    // { name: 'text', label: 'Text', icon: <Type /> }, // Add Text tool later
  ];

  return (
    <TooltipProvider>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-2 p-2 bg-card border rounded-lg shadow-md">
        {tools.map((tool) => (
          <Tooltip key={tool.name}>
            <TooltipTrigger asChild>
              <Button
                variant={activeTool === tool.name ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setActiveTool(tool.name)}
                aria-label={tool.label}
              >
                {tool.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tool.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onExport} aria-label="Export SVG">
              <Download />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export SVG</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
