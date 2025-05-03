"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { Shape, Tool, Point, DrawingState, RectangleShape, CircleShape } from '@/types/shapes';

interface CanvasProps {
  activeTool: Tool;
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  svgRef: React.RefObject<SVGSVGElement>;
}

const DEFAULT_FILL = 'transparent';
const DEFAULT_STROKE = 'hsl(var(--foreground))'; // Use theme foreground
const DEFAULT_STROKE_WIDTH = 2;

export function Canvas({ activeTool, shapes, setShapes, svgRef }: CanvasProps) {
  const [drawingState, setDrawingState] = useState<DrawingState | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 }); // Initial size

  const getMousePosition = (event: React.MouseEvent<SVGSVGElement>): Point => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x: svgP.x, y: svgP.y };
  };

  const handleMouseDown = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool === 'select') return; // Handle selection later

    const { x, y } = getMousePosition(event);
    setDrawingState({
      type: activeTool,
      startX: x,
      startY: y,
      currentX: x,
      currentY: y,
      options: {
        fill: DEFAULT_FILL,
        stroke: DEFAULT_STROKE,
        strokeWidth: DEFAULT_STROKE_WIDTH,
      },
    });
  }, [activeTool, svgRef]);

  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (!drawingState || activeTool === 'select') return;

    const { x, y } = getMousePosition(event);
    setDrawingState(prev => prev ? { ...prev, currentX: x, currentY: y } : null);
  }, [drawingState, activeTool, svgRef]);

  const handleMouseUp = useCallback(() => {
    if (!drawingState || activeTool === 'select') return;

    const { type, startX, startY, currentX, currentY, options } = drawingState;
    const id = `shape-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    let newShape: Shape | null = null;

    switch (type) {
      case 'rectangle':
        newShape = {
          id,
          type: 'rectangle',
          x: Math.min(startX, currentX),
          y: Math.min(startY, currentY),
          width: Math.abs(currentX - startX),
          height: Math.abs(currentY - startY),
          ...options,
        };
        break;
      case 'circle':
        const dx = currentX - startX;
        const dy = currentY - startY;
        const radius = Math.sqrt(dx * dx + dy * dy);
        newShape = {
          id,
          type: 'circle',
          x: startX, // Center x
          y: startY, // Center y
          radius,
          ...options,
        };
        break;
      case 'line':
      // Implement Line shape creation later
      case 'pen':
      // Implement Pen/Path shape creation later
      default:
        break;
    }

    if (newShape) {
        // Only add shape if it has non-zero dimensions (or radius for circle)
        if ((newShape.type === 'rectangle' && (newShape.width > 0 || newShape.height > 0)) ||
            (newShape.type === 'circle' && newShape.radius > 0)) {
            setShapes(prev => [...prev, newShape as Shape]);
        }
    }

    setDrawingState(null);
  }, [drawingState, activeTool, setShapes]);

   // Handle resizing - could be improved with ResizeObserver
   useEffect(() => {
    const handleResize = () => {
      const parent = svgRef.current?.parentElement;
      if (parent) {
        setCanvasSize({ width: parent.clientWidth, height: parent.clientHeight });
      }
    };
    handleResize(); // Initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [svgRef]);

  // Render temporary shape during drawing
  const renderTemporaryShape = () => {
    if (!drawingState || activeTool === 'select') return null;

    const { type, startX, startY, currentX, currentY, options } = drawingState;

    switch (type) {
      case 'rectangle':
        return (
          <rect
            x={Math.min(startX, currentX)}
            y={Math.min(startY, currentY)}
            width={Math.abs(currentX - startX)}
            height={Math.abs(currentY - startY)}
            fill={options.fill}
            stroke={options.stroke}
            strokeWidth={options.strokeWidth}
            strokeDasharray="5 5" // Dashed line for temporary shape
          />
        );
      case 'circle':
        const dx = currentX - startX;
        const dy = currentY - startY;
        const radius = Math.sqrt(dx * dx + dy * dy);
        return (
           <circle
            cx={startX}
            cy={startY}
            r={radius}
            fill={options.fill}
            stroke={options.stroke}
            strokeWidth={options.strokeWidth}
            strokeDasharray="5 5"
          />
        );
        case 'line':
             return (
               <line
                 x1={startX}
                 y1={startY}
                 x2={currentX}
                 y2={currentY}
                 stroke={options.stroke}
                 strokeWidth={options.strokeWidth}
                 strokeDasharray="5 5"
               />
             );
      // Add cases for other tools later
      default:
        return null;
    }
  };

  return (
    <svg
      ref={svgRef}
      width="100%" // Use 100% width
      height="100%" // Use 100% height
      viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`} // Adjust viewBox dynamically
      className="bg-card border rounded-lg shadow-inner cursor-crosshair" // Style the canvas
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // End drawing if mouse leaves canvas
    >
      {/* Render saved shapes */}
      {shapes.map((shape) => {
        switch (shape.type) {
          case 'rectangle':
            return (
              <rect
                key={shape.id}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                fill={shape.fill}
                stroke={shape.stroke}
                strokeWidth={shape.strokeWidth}
                rx={shape.rx}
                ry={shape.ry}
                transform={shape.rotation ? `rotate(${shape.rotation} ${shape.x + shape.width / 2} ${shape.y + shape.height / 2})` : undefined}
              />
            );
          case 'circle':
             return (
              <circle
                key={shape.id}
                cx={shape.x}
                cy={shape.y}
                r={shape.radius}
                fill={shape.fill}
                stroke={shape.stroke}
                strokeWidth={shape.strokeWidth}
                transform={shape.rotation ? `rotate(${shape.rotation} ${shape.x} ${shape.y})` : undefined}
              />
            );
          // Add cases for other shapes later
          default:
            return null;
        }
      })}

      {/* Render temporary drawing shape */}
      {renderTemporaryShape()}

       {/* Optional Grid */}
       {/* <defs>
         <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
           <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5"/>
         </pattern>
         <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
           <rect width="100" height="100" fill="url(#smallGrid)"/>
           <path d="M 100 0 L 0 0 0 100" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1"/>
         </pattern>
       </defs>
       <rect width="100%" height="100%" fill="url(#grid)" /> */}

    </svg>
  );
}
