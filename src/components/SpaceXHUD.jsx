import React, { useState } from 'react';
import { 
  Compass, Radio, Volume2, VolumeX, Award, ExternalLink, Activity, 
  Sparkles, Layers, Maximize2, ShieldCheck, Terminal, Eye, Info,
  Navigation, Plane, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap
} from 'lucide-react';
import { SOLAR_BODIES, SPECIAL_PROBES } from '../data/solarSystemData';

export default function SpaceXHUD({
  selectedTarget,
  onSelectTarget,
  isFlightMode,
  onToggleFlightMode,
  artifacts,
  onOpenBadges,
  scannedCount,
  isPlayingAudio,
  onToggleAudio
}) {
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);

  // Look up either celestial body or special probe
  const currentBody = SOLAR_BODIES.find(b => b.id.toUpperCase() === selectedTarget.toUpperCase());
  const currentProbe = SPECIAL_PROBES.find(p => p.id.toUpperCase() === selectedTarget.toUpperCase());
  const currentArtifact = artifacts.find(a => 
    (selectedTarget === 'APOLLO' && a.id === 'apollo11') ||
    (selectedTarget === 'INGENUITY' && a.id === 'ingenuity')
  );

  const activeTitle = currentProbe ? currentProbe.name : currentBody ? currentBody.name : currentArtifact ? currentArtifact.name : selectedTarget;
  const activeType = currentProbe ? currentProbe.type : currentBody ? currentBody.type : 'Objeto Espacial';

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 sm:p-5 select-none font-mono">
      
      {/* 1. TOP BAR: Mode, Targets & Spaceship Flight Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        
        {/* Brand & Tracking Status */}
        <div className="flex items-center space-x-3 bg-black/85 backdrop-blur-md border border-cyan-500/40 px-3.5 py-2 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs sm:text-sm tracking-widest text-white">SIMULADOR ESPACIAL</span>
              <span className="text-[10px] bg-cyan-950 border border-cyan-500/50 text-cyan-300 px-1.5 py-0.2 rounded font-mono">
                {isFlightMode ? 'MODO NAVE PILOTO' : 'ORBITAL LOCK'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              SEGUIMIENTO ACTIVO: <span className="text-cyan-300 font-bold">{activeTitle.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Center Mode Controls: Solar System Overview & Spaceship Pilot Mode */}
        <div className="flex items-center space-x-2 bg-black/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 text-xs">
          
          <button
            onClick={() => onSelectTarget('OVERVIEW')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              selectedTarget === 'OVERVIEW' && !isFlightMode
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>🌌 Sistema Completo</span>
          </button>

          {/* SPACESHIP FLIGHT MODE TOGGLE */}
          <button
            onClick={onToggleFlightMode}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 font-bold ${
              isFlightMode
                ? 'bg-amber-500 text-black border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse'
                : 'bg-space-900 text-amber-400 border border-amber-500/30 hover:border-amber-400'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>{isFlightMode ? '⚡ Pilotando Nave' : '🚀 Pilotar Nave'}</span>
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

      {/* 2. CENTER: Flight HUD / Reticle & Spaceship Velocity Telemetry */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        
        {/* Reticle */}
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 border border-cyan-500/20 rounded-full flex items-center justify-center">
          <div className="absolute inset-3 border border-dashed border-cyan-500/15 rounded-full"></div>
          <div className="w-full h-[1px] bg-cyan-500/20"></div>
          <div className="h-full w-[1px] bg-cyan-500/20 absolute"></div>
          <div className="w-6 h-6 border border-cyan-400/60 rounded-sm absolute flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Flight Telemetry Status Bar */}
        <div className="absolute bottom-20 text-center">
          {isFlightMode ? (
            <div className="text-[11px] text-amber-300 font-bold tracking-widest bg-black/80 px-4 py-1.5 rounded-full border border-amber-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center space-x-2">
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>CONTROLES: [W/S] Acelerar/Frenar // [A/D] Girar // [R/F] Subir/Bajar // [SHIFT] Turbo Warp</span>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 tracking-widest bg-black/60 px-3 py-1 rounded-full border border-slate-800 backdrop-blur-md">
              🎯 Clic en un astro: la cámara lo sigue en su órbita solar // Arrastra el ratón para rotar en 360°
            </div>
          )}
        </div>

      </div>

      {/* 3. BOTTOM PANEL: The Complete Solar System & Spacecraft Selector Ribbon */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 pointer-events-auto">
        
        {/* Complete Planetary & Probes Ribbon */}
        <div className="flex items-center space-x-1.5 bg-black/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 overflow-x-auto max-w-full no-scrollbar">
          
          {/* Section: Los Astros (Sol a Plutón) */}
          {SOLAR_BODIES.map((body) => {
            const isSelected = selectedTarget.toUpperCase() === body.id.toUpperCase() && !isFlightMode;
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

          <div className="w-[1px] h-5 bg-slate-800 mx-1 flex-shrink-0"></div>

          {/* Section: Sondas Voyager & ISS */}
          <button
            onClick={() => onSelectTarget('VOYAGER1')}
            className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all flex-shrink-0 border ${
              selectedTarget === 'VOYAGER1' && !isFlightMode
                ? 'bg-amber-500/30 text-amber-300 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'text-amber-400/80 hover:text-amber-300 border-amber-500/30'
            }`}
          >
            <span>🛰️</span>
            <span>Voyager 1</span>
          </button>

          <button
            onClick={() => onSelectTarget('VOYAGER2')}
            className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all flex-shrink-0 border ${
              selectedTarget === 'VOYAGER2' && !isFlightMode
                ? 'bg-amber-500/30 text-amber-300 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'text-amber-400/80 hover:text-amber-300 border-amber-500/30'
            }`}
          >
            <span>🛰️</span>
            <span>Voyager 2</span>
          </button>

          <button
            onClick={() => onSelectTarget('ISS')}
            className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all flex-shrink-0 border ${
              selectedTarget === 'ISS' && !isFlightMode
                ? 'bg-blue-500/30 text-blue-300 border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                : 'text-blue-400/80 hover:text-blue-300 border-blue-500/30'
            }`}
          >
            <span>🛸</span>
            <span>ISS</span>
          </button>

          {/* Section: Luna / Marte hardware */}
          <button
            onClick={() => onSelectTarget('APOLLO')}
            className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all flex-shrink-0 border ${
              selectedTarget === 'APOLLO' && !isFlightMode
                ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400'
                : 'text-emerald-400/80 hover:text-emerald-300 border-emerald-500/30'
            }`}
          >
            <span>🌙</span>
            <span>Apolo 11</span>
          </button>

          <button
            onClick={() => onSelectTarget('INGENUITY')}
            className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all flex-shrink-0 border ${
              selectedTarget === 'INGENUITY' && !isFlightMode
                ? 'bg-red-500/30 text-red-300 border-red-400'
                : 'text-red-400/80 hover:text-red-300 border-red-500/30'
            }`}
          >
            <span>🚁</span>
            <span>Ingenuity</span>
          </button>

        </div>

        {/* Audio & Telemetry Drawer Controls */}
        <div className="flex items-center space-x-2 bg-black/90 backdrop-blur-md p-2 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          
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
            <span className="text-xs">{isPlayingAudio ? 'Mute' : 'Audio NASA'}</span>
          </button>

          <button
            onClick={() => setIsTelemetryOpen(!isTelemetryOpen)}
            className={`p-2.5 rounded-xl text-xs border transition-all flex items-center space-x-1.5 ${
              isTelemetryOpen
                ? 'bg-cyan-500/25 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                : 'border-slate-700 bg-space-900 text-slate-300 hover:text-white hover:border-cyan-400'
            }`}
            title="Ficha y Curiosidades"
          >
            <Info className="w-4 h-4 text-amber-400" />
            <span className="text-xs">{isTelemetryOpen ? 'Ocultar' : 'Curiosidades'}</span>
          </button>

        </div>

      </div>

      {/* 4. RIGHT SIDE: Collapsible Data & Curiosities Drawer */}
      {isTelemetryOpen && (
        <div className="absolute right-3 sm:right-5 top-20 bottom-24 w-80 sm:w-96 bg-black/92 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 sm:p-5 overflow-y-auto pointer-events-auto shadow-[0_0_35px_rgba(0,0,0,0.9)] animate-slide-left">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400">
                {activeType}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5 tracking-wide">
                {activeTitle}
              </h2>
            </div>
            
            <button
              onClick={() => setIsTelemetryOpen(false)}
              className="text-slate-500 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          {/* Special Probe Details */}
          {currentProbe && (
            <div className="mb-4">
              <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1.5 flex items-center space-x-1">
                <Terminal className="w-3.5 h-3.5" />
                <span>Estado de Telemetría Espacial</span>
              </span>
              <div className="space-y-1.5 text-xs bg-space-950/80 p-2.5 rounded-xl border border-slate-800">
                <div className="flex justify-between"><span className="text-slate-400">Lanzamiento:</span><span className="font-bold text-slate-200">{currentProbe.launchYear}</span></div>
                {currentProbe.distanceAU && <div className="flex justify-between"><span className="text-slate-400">Distancia Actual:</span><span className="font-bold text-cyan-300">{currentProbe.distanceAU}</span></div>}
                <div className="flex justify-between"><span className="text-slate-400">Velocidad:</span><span className="font-bold text-amber-300">{currentProbe.speedKmH}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Estado:</span><span className="font-bold text-emerald-400">{currentProbe.status}</span></div>
              </div>
            </div>
          )}

          {/* Curiosidades y Secretos Científicos (Ages 10-16) */}
          <div className="mb-4">
            <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-2 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Curiosidades y Datos Asombrosos</span>
            </span>
            <div className="space-y-2">
              {(currentProbe?.funFacts || currentBody?.funFacts || []).map((fact, idx) => (
                <div key={idx} className="bg-space-950/80 p-2.5 rounded-xl border border-slate-800/80 hover:border-cyan-500/30 transition-all">
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    ✨ {fact}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* NASA Mission Link */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">NASA Science Open Data</span>
            <a
              href="https://science.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-200 underline flex items-center space-x-1"
            >
              <span>Portal Oficial NASA</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

        </div>
      )}

    </div>
  );
}
