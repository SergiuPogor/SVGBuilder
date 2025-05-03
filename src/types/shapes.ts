export type Tool = 'select' | 'rectangle' | 'circle' | 'line' | 'pen' | 'text';

export interface Point {
  x: number;
  y: number;
}

export interface ShapeBase {
  id: string;
  type: Tool;
  x: number;
  y: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  rotation?: number; // Optional rotation property
}

export interface RectangleShape extends ShapeBase {
  type: 'rectangle';
  width: number;
  height: number;
  rx?: number; // Optional border radius x
  ry?: number; // Optional border radius y
}

export interface CircleShape extends ShapeBase {
  type: 'circle';
  radius: number;
}

// Add interfaces for Line, Path, Text later as needed

export type Shape = RectangleShape | CircleShape; // Add other shapes here later

// Interface for the current drawing action state
export interface DrawingState {
  type: Tool;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  options: {
    fill: string;
    stroke: string;
    strokeWidth: number;
  };
}
