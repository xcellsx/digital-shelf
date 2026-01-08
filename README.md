# Lumière - Perfume Collection

A beautiful glass-morphism perfume collection showcase with 3D interactive models.

## File Organization

```
public/
├── images/          # Perfume product images (PNG)
│   └── blooming-bouquet.png
└── models/          # 3D model files (GLB/GLTF/STL)
    └── blooming-bouquet.glb
```

## Features

- **Glass-morphism Design**: Beautiful frosted glass effect with pink theme
- **3D Carousel**: Interactive carousel showing perfume images
- **3D Model Viewer**: Click any perfume to view it in interactive 3D
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive**: Works on all screen sizes

## Adding New Perfumes

1. Add your perfume image to `public/images/` (e.g., `perfume-name.png`)
2. Add your 3D model to `public/models/` (e.g., `perfume-name.glb`)
3. Update the `perfumes` array in `src/App.jsx`:

```jsx
{
  id: 4,
  brand: "Brand Name",
  name: "Perfume Name",
  color: "#HEXCOLOR",
  imagePath: "/images/perfume-name.png",
  modelPath: "/models/perfume-name.glb"
}
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
