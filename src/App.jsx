import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// --- 1. Data (Unchanged) ---
const perfumes = [
  {
    id: 1,
    series: "Miss Dior",
    name: "Blooming Bouquet",
    brand: "Dior",
    type: "spray",
    imagePath: "/images/blooming-bouquet.png", 
    modelPath: "/models/blooming-bouquet.glb",
    scentNotes: { high: "Peony, Mandarin", mid: "Rose, Pink Peppercorn", low: "White Musk" }
  },
  {
    id: 2,
    series: "Miss Dior",
    name: "Rose N' Roses",
    brand: "Dior",
    type: "spray",
    imagePath: "/images/rosenroses.png",
    modelPath: "/models/rosenroses.glb",
    scentNotes: { 
      high: "Italian Mandarin, Bergamot, Geranium", 
      mid: "Grasse Rose, Damask Rose", 
      low: "White Musk" 
    }
  },
  {
    id: 3,
    series: "Miss Dior",
    name: "Parfum",
    brand: "Dior",
    type: "spray",
    imagePath: "/images/parfum.png",
    modelPath: "/models/parfum.glb",
    scentNotes: { 
      high: "Mandarin", 
      mid: "Starry Jasmine, Fruity Facets", 
      low: "Ambery Woods" 
    }
  },
];

// --- 3D Components (Unchanged) ---
function PerfumeModel3D({ modelPath, isInteractive }) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef();
  
  React.useEffect(() => {
    if (scene) {
      const cloned = scene.clone();
      const box = new THREE.Box3().setFromObject(cloned);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      cloned.position.sub(center);
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) cloned.scale.multiplyScalar(3.2 / maxDim);
      modelRef.current = cloned;
    }
  }, [scene]);

  useFrame((state, delta) => {
    if (modelRef.current && !isInteractive) {
      modelRef.current.rotation.y += delta * 0.2;
    }
  });

  if (!modelRef.current) return null;
  return <primitive object={modelRef.current} />;
}

function ModelView({ modelPath, isInteractive, onToggle }) {
  return (
    <div className="w-full h-full relative cursor-pointer" onClick={onToggle}>
      <Canvas camera={{ position: [0, 1, 6], fov: 45 }} className="bg-transparent">
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <Environment preset="city" />
        <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} far={4} color="black" />
        {isInteractive && <OrbitControls enableZoom={false} />}
        <PerfumeModel3D modelPath={modelPath} isInteractive={isInteractive} />
      </Canvas>
      {!isInteractive && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-[10px] uppercase tracking-[0.2em] pointer-events-none">
          Click to View 360°
        </div>
      )}
    </div>
  );
}

// --- MAIN APP COMPONENT ---
const App = () => {
  const [selectedPerfume, setSelectedPerfume] = useState(perfumes[0]);
  const [isInteractive, setIsInteractive] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');
  const [selectedFilter, setSelectedFilter] = useState(null);

  // Extract unique series and types
  const uniqueSeries = [...new Set(perfumes.map(p => p.series))];
  const uniqueTypes = [...new Set(perfumes.map(p => p.type))];

  // Filter perfumes based on active nav and selected filter
  const filteredPerfumes = React.useMemo(() => {
    if (activeNav === 'Home' || !selectedFilter) {
      return perfumes;
    }
    if (activeNav === 'By Series') {
      return perfumes.filter(p => p.series === selectedFilter);
    }
    if (activeNav === 'By Type') {
      return perfumes.filter(p => p.type === selectedFilter);
    }
    return perfumes;
  }, [activeNav, selectedFilter]);

  // Reset selected perfume when filter changes
  React.useEffect(() => {
    if (filteredPerfumes.length > 0 && !filteredPerfumes.find(p => p.id === selectedPerfume.id)) {
      setSelectedPerfume(filteredPerfumes[0]);
    }
  }, [filteredPerfumes]);

  const handleNavClick = (nav) => {
    setActiveNav(nav);
    setSelectedFilter(null); // Reset filter when switching nav
  };

  const handleFilterClick = (filterValue) => {
    setSelectedFilter(filterValue);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1a1a1a] text-white font-['Inter']">
      
      {/* 0. NOISE TEXTURE (The Figma "Grain" Effect) */}
      <div className="noise-overlay" />

      {/* 1. BACKGROUND IMAGE */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: "url('/images/tree.png')",
          filter: "brightness(0.75) contrast(1.1) blur(0px)",
          transform: "scale(1.05)"
        }}
      />
      
      {/* 2. TOP NAVIGATION */}
      <div className="relative z-20">
        <nav className="relative flex items-center justify-between px-10 py-6">
          <div className="flex items-center gap-2">
             <span className="text-[12px] font-medium glass-nav">Perfume Collection</span>
          </div>

          {/* --- Center Pills (Applied glass-nav) --- */}
          <div className="absolute inset-x-0 mx-auto w-fit">
            <div className="flex gap-1.5 p-1.5 glass-nav">
              {['Home', 'By Series', 'By Type'].map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={`px-6 py-2.5 rounded-full text-[12px] transition-all duration-300 ${
                    activeNav === item
                      ? 'text-white font-semibold glass-nav-active' 
                      : 'text-white/60 font-medium hover:text-white/90 hover:bg-white/10'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* --- Right Actions (Applied glass-nav) --- */}
          <div className="flex gap-4">
              <button className="flex items-center justify-center glass-nav hover:bg-white/10 transition"><Search size={16} /></button>
          </div>
        </nav>

        {/* Filter Buttons - Show when By Series or By Type is active */}
        {(activeNav === 'By Series' || activeNav === 'By Type') && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-center pb-4"
          >
            <div className="flex gap-1.5 p-1.5 glass-nav">
              {(activeNav === 'By Series' ? uniqueSeries : uniqueTypes).map((filterValue) => (
                <button
                  key={filterValue}
                  onClick={() => handleFilterClick(filterValue)}
                  className={`py-2 px-4 rounded-full text-[12px] transition-all duration-300 capitalize ${
                    selectedFilter === filterValue
                      ? 'text-white font-semibold glass-nav-active' 
                      : 'text-white/60 font-medium hover:text-white/90 hover:bg-white/10'
                  }`}
                >
                  {filterValue}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* 3. MAIN CONTENT GRID */}
      <main className={`relative z-10 w-full flex p-10 gap-8 items-center justify-center max-w-[1600px] mx-auto ${(activeNav === 'By Series' || activeNav === 'By Type') ? 'h-[calc(85vh-80px)]' : 'h-[85vh]'}`}>
        
         {/* LEFT: Sidebar Strip */}
         <div className="flex flex-col gap-4 w-48 h-[600px] overflow-y-auto overflow-x-hidden custom-scrollbar py-2 px-1">
            {filteredPerfumes.map((p) => (
              <button
                key={p.id}
                onClick={() => { setSelectedPerfume(p); setIsInteractive(false); }}
                // Applied glass-thumb and glass-active
                className={`relative w-full max-w-full aspect-square rounded-2xl p-3 transition-all duration-300 group overflow-hidden box-border ${
                  selectedPerfume.id === p.id 
                     ? 'glass-active scale-105' 
                     : 'glass-thumb opacity-70 hover:opacity-100 hover:scale-105'
                }`}
              >
                 <img 
                   src={p.imagePath} 
                   className="w-full h-full object-contain drop-shadow-md pointer-events-none" 
                   alt={p.name}
                 />
                 {selectedPerfume.id === p.id && (
                     <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/80 rounded-full blur-[2px]" />
                 )}
              </button>
            ))}
         </div>

        {/* RIGHT: Main Hero Card (Applied glass-main) */}
        <motion.div 
            key={selectedPerfume.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            // THIS IS THE MAIN GLASS PANEL
            className="flex-1 max-w-5xl h-[600px] glass-main rounded-[40px] flex overflow-hidden"
        >
            
            {/* A. 3D Model Area (Left Half) */}
            <div className="flex-1 relative bg-gradient-to-b from-white/5 to-transparent">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />
                 <ModelView 
                    modelPath={selectedPerfume.modelPath}
                    isInteractive={isInteractive}
                    onToggle={() => setIsInteractive(!isInteractive)}
                 />
            </div>

            {/* B. Content Area (Right Half) */}
            <div className="flex-1 p-12 flex flex-col justify-center relative">
                
                <h3 className="text-sm font-bold tracking-[0.3em] uppercase text-white/60 mb-4">
                    {selectedPerfume.series}
                </h3>
                
                <h1 className="text-[48px] font-semibold text-white leading-tight mb-8">
                    {selectedPerfume.name}
                </h1>

                <div className="space-y-6 mb-12">
                   <div className="border-l-2 border-white/20 pl-6">
                      <p className="text-xs uppercase tracking-widest text-white/50 mb-1">High Notes</p>
                      <p className="text-lg font-light text-white">{selectedPerfume.scentNotes.high}</p>
                   </div>
                   <div className="border-l-2 border-white/20 pl-6">
                      <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Heart Notes</p>
                      <p className="text-lg font-light text-white">{selectedPerfume.scentNotes.mid}</p>
                   </div>
                   <div className="border-l-2 border-white/20 pl-6">
                      <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Base Notes</p>
                      <p className="text-lg font-light text-white">{selectedPerfume.scentNotes.low}</p>
                   </div>
                   <div className="border-l-2 border-white/20 pl-6">
                      <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Type</p>
                      <p className="text-lg font-light text-white capitalize">{selectedPerfume.type}</p>
                   </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-8 mt-auto">
                    <span className="text-[24px] font-semibold">{selectedPerfume.brand}</span>
                </div>

            </div>
        </motion.div>

      </main>
    </div>
  );
};

export default App;