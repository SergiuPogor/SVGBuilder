export type Tool = 'select' | 'rectangle' | 'circle' | 'line' | 'pen' | 'text';

export interface Point {
  x: number;
  y: number;
}

export interface ShapeBase {
  id: string;
  type: Tool;
  fill: string;
  stroke: string;
  strokeWidth: number;
  rotation?: number; // Optional rotation property
}

export interface RectangleShape extends ShapeBase {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number; // Optional border radius x
  ry?: number; // Optional border radius y
}

export interface CircleShape extends ShapeBase {
  type: 'circle';
  x: number; // Center x
  y: number; // Center y
  radius: number;
}

export interface LineShape extends ShapeBase {
    type: 'line';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export interface PathShape extends ShapeBase {
    type: 'pen';
    points: Point[]; // Array of points defining the path
    // SVG path data 'd' will be generated from points
}


// Add interfaces for Text later as needed

export type Shape = RectangleShape | CircleShape | LineShape | PathShape; // Add other shapes here later

// Interface for the current drawing action state
export interface DrawingState {
  type: Tool;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  points?: Point[]; // Used for pen tool
  options: {
    fill: string;
    stroke: string;
    strokeWidth: number;
  };
}
