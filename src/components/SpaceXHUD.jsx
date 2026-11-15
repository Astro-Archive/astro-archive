import React, { useState } from 'react';
import { 
  Compass, Radio, Volume2, VolumeX, Award, ExternalLink, Activity, 
  Sparkles, Layers, Maximize2, ShieldCheck, Terminal, Eye, Info
} from 'lucide-react';
import { SOLAR_BODIES } from '../data/solarSystemData';

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

  // Find info about current celestial body or artifact
  const currentBody = SOLAR_BODIES.find(b => b.id.toUpperCase() === selectedTarget.toUpperCase()) || SOLAR_BODIES[0];
  const currentArtifact = artifacts.find(a => 
    (selectedTarget === 'APOLLO' && a.id === 'apollo11') ||
    (selectedTarget === 'INGENUITY' && a.id === 'ingenuity')
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 sm:p-5 select-none font-mono">
      
      {/* 1. TOP BAR: Mission Header & Planetary Quick Jump */}
      <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        
        {/* Brand / Mode Indicator */}
        <div className="flex items-center space-x-3 bg-black/80 backdrop-blur-md border border-cyan-500/40 px-3.5 py-2 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs sm:text-sm tracking-widest text-white">SISTEMA SOLAR 3D</span>
              <span className="text-[10px] bg-cyan-950 border border-cyan-500/50 text-cyan-300 px-1.5 py-0.2 rounded font-mono">
                SOL A PLUTÓN
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              ENFOCANDO: <span className="text-cyan-300 font-bold">{currentArtifact ? currentArtifact.name.toUpperCase() : currentBody.name.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Global Overview / Focus Button */}
        <div className="flex items-center space-x-1 sm:space-x-2 bg-black/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => onSelectTarget('OVERVIEW')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              selectedTarget === 'OVERVIEW'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>🌌 Vista General del Sistema</span>
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

      {/* 2. CENTER: Subtle Reticle Indicator */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-48 h-48 sm:w-60 sm:h-60 border border-cyan-500/15 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 border border-cyan-400/50 rounded-sm absolute"></div>
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
        </div>
        <div className="absolute bottom-20 text-center">
          <div className="text-[11px] text-slate-400/80 tracking-widest bg-black/60 px-3 py-1 rounded-full border border-slate-800 backdrop-blur-md">
            🖱️ Clic y arrastra para orbitar en 360° // Rueda del ratón para hacer Zoom libre
          </div>
        </div>
      </div>

      {/* 3. BOTTOM PANEL: The Complete Solar System Planetary Ribbon (Sun to Pluto) */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 pointer-events-auto">
        
        {/* Planetary Selector Ribbon */}
        <div className="flex items-center space-x-1.5 bg-black/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 overflow-x-auto max-w-full no-scrollbar">
          
          {/* Sun to Pluto buttons */}
          {SOLAR_BODIES.map((body) => {
            const isSelected = selectedTarget.toLowerCase() === body.id.toLowerCase();
            return (
              <button
                key={body.id}
                onClick={() => onSelectTarget(body.id.toUpperCase())}
                className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/70 shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: body.color }}></span>
                <span className="font-bold">{body.name.split(' ')[0]}</span>
              </button>
            );
          })}

          {/* Moon shortcut */}
          <button
            onClick={() => onSelectTarget('MOON')}
            className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all flex-shrink-0 border ${
              selectedTarget === 'MOON'
                ? 'bg-slate-300/30 text-white border-slate-200'
                : 'text-slate-400 hover:text-white border-transparent'
            }`}
          >
            <span>🌙</span>
            <span>Luna</span>
          </button>

          {/* Hardware focus */}
          <button
            onClick={() => onSelectTarget('APOLLO')}
            className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all flex-shrink-0 border ${
              selectedTarget === 'APOLLO'
                ? 'bg-amber-500/30 text-amber-300 border-amber-400'
                : 'text-amber-400/80 hover:text-amber-300 border-amber-500/30'
            }`}
          >
            <span>🛰️</span>
            <span>Apolo 11</span>
          </button>

          <button
            onClick={() => onSelectTarget('INGENUITY')}
            className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all flex-shrink-0 border ${
              selectedTarget === 'INGENUITY'
                ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400'
                : 'text-cyan-400/80 hover:text-cyan-300 border-cyan-500/30'
            }`}
          >
            <span>🚁</span>
            <span>Ingenuity</span>
          </button>

        </div>

        {/* Action Controller: Audio & Data Drawer Toggle */}
        <div className="flex items-center space-x-2 bg-black/90 backdrop-blur-md p-2 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          
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
            <Info className="w-4 h-4 text-amber-400" />
            <span className="text-xs">{isTelemetryOpen ? 'Ocultar Ficha' : 'Ficha del Astro'}</span>
          </button>

        </div>

      </div>

      {/* 4. RIGHT SIDE: Collapsible Glassmorphism Data Drawer */}
      {isTelemetryOpen && (
        <div className="absolute right-3 sm:right-5 top-20 bottom-24 w-80 sm:w-96 bg-black/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 sm:p-5 overflow-y-auto pointer-events-auto shadow-[0_0_35px_rgba(0,0,0,0.9)] animate-slide-left">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400">
                {currentArtifact ? 'Reliquia Tecnológica de la NASA' : currentBody.type}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5 tracking-wide">
                {currentArtifact ? currentArtifact.name : currentBody.name}
              </h2>
            </div>
            
            <button
              onClick={() => setIsTelemetryOpen(false)}
              className="text-slate-500 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          {/* Body or Artifact Information */}
          {currentArtifact ? (
            <>
              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                  Misión y Sitio de Aterrizaje
                </span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed bg-space-950/60 p-2.5 rounded-xl border border-slate-800">
                  {currentArtifact.theStory}
                </p>
              </div>

              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1.5 flex items-center space-x-1">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Telemetría de la Máquina</span>
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
            </>
          ) : (
            <>
              {/* Planetary Physical Specs */}
              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1.5 flex items-center space-x-1">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Datos Astronómicos Oficiales</span>
                </span>
                <div className="space-y-2 text-xs">
                  <div className="bg-space-950/80 p-2.5 rounded-lg border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Diámetro Real:</span>
                    <span className="font-bold text-slate-200">{currentBody.realDiameter}</span>
                  </div>
                  <div className="bg-space-950/80 p-2.5 rounded-lg border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Temperatura Superficial:</span>
                    <span className="font-bold text-slate-200">{currentBody.surfaceTemp}</span>
                  </div>
                  {currentBody.orbitalPeriod && (
                    <div className="bg-space-950/80 p-2.5 rounded-lg border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Período Orbital:</span>
                      <span className="font-bold text-slate-200">{currentBody.orbitalPeriod}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fun / Key Fact */}
              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                  Dato Científico Clave
                </span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed bg-space-950/60 p-2.5 rounded-xl border border-slate-800">
                  {currentBody.funFact}
                </p>
              </div>
            </>
          )}

          {/* NASA Open Science Link */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">NASA Science Solar System</span>
            <a
              href="https://science.nasa.gov/solar-system/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-200 underline flex items-center space-x-1"
            >
              <span>Exploración NASA</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

        </div>
      )}

    </div>
  );
}
