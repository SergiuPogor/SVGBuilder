"use client";

import type { Tool } from '@/types/shapes';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RectangleHorizontal, Circle, Minus, PenTool, Type, Download, MousePointer, Palette, Pencil } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ColorPicker } from '@/components/color-picker';

interface ToolbarProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  fillColor: string;
  setFillColor: (color: string) => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void; // Add stroke width control later if needed
  onExport: () => void;
}

export function Toolbar({
  activeTool,
  setActiveTool,
  fillColor,
  setFillColor,
  strokeColor,
  setStrokeColor,
  onExport
}: ToolbarProps) {
  const tools: { name: Tool; label: string; icon: React.ReactNode }[] = [
    { name: 'select', label: 'Select', icon: <MousePointer size={20}/> },
    { name: 'rectangle', label: 'Rectangle', icon: <RectangleHorizontal size={20}/> },
    { name: 'circle', label: 'Circle', icon: <Circle size={20}/> },
    { name: 'line', label: 'Line', icon: <Minus size={20}/> },
    { name: 'pen', label: 'Pen/Path', icon: <PenTool size={20}/> },
    // { name: 'text', label: 'Text', icon: <Type size={20}/> }, // Add Text tool later
  ];

  return (
    <TooltipProvider>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-1 p-2 bg-card border rounded-lg shadow-md">
        {tools.map((tool) => (
          <Tooltip key={tool.name} delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                variant={activeTool === tool.name ? 'secondary' : 'ghost'}
                size="icon"
                className="h-9 w-9"
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

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Fill Color Picker */}
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
             <div> {/* Wrap ColorPicker trigger for Tooltip */}
                <ColorPicker color={fillColor} setColor={setFillColor} />
             </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Fill Color</p>
          </TooltipContent>
        </Tooltip>


        {/* Stroke Color Picker */}
         <Tooltip delayDuration={100}>
           <TooltipTrigger asChild>
             <div> {/* Wrap ColorPicker trigger for Tooltip */}
                 <ColorPicker color={strokeColor} setColor={setStrokeColor} />
              </div>
           </TooltipTrigger>
           <TooltipContent side="bottom">
             <p>Stroke Color</p>
           </TooltipContent>
         </Tooltip>

         {/* Add Stroke Width Input/Slider Later */}
         {/* <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
               <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Stroke Width">
                   <Pencil size={20} /> // Placeholder icon
               </Button>
            </TooltipTrigger>
           <TooltipContent side="bottom">
             <p>Stroke Width</p>
           </TooltipContent>
         </Tooltip> */}


        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Export Button */}
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onExport} aria-label="Export SVG">
              <Download size={20}/>
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
