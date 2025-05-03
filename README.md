# VectorVim - A Simple SVG Editor

VectorVim is a web-based application built with Next.js that allows users to draw, edit, and export SVG (Scalable Vector Graphics) files directly in their browser. It provides a simple and intuitive interface for creating basic vector shapes and paths.

## Features

*   **Drawing Tools:**
    *   **Select Tool:** (Future implementation) Select and manipulate existing shapes.
    *   **Rectangle Tool:** Draw rectangles and squares.
    *   **Circle Tool:** Draw circles and ovals (starting from the center).
    *   **Line Tool:** Draw straight lines.
    *   **Pen Tool:** Draw freeform paths.
*   **Styling Options:**
    *   **Fill Color:** Choose a fill color for shapes using a color picker (includes theme colors, standard palette, and transparency).
    *   **Stroke Color:** Choose a stroke (outline) color for shapes using a color picker.
    *   **Stroke Width:** (Basic implementation, further controls planned) Set the width of the stroke.
*   **Canvas:**
    *   Resizable drawing area with an optional grid background.
    *   Real-time preview of shapes being drawn.
*   **Export:**
    *   Export the current drawing as a clean SVG file (`.svg`).
*   **Modern UI:**
    *   Built with ShadCN UI components and Tailwind CSS for a clean and responsive design.
    *   Supports light and dark themes based on system preference.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (Version 18.x or later recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd vectorvim # Or your project directory name
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```

### Running the Development Server

1.  **Start the development server:**
    Using npm:
    ```bash
    npm run dev
    ```
    Or using yarn:
    ```bash
    yarn dev
    ```
    This command runs the app in development mode with Turbopack and hot-reloading, typically on port 9002.

2.  **Open your browser:**
    Navigate to `http://localhost:9002` (or the port specified in the console output).

## Usage

1.  **Select a Tool:** Click on one of the tool icons in the toolbar located at the top-center of the screen (e.g., Rectangle, Circle, Line, Pen).
2.  **Choose Colors:**
    *   Click the first color swatch (fill color) to open the color picker and select a fill color for your next shape.
    *   Click the second color swatch (stroke color) to select a stroke color.
    *   Select 'transparent' for no fill or stroke.
3.  **Adjust Stroke Width:** (Future Feature) Use the stroke width controls (when implemented) to set the outline thickness. The current default is 2px.
4.  **Draw on the Canvas:**
    *   **Rectangle:** Click and drag on the canvas to define the rectangle's size and position.
    *   **Circle:** Click to set the center point, then drag outwards to define the radius.
    *   **Line:** Click and drag from the start point to the end point of the line.
    *   **Pen:** Click and drag to draw a freeform path. Release the mouse button to finish the path.
5.  **Export SVG:** Click the "Download" icon in the toolbar to save your current drawing as an SVG file. The exported file will contain only the drawn shapes, without the grid or temporary drawing indicators.

## Technologies Used

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Library:** [React](https://reactjs.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Components:** [ShadCN UI](https://ui.shadcn.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **State Management:** React Hooks (`useState`, `useRef`, `useEffect`, `useCallback`)
*   **AI (Integrated for future use):** [Genkit](https://firebase.google.com/docs/genkit) (with Google AI) - Currently configured but not actively used in core drawing features.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues to improve the application. (Further contribution guidelines can be added here).
```