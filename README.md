# Digital Shelf - 3D Portfolio

A beautiful 3D digital shelf built with React Three Fiber to showcase your 3D models in an interactive rotating cabinet.

## Features

- 🎨 **4 Category Shelves**: HOME, CHARACTERS, FLOWERS, and ITEMS
- 🔄 **Smooth Rotation**: Animated cabinet that rotates to show different categories
- 🎯 **3x3 Grid Layout**: Each shelf displays 9 items in a grid
- ✨ **Interactive Models**: Hover effects and click interactions on each model
- 🪟 **Glass Panel Effect**: Beautiful glass background panels for each shelf
- 🎭 **Floating Animation**: Models gently float and rotate for visual appeal

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open your browser to `http://localhost:5173`

## Project Structure

\`\`\`
digital-shelf/
├── src/
│   ├── App.jsx          # Main component with the 3D shelf
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles with Tailwind
├── index.html           # HTML template
├── package.json         # Dependencies
└── vite.config.js      # Vite configuration
\`\`\`

## Adding Your 3D Models

Currently, the shelf uses placeholder boxes. To add your own 3D models:

1. Place your `.glb` or `.gltf` files in a `public/models/` directory
2. Import and use the `useGLTF` hook from `@react-three/drei`:

\`\`\`jsx
import { useGLTF } from '@react-three/drei'

function ModelItem({ modelPath, ...props }) {
  const { scene } = useGLTF(modelPath)
  return <primitive object={scene} {...props} />
}
\`\`\`

3. Replace the `<boxGeometry>` in the `ModelItem` component with your loaded model

## Customization

### Changing Categories

Edit the `CATEGORIES` object in `src/App.jsx`:

\`\`\`jsx
const CATEGORIES = {
  YOUR_CATEGORY: { 
    color: "#your-color", 
    items: ["Item 1", "Item 2", ...] 
  },
  // ... more categories
}
\`\`\`

### Adjusting Shelf Layout

- Modify `gridPositions` in `ShelfFace` to change the grid size
- Adjust spacing by changing the `1.2` multiplier
- Change shelf size by modifying the `planeGeometry` args

### Styling

The project uses Tailwind CSS. Modify classes in the JSX or extend the theme in `tailwind.config.js`.

## Build for Production

\`\`\`bash
npm run build
\`\`\`

The built files will be in the `dist/` directory.

## Technologies Used

- **React** - UI framework
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **Three.js** - 3D graphics library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling

## License

MIT
