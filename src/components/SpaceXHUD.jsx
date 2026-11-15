import React, { useState } from 'react';
import { 
  Compass, Radio, Volume2, VolumeX, Award, ExternalLink, Activity, 
  Sparkles, Layers, Maximize2, ShieldCheck, Terminal, Eye, Info,
  Navigation, Plane, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, Target, Settings, ChevronUp, ChevronDown
} from 'lucide-react';
import { SOLAR_BODIES, SPECIAL_PROBES } from '../data/solarSystemData';
import CuriosityPanel from './CuriosityPanel';

export default function SpaceXHUD({
  selectedTarget,
  onSelectTarget,
  isFlightMode,
  onToggleFlightMode,
  flightVelocity,
  artifacts,
  onOpenBadges,
  scannedCount,
  isPlayingAudio,
  onToggleAudio,
  onOpenSurface,
  settings,
  onUpdateSettings
}) {
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDestinoMenuOpen, setIsDestinoMenuOpen] = useState(false);

  // Look up target
  const currentBody = SOLAR_BODIES.find(b => b.id.toUpperCase() === selectedTarget.toUpperCase());
  const currentProbe = SPECIAL_PROBES.find(p => p.id.toUpperCase() === selectedTarget.toUpperCase());
  const artifactTargetIds = {
    APOLLO: 'apollo11',
    INGENUITY: 'ingenuity',
    OPPORTUNITY: 'opportunity',
    VIKING: 'viking',
    PERSEVERANCE: 'perseverance',
  };
  const currentArtifact = artifacts.find(a => a.id === artifactTargetIds[selectedTarget]);

  const activeTitle = currentProbe ? currentProbe.name : currentBody ? currentBody.name : currentArtifact ? currentArtifact.name : selectedTarget;
  const activeType = currentProbe ? currentProbe.type : currentBody ? currentBody.type : 'Objeto Espacial';

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-2 sm:p-4 select-none font-mono">
      
      {/* 1. TOP BAR: Sharp Sci-Fi Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        
        {/* Brand & Tracking Status (Renamed from SIMULADOR ESPACIAL to ASTRO ARCHIVE) */}
        <div className="flex items-center space-x-3 bg-black/90 backdrop-blur-md border border-cyan-500/50 px-4 py-2 rounded-none shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <div className="w-2.5 h-2.5 rounded-none bg-cyan-400 animate-ping"></div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm sm:text-base tracking-widest text-cyan-300">ASTRO ARCHIVE</span>
              <span className="text-[10px] bg-cyan-950 border border-cyan-500/60 text-cyan-300 px-2 py-0.5 rounded-none font-mono">
                {isFlightMode ? 'PILOTO NAVE' : 'ORBITAL LOCK'}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">
              OBJETIVO: <span className="text-cyan-300 font-bold">{activeTitle.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Center Mode Controls */}
        <div className="flex items-center space-x-2 bg-black/90 backdrop-blur-md p-1 border border-slate-700 rounded-none text-xs sm:text-sm">
          
          <button
            onClick={() => onSelectTarget('OVERVIEW')}
            className={`px-3 py-2 rounded-none transition-all flex items-center space-x-1.5 ${
              selectedTarget === 'OVERVIEW' && !isFlightMode
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/80 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="font-bold hidden sm:inline">Sistema completo</span>
            <span className="font-bold sm:hidden">Sistema</span>
          </button>

          {/* SPACESHIP FLIGHT MODE TOGGLE */}
          <button
            onClick={onToggleFlightMode}
            className={`px-3.5 py-2 rounded-none transition-all flex items-center space-x-2 font-bold text-xs sm:text-sm ${
              isFlightMode
                ? 'bg-emerald-500 text-black border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)] animate-pulse'
                : 'bg-space-900 text-emerald-400 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/40'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>{isFlightMode ? 'Pilotando nave' : 'Pilotar nave'}</span>
          </button>

        </div>

        {/* Cadet Log / Badges Button */}
        <button
          onClick={onOpenBadges}
          className="flex items-center space-x-2 text-xs sm:text-sm bg-black/90 hover:bg-cyan-950/50 backdrop-blur-md border border-cyan-500/40 px-3 py-2 rounded-none text-cyan-300 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Bitácora:</span>
          <span className="font-bold text-amber-400">{scannedCount}/{artifacts.length}</span>
        </button>

      </div>

      {/* 2. CENTER: SPACE ENGINE FLIGHT HUD (When Flight Mode Active - Clean Separation, NO Overlaps!) */}
      {isFlightMode ? (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between pt-16 sm:pt-20 pb-16 px-3 sm:px-6">
          
          {/* Top Compass Heading Tape (Space Engine Style - Non-overlapping) */}
          <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 bg-black/85 border border-emerald-500/40 px-5 py-1 text-[11px] text-emerald-300 flex items-center space-x-4 sm:space-x-6 backdrop-blur-md font-mono hidden md:flex shadow-[0_0_15px_rgba(0,0,0,0.8)]">
            <span className="text-slate-500">150°</span>
            <span className="text-slate-400">160°</span>
            <span className="text-slate-400">170°</span>
            <span className="text-emerald-400 font-bold border-b-2 border-emerald-400 px-1">180° ▲</span>
            <span className="text-slate-400">190°</span>
            <span className="text-slate-400">200°</span>
            <span className="text-slate-500">210°</span>
            <span className="text-amber-400 font-bold ml-3 border-l border-emerald-500/40 pl-3">REF: {activeTitle.toUpperCase()}</span>
          </div>

          {/* Side Telemetry Panels: Left Spacecraft + Right Orbital Parameters (Placed safely below header) */}
          <div className="flex justify-between items-start mt-4 sm:mt-6">
            
            {/* Left Telemetry Column */}
            <div className="bg-black/85 backdrop-blur-md p-3 border border-emerald-500/50 rounded-none w-56 sm:w-64 space-y-1 text-[11px] sm:text-xs text-emerald-400 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              <div className="text-[10px] uppercase font-bold text-emerald-300 border-b border-emerald-500/30 pb-1 flex items-center justify-between">
                <span>🛸 Telemetría de Nave</span>
                <span className="text-amber-400">SYS: NOMINAL</span>
              </div>
              <div className="flex justify-between"><span>Spacecraft:</span><span className="text-white font-bold">Skylone Explorer</span></div>
              <div className="flex justify-between"><span>Flight mode:</span><span className="text-cyan-300 font-bold">Interplanetary</span></div>
              <div className="flex justify-between"><span>Ship velocity:</span><span className="text-amber-300 font-bold">{(parseFloat(flightVelocity || '0') + 29.33).toFixed(1)} km/s</span></div>
              <div className="flex justify-between"><span>Rel velocity:</span><span className="text-emerald-200">{flightVelocity || '0.0'} km/s</span></div>
              <div className="flex justify-between"><span>Grav accel:</span><span className="text-slate-300">0.61 m/s²</span></div>
              <div className="flex justify-between"><span>Nearest body:</span><span className="text-white font-bold truncate max-w-[100px]">{activeTitle}</span></div>
              <div className="flex justify-between"><span>Thrust power:</span><span className="text-emerald-300 font-bold">{parseFloat(flightVelocity || '0') > 0 ? '100%' : 'IDLE (0%)'}</span></div>
            </div>

            {/* Right Orbital Parameters Column */}
            <div className="bg-black/85 backdrop-blur-md p-3 border border-emerald-500/50 rounded-none w-56 sm:w-64 space-y-1 text-[11px] sm:text-xs text-emerald-400 text-right shadow-[0_0_20px_rgba(0,0,0,0.8)] hidden sm:block">
              <div className="text-[10px] uppercase font-bold text-emerald-300 border-b border-emerald-500/30 pb-1 flex items-center justify-between">
                <span className="text-cyan-300">KEPLERIAN</span>
                <span>Parámetros Orbitales 🌐</span>
              </div>
              <div className="flex justify-between"><span className="text-slate-400">Reference:</span><span className="text-white font-bold truncate max-w-[120px]">{activeTitle}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Period (P):</span><span className="text-emerald-300">3h 58m 57s</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Semi-major (a):</span><span className="text-slate-200">12,756.13 km</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Eccentricity (e):</span><span className="text-amber-300">1.000 (Hyperbolic)</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Inclination (i):</span><span className="text-emerald-300">174.68°</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Periapsis (Rperi):</span><span className="text-cyan-300">6,492 km</span></div>
              <div className="flex justify-between"><span className="text-slate-400">RCS Steering:</span><span className="text-emerald-400 font-bold">ARMED (4x Quad)</span></div>
            </div>

          </div>

          {/* Center: Pitch Ladder & Reticle */}
          <div className="flex-1 flex items-center justify-center relative my-2">
            
            {/* Left & Right Pitch Degree Ladder */}
            <div className="absolute flex items-center space-x-28 sm:space-x-44 text-emerald-400 text-xs font-mono select-none">
              <div className="space-y-4 text-right">
                <div className="opacity-60">-- +10°L</div>
                <div className="text-emerald-300 font-bold">---- 0°</div>
                <div className="opacity-60">-- -10°L</div>
              </div>

              {/* Center Flight Reticle */}
              <div className="w-14 h-14 border-2 border-emerald-400 rounded-none flex items-center justify-center relative shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <div className="w-2 h-2 bg-emerald-400 rounded-none"></div>
                <div className="absolute -top-6 text-[10px] text-emerald-300 font-bold bg-black/80 px-1 border border-emerald-500/40">
                  {flightVelocity || '0.0'} km/s
                </div>
              </div>

              <div className="space-y-4 text-left">
                <div className="opacity-60">+10°R --</div>
                <div className="text-emerald-300 font-bold">0° ----</div>
                <div className="opacity-60">-10°R --</div>
              </div>
            </div>

            {/* Simulated Spaceship Cockpit Silhouette at Bottom Center */}
            <div className="absolute bottom-1 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[28px] border-b-emerald-400/90 shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[9px] text-emerald-400 font-mono tracking-widest mt-1">SHIP VECTOR</span>
            </div>

          </div>

          {/* On-Screen Mobile/Touch Controls for Flight Mode */}
          <div className="pointer-events-auto flex justify-center pb-2">
            <div className="bg-black/90 border border-emerald-500/60 p-2 rounded-none flex items-center space-x-2 text-xs text-emerald-300 shadow-[0_0_20px_rgba(0,0,0,0.9)]">
              <span className="font-bold hidden md:inline px-2">CONTROLES: [W/S] Impulso // [A/D] Girar // [R/F] Elevación // [Shift] Warp</span>
              
              {/* Touch buttons for mobile/mouse */}
              <div className="flex items-center space-x-1.5 md:hidden">
                <button
                  onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW' }))}
                  onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyW' }))}
                  onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW' }))}
                  onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyW' }))}
                  className="px-3 py-1.5 bg-emerald-950 border border-emerald-400 text-white font-bold"
                >
                  ▲ IMPULSO
                </button>
                <button
                  onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyS' }))}
                  onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyS' }))}
                  onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyS' }))}
                  onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyS' }))}
                  className="px-3 py-1.5 bg-emerald-950 border border-emerald-400 text-white font-bold"
                >
                  ▼ FRENAR
                </button>
                <button
                  onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA' }))}
                  onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyA' }))}
                  onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA' }))}
                  onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyA' }))}
                  className="px-3 py-1.5 bg-emerald-950 border border-emerald-400 text-white font-bold"
                >
                  ◄
                </button>
                <button
                  onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD' }))}
                  onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyD' }))}
                  onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD' }))}
                  onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyD' }))}
                  className="px-3 py-1.5 bg-emerald-950 border border-emerald-400 text-white font-bold"
                >
                  ►
                </button>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Normal Orbit Center Reticle */
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-48 h-48 sm:w-60 sm:h-60 border border-cyan-500/20 rounded-none flex items-center justify-center">
            <div className="w-4 h-4 border border-cyan-400/60 rounded-none absolute"></div>
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-none"></div>
          </div>
          <div className="absolute bottom-16 text-center">
            <div className="text-[11px] sm:text-xs text-slate-300 font-mono tracking-widest bg-black/80 px-4 py-1 border border-slate-700 rounded-none backdrop-blur-md">
              Arrastra el ratón para rotar en 360° // Rueda para zoom // Clic en astro para seguimiento
            </div>
          </div>
        </div>
      )}

      {/* 3. BOTTOM PANEL: CLEAN DESKTOP & MOBILE BAR (No Redundant Bar! Dropdown Menu Houses Everything) */}
      <div className="relative flex items-center justify-between gap-2 pointer-events-auto w-full pt-2">

        {/* Custom Interactive Destino Menu Trigger Button */}
        <div className="relative">
          <button
            onClick={() => setIsDestinoMenuOpen(!isDestinoMenuOpen)}
            className="flex items-center space-x-2 bg-black/95 hover:bg-slate-900 border border-cyan-500/60 px-3.5 py-2 text-xs sm:text-sm text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,0,0,0.8)] font-bold"
          >
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>DESTINO:</span>
            <span className="text-white underline">{activeTitle}</span>
            {isDestinoMenuOpen ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronUp className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* ELEVATED CUSTOM DROPDOWN MENU */}
          {isDestinoMenuOpen && (
            <div className="absolute bottom-12 left-0 w-80 sm:w-96 max-h-[72vh] overflow-y-auto bg-black/95 backdrop-blur-xl border border-cyan-500/70 p-3 shadow-2xl z-50 pointer-events-auto space-y-3">
              
              {/* Menu Header */}
              <div className="flex items-center justify-between border-b border-cyan-500/40 pb-2">
                <span className="font-bold uppercase tracking-wider text-cyan-300 text-xs flex items-center space-x-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Navegación del Sistema</span>
                </span>
                <button
                  onClick={() => setIsDestinoMenuOpen(false)}
                  className="text-slate-400 hover:text-white px-1 font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Vista General */}
              <button
                onClick={() => { onSelectTarget('OVERVIEW'); setIsDestinoMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 border transition-all flex items-center space-x-2 text-xs font-bold ${
                  selectedTarget === 'OVERVIEW'
                    ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400'
                    : 'border-slate-800 bg-space-950 text-slate-300 hover:text-white hover:border-slate-600'
                }`}
              >
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>🌌 Sistema Completo (Vista Panorámica)</span>
              </button>

              {/* 1. Astros del Sistema Solar (with colored square boxes) */}
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center space-x-1">
                  <span>🪐 Astros & Cuerpos Celestes</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {SOLAR_BODIES.map((body) => {
                    const isSelected = selectedTarget.toUpperCase() === body.id.toUpperCase();
                    return (
                      <button
                        key={body.id}
                        onClick={() => { onSelectTarget(body.id.toUpperCase()); setIsDestinoMenuOpen(false); }}
                        className={`p-2 border transition-all flex items-center space-x-2 text-left ${
                          isSelected
                            ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400 font-bold shadow-[0_0_8px_rgba(0,240,255,0.3)]'
                            : 'border-slate-800 bg-black/60 text-slate-300 hover:border-cyan-500/40 hover:text-white'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-none flex-shrink-0"
                          style={{ backgroundColor: body.color, boxShadow: `0 0 6px ${body.color}80` }}
                        />
                        <span className="truncate">{body.shortName || body.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Sondas Interestelares y Estación (with tech boxes) */}
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider mb-1.5 flex items-center space-x-1">
                  <span>🛰️ Sondas y Estación Espacial</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button
                    onClick={() => { onSelectTarget('VOYAGER1'); setIsDestinoMenuOpen(false); }}
                    className={`p-2 border transition-all text-center font-bold ${
                      selectedTarget === 'VOYAGER1'
                        ? 'bg-amber-500/30 text-amber-300 border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                        : 'border-amber-500/40 bg-amber-950/20 text-amber-300/90 hover:bg-amber-950/40 hover:border-amber-400'
                    }`}
                  >
                    Voyager 1
                  </button>
                  <button
                    onClick={() => { onSelectTarget('VOYAGER2'); setIsDestinoMenuOpen(false); }}
                    className={`p-2 border transition-all text-center font-bold ${
                      selectedTarget === 'VOYAGER2'
                        ? 'bg-amber-500/30 text-amber-300 border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                        : 'border-amber-500/40 bg-amber-950/20 text-amber-300/90 hover:bg-amber-950/40 hover:border-amber-400'
                    }`}
                  >
                    Voyager 2
                  </button>
                  <button
                    onClick={() => { onSelectTarget('ISS'); setIsDestinoMenuOpen(false); }}
                    className={`p-2 border transition-all text-center font-bold ${
                      selectedTarget === 'ISS'
                        ? 'bg-blue-500/30 text-blue-300 border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.4)]'
                        : 'border-blue-500/40 bg-blue-950/20 text-blue-300/90 hover:bg-blue-950/40 hover:border-blue-400'
                    }`}
                  >
                    ISS (LEO)
                  </button>
                </div>
              </div>

              {/* 3. Tecnologías y Reliquias en Superficie (with boxed chips) */}
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-1.5 flex items-center space-x-1">
                  <span>🚀 Reliquias Históricas en Superficie</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {artifacts.map((artifact) => {
                    const isSelected = selectedTarget === artifact.id.toUpperCase();
                    return (
                      <button
                        key={artifact.id}
                        onClick={() => { onSelectTarget(artifact.id.toUpperCase()); setIsDestinoMenuOpen(false); }}
                        className={`p-2 border transition-all flex flex-col items-start text-left ${
                          isSelected
                            ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400 font-bold shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                            : 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300/90 hover:bg-emerald-950/40 hover:border-emerald-400'
                        }`}
                      >
                        <span className="font-bold text-xs truncate w-full">{artifact.name.split(' (')[0]}</span>
                        <span className="text-[10px] text-slate-400">{artifact.body}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Audio, Telemetry & Settings Controls (Right Side) */}
        <div className="flex items-center space-x-2 bg-black/95 backdrop-blur-md p-1.5 border border-cyan-500/40 rounded-none shadow-[0_0_15px_rgba(0,0,0,0.8)] flex-shrink-0">
          
          <button
            onClick={onToggleAudio}
            className={`p-2 rounded-none text-xs sm:text-sm border transition-all flex items-center space-x-1.5 ${
              isPlayingAudio
                ? 'bg-rose-500/30 text-rose-300 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                : 'bg-space-900 text-cyan-300 border-slate-700 hover:border-cyan-400'
            }`}
            title="Audio histórico de la NASA"
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="font-bold hidden sm:inline">{isPlayingAudio ? 'Silenciar' : 'Audio NASA'}</span>
          </button>

          <button
            onClick={() => setIsTelemetryOpen(!isTelemetryOpen)}
            className={`p-2 rounded-none text-xs sm:text-sm border transition-all flex items-center space-x-1.5 ${
              isTelemetryOpen
                ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                : 'border-slate-700 bg-space-900 text-slate-300 hover:text-white hover:border-cyan-400'
            }`}
            title="Ficha y Curiosidades"
          >
            <Info className="w-4 h-4 text-amber-400" />
            <span className="font-bold hidden sm:inline">{isTelemetryOpen ? 'Ocultar' : 'Curiosidades'}</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen((value) => !value)}
            aria-label="Abrir configuración"
            title="Configuración"
            className={`p-2 border transition-all ${
              isSettingsOpen ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'border-slate-700 bg-space-900 text-slate-300 hover:border-amber-400'
            }`}
          >
            <Settings className="h-4 w-4" />
          </button>

        </div>

      </div>

      {/* 4. Curiosities panel */}
      {isTelemetryOpen && (
        <CuriosityPanel
          artifact={currentArtifact}
          body={currentBody}
          probe={currentProbe}
          onClose={() => setIsTelemetryOpen(false)}
          onOpenSurface={onOpenSurface}
        />
      )}

      {/* 5. FUNCTIONAL SETTINGS WHEEL MODAL */}
      {isSettingsOpen && (
        <div className="absolute bottom-16 right-2 z-50 w-80 max-w-[calc(100vw-1.5rem)] border border-amber-500/60 bg-black/95 backdrop-blur-xl p-4 text-xs shadow-2xl sm:right-4 pointer-events-auto font-mono">
          
          <div className="mb-3 flex items-center justify-between border-b border-slate-700 pb-2">
            <span className="font-bold uppercase tracking-wider text-amber-300 flex items-center space-x-1.5">
              <Settings className="w-4 h-4 text-amber-400" />
              <span>Configuración del Simulador</span>
            </span>
            <button
              onClick={() => setIsSettingsOpen(false)}
              aria-label="Cerrar configuración"
              className="text-slate-400 hover:text-white px-1 font-bold text-sm"
            >
              ✕
            </button>
          </div>

          {/* Velocidad Orbital de Simulación */}
          <div className="mb-4">
            <span className="text-slate-300 font-bold block mb-1.5">Velocidad Orbital del Sistema:</span>
            <div className="grid grid-cols-4 gap-1.5">
              {[0.5, 1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => onUpdateSettings({ simSpeed: spd })}
                  className={`py-1 px-2 border font-bold text-center transition-all ${
                    (settings.simSpeed || 1) === spd
                      ? 'bg-amber-500 text-black border-amber-400 font-black shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                      : 'bg-black/60 border-slate-700 text-slate-300 hover:border-amber-400'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <label className="flex items-center justify-between gap-3 text-slate-200 cursor-pointer">
              <span>Mostrar órbitas de planetas</span>
              <input
                type="checkbox"
                checked={settings.showOrbits !== false}
                onChange={(event) => onUpdateSettings({ showOrbits: event.target.checked })}
                className="accent-amber-400 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between gap-3 text-slate-200 cursor-pointer">
              <span>Mostrar trazos y balizas Voyager</span>
              <input
                type="checkbox"
                checked={settings.showTrails !== false}
                onChange={(event) => onUpdateSettings({ showTrails: event.target.checked })}
                className="accent-amber-400 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between gap-3 text-slate-200 cursor-pointer">
              <span>Pausar órbitas (Reducir movimiento)</span>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(event) => onUpdateSettings({ reducedMotion: event.target.checked })}
                className="accent-amber-400 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between gap-3 text-slate-200 cursor-pointer">
              <span>Modo Alto Contraste</span>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(event) => onUpdateSettings({ highContrast: event.target.checked })}
                className="accent-amber-400 w-4 h-4"
              />
            </label>
          </div>

          <div className="mt-4 border-t border-slate-800 pt-2 text-[10px] leading-relaxed text-slate-400 flex items-center justify-between">
            <span>Render: WebGL Three.js</span>
            <span className="text-emerald-400 font-bold">● 60 FPS Nominal</span>
          </div>

        </div>
      )}

    </div>
  );
}
