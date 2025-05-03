"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { Shape, Tool, Point, DrawingState, RectangleShape, CircleShape, LineShape, PathShape } from '@/types/shapes';

interface CanvasProps {
  activeTool: Tool;
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  svgRef: React.RefObject<SVGSVGElement>;
}

export function Canvas({
  activeTool,
  shapes,
  setShapes,
  fillColor,
  strokeColor,
  strokeWidth,
  svgRef
}: CanvasProps) {
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
    const newDrawingState: DrawingState = {
      type: activeTool,
      startX: x,
      startY: y,
      currentX: x,
      currentY: y,
      options: {
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      },
    };
    if (activeTool === 'pen') {
        newDrawingState.points = [{ x, y }];
    }
    setDrawingState(newDrawingState);
  }, [activeTool, svgRef, fillColor, strokeColor, strokeWidth]);

  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (!drawingState || activeTool === 'select') return;

    const { x, y } = getMousePosition(event);
     if (activeTool === 'pen' && drawingState.points) {
        setDrawingState(prev => prev ? {
            ...prev,
            currentX: x,
            currentY: y,
            points: [...(prev.points || []), { x, y }] // Add new point for pen tool
        } : null);
    } else {
        setDrawingState(prev => prev ? { ...prev, currentX: x, currentY: y } : null);
    }
  }, [drawingState, activeTool, svgRef]);

  // Convert points array to SVG path data string
  const pointsToPathData = (points: Point[]): string => {
    if (!points || points.length === 0) return "";
    const start = `M ${points[0].x} ${points[0].y}`;
    const lines = points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
    return `${start} ${lines}`;
  };


  const handleMouseUp = useCallback(() => {
    if (!drawingState || activeTool === 'select') return;

    const { type, startX, startY, currentX, currentY, points, options } = drawingState;
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
        } as RectangleShape;
        break;
      case 'circle':
        const dx = currentX - startX;
        const dy = currentY - startY;
        // Use distance from start to current as radius
        const radius = Math.sqrt(dx * dx + dy * dy);
        newShape = {
          id,
          type: 'circle',
          x: startX, // Center x
          y: startY, // Center y
          radius,
          ...options,
        } as CircleShape;
        break;
       case 'line':
         // Only add line if it has length
         if (startX !== currentX || startY !== currentY) {
           newShape = {
             id,
             type: 'line',
             x1: startX,
             y1: startY,
             x2: currentX,
             y2: currentY,
             ...options,
           } as LineShape;
         }
        break;
      case 'pen':
        if (points && points.length > 1) {
            newShape = {
                id,
                type: 'pen',
                points: points,
                ...options,
                // Fill is typically none for pen paths unless explicitly set otherwise later
                fill: 'none',
            } as PathShape;
        }
        break;
      default:
        break;
    }

    if (newShape) {
        // Add validation for minimal size/length if needed
        if ((newShape.type === 'rectangle' && (newShape.width > 1 || newShape.height > 1)) ||
            (newShape.type === 'circle' && newShape.radius > 1) ||
            (newShape.type === 'line' && (newShape.x1 !== newShape.x2 || newShape.y1 !== newShape.y2)) ||
            (newShape.type === 'pen' && newShape.points.length > 1)) {
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
        // Ensure non-zero dimensions for viewBox
        const newWidth = Math.max(1, parent.clientWidth);
        const newHeight = Math.max(1, parent.clientHeight);
        setCanvasSize({ width: newWidth, height: newHeight });
      }
    };

    // Debounce resize handler
    let resizeTimeout: NodeJS.Timeout;
    const debouncedHandleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 50); // Adjust delay as needed
    };

    handleResize(); // Initial size
    window.addEventListener('resize', debouncedHandleResize);
    return () => {
        clearTimeout(resizeTimeout);
        window.removeEventListener('resize', debouncedHandleResize);
    }
   }, [svgRef]);

  // Render temporary shape during drawing
  const renderTemporaryShape = () => {
    if (!drawingState || activeTool === 'select') return null;

    const { type, startX, startY, currentX, currentY, points, options } = drawingState;

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
        case 'pen':
            if (!points || points.length < 1) return null;
             // Render the path being drawn
             return (
                <path
                    d={pointsToPathData(points)}
                    fill="none" // Pen tool typically doesn't fill during drawing
                    stroke={options.stroke}
                    strokeWidth={options.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="5 5"
                 />
             );
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
       {/* Optional Grid */}
       <defs>
         <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
           <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" opacity="0.5"/>
         </pattern>
         <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
           <rect width="100" height="100" fill="url(#smallGrid)"/>
           <path d="M 100 0 L 0 0 0 100" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.5"/>
         </pattern>
       </defs>
       <rect width="100%" height="100%" fill="url(#grid)" pointerEvents="none" />


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
          case 'line':
              return (
                  <line
                      key={shape.id}
                      x1={shape.x1}
                      y1={shape.y1}
                      x2={shape.x2}
                      y2={shape.y2}
                      stroke={shape.stroke}
                      strokeWidth={shape.strokeWidth}
                      strokeLinecap="round" // Optional: for smoother line ends
                  />
              );
            case 'pen':
                 return (
                     <path
                         key={shape.id}
                         d={pointsToPathData(shape.points)}
                         fill={shape.fill} // Usually 'none' for paths unless intended
                         stroke={shape.stroke}
                         strokeWidth={shape.strokeWidth}
                         strokeLinecap="round"
                         strokeLinejoin="round"
                     />
                 );
          default:
            // Ensure Exhaustive Check (useful with TypeScript)
            // const _exhaustiveCheck: never = shape;
            return null;
        }
      })}

      {/* Render temporary drawing shape */}
      {renderTemporaryShape()}

    </svg>
  );
}
