import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Map, X, ZoomIn, ZoomOut } from 'lucide-react';
import SurfaceMap3D from './SurfaceMap3D';

const STEP = 2.5;

export default function SurfaceExplorer({ artifact, onClose }) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [zoom, setZoom] = useState(1);
  const isAstronaut = artifact?.id === 'apollo11';

  const move = (dx, dy) => {
    setPosition((current) => ({
      x: Math.max(8, Math.min(92, current.x + dx * STEP)),
      y: Math.max(8, Math.min(92, current.y + dy * STEP)),
    }));
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const directions = {
        ArrowUp: [0, -1], KeyW: [0, -1],
        ArrowDown: [0, 1], KeyS: [0, 1],
        ArrowLeft: [-1, 0], KeyA: [-1, 0],
        ArrowRight: [1, 0], KeyD: [1, 0],
      };
      const direction = directions[event.code];
      if (direction) {
        event.preventDefault();
        move(...direction);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!artifact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-6">
      <div className="relative flex h-full max-h-[820px] w-full max-w-6xl flex-col overflow-hidden border border-emerald-400/50 bg-slate-950 shadow-2xl">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/30 bg-black/90 px-3 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <Map className="h-5 w-5 text-emerald-300" />
            <div><p className="text-[10px] uppercase tracking-widest text-emerald-400">Mapa de superficie</p><h2 className="text-sm font-bold text-white sm:text-base">{artifact.name}</h2></div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-300"><span>{isAstronaut ? 'Control: astronauta' : 'Control: vehículo de exploración'}</span><button onClick={onClose} aria-label="Cerrar mapa" className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button></div>
        </header>

        <div className="relative min-h-0 flex-1 overflow-hidden bg-[#5f523b]">
          <SurfaceMap3D position={position} isAstronaut={isAstronaut} zoom={zoom} />
          <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 border border-black/40 bg-black/60 px-3 py-1 text-[10px] uppercase tracking-widest text-white">Zona de exploración 3D</div>

          <div className="absolute bottom-3 left-3 flex gap-1 border border-black/40 bg-black/70 p-1 text-white sm:bottom-5 sm:left-5"><button onClick={() => setZoom((value) => Math.min(1.8, value + .1))} aria-label="Acercar mapa" className="p-2 hover:bg-white/10"><ZoomIn className="h-4 w-4" /></button><button onClick={() => setZoom((value) => Math.max(1, value - .1))} aria-label="Alejar mapa" className="p-2 hover:bg-white/10"><ZoomOut className="h-4 w-4" /></button></div>
          <div className="absolute bottom-3 right-3 grid grid-cols-3 gap-1 border border-black/40 bg-black/70 p-1 sm:bottom-5 sm:right-5"><span /><button onClick={() => move(0, -1)} aria-label="Mover arriba" className="p-2 text-white hover:bg-emerald-700/50"><ChevronUp className="h-4 w-4" /></button><span /><button onClick={() => move(-1, 0)} aria-label="Mover izquierda" className="p-2 text-white hover:bg-emerald-700/50"><ChevronLeft className="h-4 w-4" /></button><button onClick={() => move(0, 1)} aria-label="Mover abajo" className="p-2 text-white hover:bg-emerald-700/50"><ChevronDown className="h-4 w-4" /></button><button onClick={() => move(1, 0)} aria-label="Mover derecha" className="p-2 text-white hover:bg-emerald-700/50"><ChevronRight className="h-4 w-4" /></button></div>
        </div>
        <footer className="border-t border-emerald-500/30 bg-black/90 px-3 py-2 text-center text-[10px] text-slate-400 sm:text-left">Usa W A S D o las flechas para desplazarte. Los controles táctiles están disponibles en la esquina inferior derecha.</footer>
      </div>
    </div>
  );
}
