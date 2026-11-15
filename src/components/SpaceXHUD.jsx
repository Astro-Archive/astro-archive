import React, { useState } from 'react';
import { 
  Compass, Radio, Volume2, VolumeX, Award, ExternalLink, Activity, 
  Sparkles, Layers, Maximize2, ShieldCheck, Terminal, Crosshair,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Eye, RefreshCw
} from 'lucide-react';

export default function SpaceXHUD({
  selectedTarget,
  onSelectTarget,
  artifacts,
  onOpenBadges,
  scannedCount,
  isPlayingAudio,
  onToggleAudio
}) {
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);

  // Find artifact data for the active target
  const currentArtifact = artifacts.find(a => 
    (selectedTarget === 'APOLLO' && a.id === 'apollo11') ||
    (selectedTarget === 'INGENUITY' && a.id === 'ingenuity') ||
    (selectedTarget === 'OPPORTUNITY' && a.id === 'opportunity')
  ) || artifacts[0];

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 sm:p-5 select-none font-mono">
      
      {/* 1. TOP BAR: SpaceX-Style Celestial Mission Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        
        {/* Brand / Mode Indicator */}
        <div className="flex items-center space-x-3 bg-black/80 backdrop-blur-md border border-cyan-500/40 px-3.5 py-2 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs sm:text-sm tracking-widest text-white">ORBITAL SIMULATOR</span>
              <span className="text-[10px] bg-cyan-950 border border-cyan-500/50 text-cyan-300 px-1.5 py-0.2 rounded font-mono">
                NASA SPACE APPS
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              TARGET: <span className="text-cyan-300 font-bold">{selectedTarget}</span>
            </div>
          </div>
        </div>

        {/* Celestial Destinations Quick Warp */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 bg-black/85 backdrop-blur-md p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => onSelectTarget('OVERVIEW')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedTarget === 'OVERVIEW'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌌 Vista General
          </button>
          <button
            onClick={() => onSelectTarget('MOON')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedTarget === 'MOON'
                ? 'bg-slate-300/25 text-slate-100 border border-slate-300/50 shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌙 Luna
          </button>
          <button
            onClick={() => onSelectTarget('MARS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedTarget === 'MARS'
                ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔴 Marte
          </button>
        </div>

        {/* Cadet Log / Badges Button */}
        <button
          onClick={onOpenBadges}
          className="flex items-center space-x-2 text-xs bg-black/80 hover:bg-cyan-950/50 backdrop-blur-md border border-cyan-500/40 px-3.5 py-2 rounded-xl text-cyan-300 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Bitácora:</span>
          <span className="font-bold text-amber-400">{scannedCount}/{artifacts.length}</span>
        </button>

      </div>

      {/* 2. CENTER: SpaceX Reticle & Flight HUD */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        
        {/* Reticle Circle */}
        <div className="relative w-52 h-52 sm:w-64 sm:h-64 border border-cyan-500/20 rounded-full flex items-center justify-center">
          <div className="absolute inset-3 border border-dashed border-cyan-500/15 rounded-full"></div>
          <div className="w-full h-[1px] bg-cyan-500/20"></div>
          <div className="h-full w-[1px] bg-cyan-500/20 absolute"></div>

          {/* Center Precision Target Box */}
          <div className="w-6 h-6 border border-cyan-400/70 rounded-md absolute flex items-center justify-center shadow-[0_0_8px_rgba(0,240,255,0.3)]">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>

          <div className="absolute top-2 text-[9px] text-cyan-400/70 font-mono tracking-widest">+05° PITCH</div>
          <div className="absolute bottom-2 text-[9px] text-cyan-400/70 font-mono tracking-widest">-05° PITCH</div>
          <div className="absolute left-2 text-[9px] text-cyan-400/70 font-mono tracking-widest">-02° YAW</div>
          <div className="absolute right-2 text-[9px] text-cyan-400/70 font-mono tracking-widest">+02° YAW</div>
        </div>

        {/* Helper Hint */}
        <div className="absolute bottom-20 text-center">
          <div className="text-[11px] text-slate-400/80 tracking-widest bg-black/60 px-3 py-1 rounded-full border border-slate-800 backdrop-blur-md">
            🖱️ Clic y arrastra para orbitar 360° // Rueda para hacer Zoom libre
          </div>
        </div>

      </div>

      {/* 3. BOTTOM PANEL: Target Selector (Astros & Hardware) */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 pointer-events-auto">
        
        {/* Hardware & Sondas Selector */}
        <div className="flex items-center space-x-1.5 bg-black/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 overflow-x-auto max-w-full">
          <button
            onClick={() => onSelectTarget('APOLLO')}
            className={`px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2 transition-all flex-shrink-0 ${
              selectedTarget === 'APOLLO'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span>🌙</span>
            <span className="font-bold">Apolo 11 (LEM)</span>
          </button>

          <button
            onClick={() => onSelectTarget('INGENUITY')}
            className={`px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2 transition-all flex-shrink-0 ${
              selectedTarget === 'INGENUITY'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span>🔴</span>
            <span className="font-bold">Ingenuity (Dron)</span>
          </button>

          <button
            onClick={() => onSelectTarget('OPPORTUNITY')}
            className={`px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2 transition-all flex-shrink-0 ${
              selectedTarget === 'OPPORTUNITY'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span>🔴</span>
            <span className="font-bold">Opportunity (Rover)</span>
          </button>
        </div>

        {/* Action Controller: Audio & Telemetry Drawer Toggle */}
        <div className="flex items-center space-x-2 bg-black/85 backdrop-blur-md p-2 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          
          {/* NASA Audio Feed Button */}
          <button
            onClick={onToggleAudio}
            className={`p-2.5 rounded-xl text-xs border transition-all flex items-center space-x-1.5 ${
              isPlayingAudio
                ? 'bg-rose-500/30 text-rose-300 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                : 'bg-space-900 text-cyan-300 border-slate-700 hover:border-cyan-400'
            }`}
            title="Audio histórico de la NASA"
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="text-xs">{isPlayingAudio ? 'Silenciar' : 'Audio NASA'}</span>
          </button>

          {/* Toggle Telemetry Drawer */}
          <button
            onClick={() => setIsTelemetryOpen(!isTelemetryOpen)}
            className={`p-2.5 rounded-xl text-xs border transition-all flex items-center space-x-1.5 ${
              isTelemetryOpen
                ? 'bg-cyan-500/25 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                : 'border-slate-700 bg-space-900 text-slate-300 hover:text-white hover:border-cyan-400'
            }`}
            title="Ver Ficha Técnica"
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="text-xs">{isTelemetryOpen ? 'Ocultar Ficha' : 'Ficha Técnica'}</span>
          </button>

        </div>

      </div>

      {/* 4. RIGHT SIDE: Collapsible Glassmorphism Telemetry Drawer */}
      {isTelemetryOpen && (
        <div className="absolute right-3 sm:right-5 top-20 bottom-24 w-80 sm:w-96 bg-black/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 sm:p-5 overflow-y-auto pointer-events-auto shadow-[0_0_35px_rgba(0,0,0,0.9)] animate-slide-left">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div>
              <div className="flex items-center space-x-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  currentArtifact.statusType === 'green' ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' :
                  currentArtifact.statusType === 'warning' ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' :
                  'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                }`}></span>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {currentArtifact.status}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5 tracking-wide">
                {currentArtifact.name}
              </h2>
            </div>
            
            <button
              onClick={() => setIsTelemetryOpen(false)}
              className="text-slate-500 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          {/* Story & What Happened */}
          <div className="mb-4">
            <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
              Historia y Misión
            </span>
            <p className="text-xs text-slate-300 font-sans leading-relaxed bg-space-950/60 p-2.5 rounded-xl border border-slate-800">
              {currentArtifact.theStory}
            </p>
          </div>

          {/* Live Telemetry Matrix */}
          <div className="mb-4">
            <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1.5 flex items-center space-x-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>Diagnóstico de Telemetría</span>
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(currentArtifact.diagnostics).map(([k, v]) => (
                <div key={k} className="bg-space-950/80 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[9px] text-slate-500 uppercase block truncate">
                    {k.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="font-semibold text-slate-200 text-[11px] truncate block">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hardware Deconstructed */}
          <div className="mb-4">
            <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1.5">
              Ingeniería Desglosada (10-16 años)
            </span>
            <div className="space-y-2">
              {currentArtifact.engineeringBreakdown.map((item, idx) => (
                <div key={idx} className="bg-space-950/70 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-bold text-slate-200">{item.title}</span>
                    <span className="text-[9px] px-1 rounded bg-slate-900 border border-slate-700 text-amber-300">
                      {item.specs}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* NASA Open Science Link */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Datos Oficiales NASA</span>
            <a
              href={currentArtifact.officialNasaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-200 underline flex items-center space-x-1"
            >
              <span>Archivo de Misión</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

        </div>
      )}

    </div>
  );
}
