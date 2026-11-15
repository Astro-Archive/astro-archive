import React, { useState } from 'react';
import { RotateCw, ZoomIn, Eye, Sparkles, AlertTriangle, Layers } from 'lucide-react';

export default function Viewer3D({ artifact, onInspectHardware }) {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[580px] bg-gradient-to-b from-space-900/40 via-space-950/80 to-space-950 rounded-2xl border border-cyan-900/30 overflow-hidden shadow-2xl flex flex-col justify-between">
      
      {/* HUD Top Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        
        {/* Artifact Identity tag */}
        <div className="pointer-events-auto bg-space-950/80 border border-cyan-500/30 px-3 py-1.5 rounded-md backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full animate-ping bg-cyan-400"></span>
            <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest">
              3D SCANNER ACTIVE // {artifact.body.toUpperCase()}
            </span>
          </div>
          <div className="text-xs font-mono text-slate-400 text-[10px]">
            COORDINATES: {artifact.coordinates}
          </div>
        </div>

        {/* View Controls */}
        <div className="pointer-events-auto flex items-center space-x-2 bg-space-950/80 border border-slate-800 p-1 rounded-md backdrop-blur-md">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded transition-all text-xs font-mono flex items-center space-x-1 ${
              autoRotate ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Auto-Rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Rotate</span>
          </button>
          
          <button
            onClick={onInspectHardware}
            className="p-1.5 rounded text-xs font-mono flex items-center space-x-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all"
            title="Analyze Hardware"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inspect Parts</span>
          </button>
        </div>

      </div>

      {/* Cyber Grid Overlay / Reticle */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-full h-full border border-cyan-500/20 rounded-2xl"></div>
        {/* Crosshair markers in 4 corners */}
        <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute top-8 right-8 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute bottom-8 left-8 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute bottom-8 right-8 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
      </div>

      {/* Model Viewer Container */}
      <div className="w-full h-full flex items-center justify-center p-4">
        <model-viewer
          key={artifact.id}
          src={artifact.modelUrl}
          alt={`3D Model of ${artifact.name}`}
          auto-rotate={autoRotate ? "" : null}
          camera-controls
          shadow-intensity="1.5"
          exposure="1.2"
          ar
          ar-modes="webxr scene-viewer quick-look"
          loading="eager"
          className="w-full h-full focus:outline-none"
        >
          {/* Default fallback slot while loading */}
          <div slot="poster" className="w-full h-full flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
            <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-3"></div>
            <span>TRANSMITTING 3D GEOMETRY FROM {artifact.body.toUpperCase()}...</span>
          </div>
        </model-viewer>
      </div>

      {/* Interactive Helper Text */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
        <span className="text-[11px] font-mono text-slate-400/80 bg-space-950/80 px-3 py-1 rounded-full border border-slate-800 backdrop-blur-md">
          🖱️ Click & Drag to Rotate // Scroll to Zoom // Touch-friendly
        </span>
      </div>

    </div>
  );
}
