import React, { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Text, Environment, ContactShadows, Float, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// --- 1. DUMMY DATA FOR YOUR 4 CATEGORIES ---
const CATEGORIES = {
  HOME: { 
    color: "#ff6b6b", 
    items: Array.from({ length: 9 }, (_, i) => ({ 
      label: `Home ${i+1}`, 
      modelPath: null 
    })) 
  },
  CHARACTERS: { 
    color: "#4ecdc4", 
    items: [
      { label: "Cinnamoroll", modelPath: "/models/cinna.glb" },
      ...Array.from({ length: 8 }, (_, i) => ({ 
        label: `Char ${i+2}`, 
        modelPath: null 
      }))
    ] 
  },
  FLOWERS: { 
    color: "#ffe66d", 
    items: Array.from({ length: 9 }, (_, i) => ({ 
      label: `Flower ${i+1}`, 
      modelPath: null 
    })) 
  },
  ITEMS: { 
    color: "#1a535c", 
    items: Array.from({ length: 9 }, (_, i) => ({ 
      label: `Item ${i+1}`, 
      modelPath: null 
    })) 
  },
}

const CATEGORY_KEYS = Object.keys(CATEGORIES)

// --- 2. COMPONENT TO LOAD AND DISPLAY 3D MODEL ---
function LoadedModel({ modelPath }) {
  const { scene } = useGLTF(modelPath)
  const modelRef = useRef()
  const box = useRef(new THREE.Box3())
  const center = useRef(new THREE.Vector3())
  const size = useRef(new THREE.Vector3())
  
  React.useEffect(() => {
    if (scene) {
      // Clone the scene to avoid conflicts
      modelRef.current = scene.clone()
      
      // Calculate bounding box to center and scale the model
      box.current.setFromObject(modelRef.current)
      box.current.getCenter(center.current)
      box.current.getSize(size.current)
      
      // Center the model
      modelRef.current.position.sub(center.current)
      
      // Scale to fit within ~1 unit
      const maxDimension = Math.max(size.current.x, size.current.y, size.current.z)
      if (maxDimension > 0) {
        modelRef.current.scale.multiplyScalar(1 / maxDimension)
      }
    }
  }, [scene])
  
  if (!modelRef.current) return null
  
  return <primitive object={modelRef.current} />
}

// --- 3. INDIVIDUAL MODEL COMPONENT (Loads .glb files or shows placeholder) ---
function ModelItem({ label, color, position, onClick, modelPath }) {
  const [hovered, setHover] = useState(false)
  
  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group
          onClick={onClick}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
          scale={hovered ? 1.1 : 1}
        >
          {modelPath ? (
            // Render the loaded 3D model
            <LoadedModel modelPath={modelPath} />
          ) : (
            // Placeholder box for items without models
            <mesh>
              <boxGeometry args={[0.8, 0.8, 0.8]} /> 
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
            </mesh>
          )}
        </group>
      </Float>
      {/* Simple Label */}
      <Text position={[0, -0.6, 0.5]} fontSize={0.15} color="black" anchorX="center">
        {label}
      </Text>
    </group>
  )
}

// --- 4. THE 3x3 SHELF FACE ---
function ShelfFace({ categoryKey, rotation, position }) {
  const data = CATEGORIES[categoryKey]
  
  // Create 3x3 Grid Coordinates
  // Spacing is 1.2 units apart
  const gridPositions = []
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      gridPositions.push([x * 1.2, y * 1.2, 0])
    }
  }

  return (
    <group rotation={rotation} position={position}>
      {/* The Glass Panel Background */}
      <mesh position={[0, 0, -0.5]}>
        <planeGeometry args={[4, 4]} />
        <meshPhysicalMaterial 
          color="white" 
          transmission={0.9} // Glass effect
          opacity={0.5}
          roughness={0} 
          thickness={0.5} 
          transparent
        />
      </mesh>
      
      {/* The 9 Items */}
      {gridPositions.map((pos, i) => {
        const item = data.items[i]
        return (
          <ModelItem 
            key={i} 
            position={pos} 
            color={data.color} 
            label={item.label || item} 
            modelPath={item.modelPath}
            onClick={(e) => {
              e.stopPropagation()
              alert(`You clicked ${item.label || item}`) // Replace with zoom logic later
            }}
          />
        )
      })}
      
      {/* Category Title on top of shelf */}
      <Text position={[0, 2.2, 0]} fontSize={0.4} color="#333" anchorX="center">
        {categoryKey}
      </Text>
    </group>
  )
}

// --- 5. ANIMATED CABINET GROUP ---
function RotatingCabinet({ targetRotationY }) {
  const groupRef = useRef()
  const currentRotation = useRef(0)

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smooth interpolation towards target rotation
      const target = targetRotationY
      const current = currentRotation.current
      const diff = target - current
      
      // Normalize angle difference to shortest path
      let normalizedDiff = diff
      if (normalizedDiff > Math.PI) normalizedDiff -= Math.PI * 2
      if (normalizedDiff < -Math.PI) normalizedDiff += Math.PI * 2
      
      // Spring-like interpolation
      currentRotation.current += normalizedDiff * 0.1
      groupRef.current.rotation.y = currentRotation.current
    }
  })

  return (
    <group ref={groupRef}>
      {/* Cabinet Geometry:
        We place 4 faces, each rotated 90 degrees 
        and pushed out by 2 units (half the box width)
      */}
      
      {/* FRONT */}
      <ShelfFace categoryKey="HOME" rotation={[0, 0, 0]} position={[0, 0, 2]} />
      
      {/* RIGHT */}
      <ShelfFace categoryKey="CHARACTERS" rotation={[0, Math.PI / 2, 0]} position={[2, 0, 0]} />
      
      {/* BACK */}
      <ShelfFace categoryKey="FLOWERS" rotation={[0, Math.PI, 0]} position={[0, 0, -2]} />
      
      {/* LEFT */}
      <ShelfFace categoryKey="ITEMS" rotation={[0, -Math.PI / 2, 0]} position={[-2, 0, 0]} />
    </group>
  )
}

// --- 6. THE MAIN SCENE ---
function PortfolioApp() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)

  // Preload all models for better performance
  React.useEffect(() => {
    Object.values(CATEGORIES).forEach(category => {
      category.items.forEach(item => {
        if (item.modelPath) {
          useGLTF.preload(item.modelPath)
        }
      })
    })
  }, [])

  // Rotate the cabinet based on active index (90 degrees per category)
  const targetRotationY = activeCategoryIndex * -(Math.PI / 2)

  return (
    <div className="w-full h-screen bg-gray-100 relative">
      
      {/* --- UI OVERLAY (The 3D Buttons you mentioned) --- */}
      <div className="absolute top-10 left-0 w-full flex justify-center gap-4 z-10">
        {CATEGORY_KEYS.map((cat, index) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryIndex(index)}
            className={`px-6 py-2 rounded-full font-bold transition-all shadow-lg ${
              activeCategoryIndex === index 
                ? 'bg-black text-white scale-110' 
                : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- 3D CANVAS --- */}
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
        <color attach="background" args={['#f0f0f0']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <Environment preset="city" />

        {/* ROTATING CABINET GROUP */}
        <RotatingCabinet targetRotationY={targetRotationY} />

        <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
      </Canvas>
    </div>
  )
}

export default PortfolioApp
