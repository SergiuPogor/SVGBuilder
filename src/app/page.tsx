"use client";

import React, { useState, useRef } from 'react';
import { Toolbar } from '@/components/toolbar';
import { Canvas } from '@/components/canvas';
import type { Shape, Tool } from '@/types/shapes';

export default function Home() {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [shapes, setShapes] = useState<Shape[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleExportSVG = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    // Clone the SVG to avoid modifying the original during cleanup
    const svgClone = svgElement.cloneNode(true) as SVGSVGElement;

    // Optional: Remove temporary drawing elements or guides if they exist
    const tempElements = svgClone.querySelectorAll('[stroke-dasharray="5 5"]'); // Example selector for temp elements
    tempElements.forEach(el => el.remove());
    // Remove grid if present
    const gridRect = svgClone.querySelector('rect[fill="url(#grid)"]');
    gridRect?.remove();
    const defs = svgClone.querySelector('defs');
    defs?.remove();


    // Add XML namespace if missing
    if (!svgClone.getAttribute('xmlns')) {
        svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }

    // Get the outerHTML of the cleaned clone
    const svgData = svgClone.outerHTML;
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vectorvim_drawing.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="relative flex flex-col h-screen w-screen overflow-hidden bg-background">
       <h1 className="text-2xl font-semibold p-4 text-foreground absolute top-0 left-0 z-20">VectorVim</h1>
       <Toolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        onExport={handleExportSVG}
      />
      <div className="flex-grow p-4 pt-20"> {/* Add padding top to avoid overlap with toolbar */}
        <Canvas
          activeTool={activeTool}
          shapes={shapes}
          setShapes={setShapes}
          svgRef={svgRef}
        />
      </div>
    </div>
  );
}
