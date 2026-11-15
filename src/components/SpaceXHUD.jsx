import React, { useState } from 'react';
import { 
  Compass, Radio, Volume2, VolumeX, Award, ExternalLink, Activity, 
  Sparkles, Layers, Maximize2, ShieldCheck, Terminal, Eye, Info,
  Navigation, Plane, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, Target
} from 'lucide-react';
import { SOLAR_BODIES, SPECIAL_PROBES } from '../data/solarSystemData';

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
  onToggleAudio
}) {
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);

  // Look up target
  const currentBody = SOLAR_BODIES.find(b => b.id.toUpperCase() === selectedTarget.toUpperCase());
  const currentProbe = SPECIAL_PROBES.find(p => p.id.toUpperCase() === selectedTarget.toUpperCase());
  const currentArtifact = artifacts.find(a => 
    (selectedTarget === 'APOLLO' && a.id === 'apollo11') ||
    (selectedTarget === 'INGENUITY' && a.id === 'ingenuity')
  );

  const activeTitle = currentProbe ? currentProbe.name : currentBody ? currentBody.name : currentArtifact ? currentArtifact.name : selectedTarget;
  const activeType = currentProbe ? currentProbe.type : currentBody ? currentBody.type : 'Objeto Espacial';

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-2 sm:p-4 select-none font-mono">
      
      {/* 1. TOP BAR: Sharp Sci-Fi Header (Rounded-none) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        
        {/* Brand & Tracking Status */}
        <div className="flex items-center space-x-3 bg-black/90 backdrop-blur-md border border-cyan-500/50 px-4 py-2.5 rounded-none shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <div className="w-3 h-3 rounded-none bg-cyan-400 animate-ping"></div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm sm:text-base tracking-widest text-white">SIMULADOR ESPACIAL</span>
              <span className="text-xs bg-cyan-950 border border-cyan-500/60 text-cyan-300 px-2 py-0.5 rounded-none font-mono">
                {isFlightMode ? 'MODO NAVE PILOTO' : 'ORBITAL LOCK'}
              </span>
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              SEGUIMIENTO: <span className="text-cyan-300 font-bold">{activeTitle.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Center Mode Controls: Solar System Overview & Spaceship Pilot Mode */}
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
            <span className="font-bold">🌌 Sistema Completo</span>
          </button>

          {/* SPACESHIP FLIGHT MODE TOGGLE */}
          <button
            onClick={onToggleFlightMode}
            className={`px-4 py-2 rounded-none transition-all flex items-center space-x-2 font-bold text-xs sm:text-sm ${
              isFlightMode
                ? 'bg-emerald-500 text-black border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)] animate-pulse'
                : 'bg-space-900 text-emerald-400 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/40'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>{isFlightMode ? '⚡ PILOTANDO NAVE' : '🚀 PILOTAR NAVE'}</span>
          </button>

        </div>

        {/* Cadet Log / Badges Button */}
        <button
          onClick={onOpenBadges}
          className="flex items-center space-x-2 text-xs sm:text-sm bg-black/90 hover:bg-cyan-950/50 backdrop-blur-md border border-cyan-500/40 px-3.5 py-2.5 rounded-none text-cyan-300 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Bitácora:</span>
          <span className="font-bold text-amber-400">{scannedCount}/{artifacts.length}</span>
        </button>

      </div>

      {/* 2. CENTER: SPACE ENGINE STYLE FLIGHT HUD (When Flight Mode Active) */}
      {isFlightMode ? (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-8">
          
          {/* Top Space Engine Telemetry Data (Green aesthetic like user's reference) */}
          <div className="flex justify-between text-xs sm:text-sm text-emerald-400 font-mono tracking-wider">
            <div className="bg-black/70 p-3 border border-emerald-500/40 rounded-none max-w-xs space-y-1">
              <div>Spacecraft: <span className="text-white font-bold">Skylone Explorer</span></div>
              <div>Flight mode: <span className="text-emerald-300">Interplanetary</span></div>
              <div>Ship velocity: <span className="text-amber-300 font-bold">{flightVelocity || '29.33'} km/s</span></div>
              <div>Reference body: <span className="text-white">{selectedTarget}</span></div>
            </div>

            <div className="bg-black/70 p-3 border border-emerald-500/40 rounded-none max-w-xs text-right space-y-1 hidden sm:block">
              <div>Orbital parameters: <span className="text-emerald-300">Nominal</span></div>
              <div>Thrust power: <span className="text-cyan-300 font-bold">100%</span></div>
              <div>RCS: <span className="text-emerald-400">ARMED</span></div>
            </div>
          </div>

          {/* Center: Pitch Ladder & Crosshairs (Space Engine Style) */}
          <div className="flex-1 flex items-center justify-center relative">
            
            {/* Left & Right Pitch Degree Ladder */}
            <div className="absolute flex items-center space-x-32 sm:space-x-48 text-emerald-400 text-xs font-mono select-none">
              <div className="space-y-4 text-right">
                <div>-- +10°L</div>
                <div>---- 0°</div>
                <div>-- -10°L</div>
              </div>

              {/* Center Flight Reticle */}
              <div className="w-12 h-12 border-2 border-emerald-400 rounded-none flex items-center justify-center relative">
                <div className="w-2 h-2 bg-emerald-400 rounded-none"></div>
                <div className="absolute -top-6 text-[11px] text-emerald-300 font-bold">{flightVelocity || '29.3'} km/s</div>
              </div>

              <div className="space-y-4 text-left">
                <div>+10°R --</div>
                <div>0° ----</div>
                <div>-10°R --</div>
              </div>
            </div>

            {/* Simulated Spaceship Cockpit Silhouette at Bottom Center (Image 3 'f') */}
            <div className="absolute bottom-2 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[32px] border-b-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[10px] text-emerald-400 font-mono tracking-widest mt-1">SHIP NOSE</span>
            </div>

          </div>

          {/* On-Screen Mobile/Touch Controls for Flight Mode */}
          <div className="pointer-events-auto flex justify-center pb-20 sm:pb-24">
            <div className="bg-black/85 border border-emerald-500/50 p-2 rounded-none flex items-center space-x-2 text-xs sm:text-sm text-emerald-300 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              <span className="font-bold hidden md:inline px-2">CONTROLES: [W/S] Impulso // [A/D] Girar // [R/F] Subir // [SHIFT] Warp</span>
              
              {/* Touch buttons for mobile/mouse */}
              <div className="flex items-center space-x-1.5 md:hidden">
                <button
                  onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW' }))}
                  onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyW' }))}
                  onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW' }))}
                  onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyW' }))}
                  className="px-3 py-2 bg-emerald-950 border border-emerald-400 text-white font-bold"
                >
                  ▲ IMPULSO
                </button>
                <button
                  onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyS' }))}
                  onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyS' }))}
                  onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyS' }))}
                  onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyS' }))}
                  className="px-3 py-2 bg-emerald-950 border border-emerald-400 text-white font-bold"
                >
                  ▼ FRENAR
                </button>
                <button
                  onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA' }))}
                  onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyA' }))}
                  onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA' }))}
                  onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyA' }))}
                  className="px-3 py-2 bg-emerald-950 border border-emerald-400 text-white font-bold"
                >
                  ◄
                </button>
                <button
                  onMouseDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD' }))}
                  onMouseUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyD' }))}
                  onTouchStart={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD' }))}
                  onTouchEnd={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyD' }))}
                  className="px-3 py-2 bg-emerald-950 border border-emerald-400 text-white font-bold"
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
          <div className="absolute bottom-20 text-center">
            <div className="text-xs sm:text-sm text-slate-300 font-mono tracking-widest bg-black/75 px-4 py-1.5 border border-slate-700 rounded-none backdrop-blur-md">
              🖱️ Clic en un astro para seguirlo // Arrastra el ratón para rotar 360° // Rueda para Zoom
            </div>
          </div>
        </div>
      )}

      {/* 3. BOTTOM PANEL: RESPONSIVE PLANETARY & SPACECRAFT RIBBON (Sharp borders, larger font, no cutoffs) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-auto w-full">
        
        {/* Horizontal Scrollable Ribbon with Clean Short Names */}
        <div className="flex-1 bg-black/95 backdrop-blur-md p-2 border border-slate-700 rounded-none overflow-x-auto flex items-center space-x-2 text-xs sm:text-sm">
          
          {/* Astros Sol a Plutón */}
          {SOLAR_BODIES.map((body) => {
            const isSelected = selectedTarget.toUpperCase() === body.id.toUpperCase() && !isFlightMode;
            return (
              <button
                key={body.id}
                onClick={() => onSelectTarget(body.id.toUpperCase())}
                className={`px-3 py-2 rounded-none flex items-center space-x-2 flex-shrink-0 transition-all font-bold ${
                  isSelected
                    ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-none flex-shrink-0" style={{ backgroundColor: body.color }}></span>
                <span>{body.shortName}</span>
              </button>
            );
          })}

          <div className="w-[1px] h-6 bg-slate-700 mx-1 flex-shrink-0"></div>

          {/* Sondas Voyager, ISS y Hardware */}
          <button
            onClick={() => onSelectTarget('VOYAGER1')}
            className={`px-3 py-2 rounded-none flex items-center space-x-1.5 flex-shrink-0 font-bold border transition-all ${
              selectedTarget === 'VOYAGER1' && !isFlightMode
                ? 'bg-amber-500/30 text-amber-300 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'text-amber-400/90 hover:text-amber-200 border-amber-500/30 hover:bg-amber-950/30'
            }`}
          >
            <span>🛰️</span>
            <span>Voyager 1</span>
          </button>

          <button
            onClick={() => onSelectTarget('VOYAGER2')}
            className={`px-3 py-2 rounded-none flex items-center space-x-1.5 flex-shrink-0 font-bold border transition-all ${
              selectedTarget === 'VOYAGER2' && !isFlightMode
                ? 'bg-amber-500/30 text-amber-300 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'text-amber-400/90 hover:text-amber-200 border-amber-500/30 hover:bg-amber-950/30'
            }`}
          >
            <span>🛰️</span>
            <span>Voyager 2</span>
          </button>

          <button
            onClick={() => onSelectTarget('ISS')}
            className={`px-3 py-2 rounded-none flex items-center space-x-1.5 flex-shrink-0 font-bold border transition-all ${
              selectedTarget === 'ISS' && !isFlightMode
                ? 'bg-blue-500/30 text-blue-300 border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                : 'text-blue-400/90 hover:text-blue-200 border-blue-500/30 hover:bg-blue-950/30'
            }`}
          >
            <span>🛸</span>
            <span>ISS</span>
          </button>

          <button
            onClick={() => onSelectTarget('APOLLO')}
            className={`px-3 py-2 rounded-none flex items-center space-x-1.5 flex-shrink-0 font-bold border transition-all ${
              selectedTarget === 'APOLLO' && !isFlightMode
                ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400'
                : 'text-emerald-400/90 hover:text-emerald-200 border-emerald-500/30 hover:bg-emerald-950/30'
            }`}
          >
            <span>🌙</span>
            <span>Apolo 11</span>
          </button>

          <button
            onClick={() => onSelectTarget('INGENUITY')}
            className={`px-3 py-2 rounded-none flex items-center space-x-1.5 flex-shrink-0 font-bold border transition-all ${
              selectedTarget === 'INGENUITY' && !isFlightMode
                ? 'bg-red-500/30 text-red-300 border-red-400'
                : 'text-red-400/90 hover:text-red-200 border-red-500/30 hover:bg-red-950/30'
            }`}
          >
            <span>🚁</span>
            <span>Ingenuity</span>
          </button>

        </div>

        {/* Audio & Telemetry Drawer Controls */}
        <div className="flex items-center space-x-2 bg-black/95 backdrop-blur-md p-2 border border-cyan-500/40 rounded-none shadow-[0_0_15px_rgba(0,0,0,0.8)] flex-shrink-0">
          
          <button
            onClick={onToggleAudio}
            className={`p-2.5 rounded-none text-xs sm:text-sm border transition-all flex items-center space-x-1.5 ${
              isPlayingAudio
                ? 'bg-rose-500/30 text-rose-300 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                : 'bg-space-900 text-cyan-300 border-slate-700 hover:border-cyan-400'
            }`}
            title="Audio histórico de la NASA"
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="font-bold">{isPlayingAudio ? 'Silenciar' : 'Audio NASA'}</span>
          </button>

          <button
            onClick={() => setIsTelemetryOpen(!isTelemetryOpen)}
            className={`p-2.5 rounded-none text-xs sm:text-sm border transition-all flex items-center space-x-1.5 ${
              isTelemetryOpen
                ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                : 'border-slate-700 bg-space-900 text-slate-300 hover:text-white hover:border-cyan-400'
            }`}
            title="Ficha y Curiosidades"
          >
            <Info className="w-4 h-4 text-amber-400" />
            <span className="font-bold">{isTelemetryOpen ? 'Ocultar' : 'Curiosidades'}</span>
          </button>

        </div>

      </div>

      {/* 4. RIGHT SIDE: Collapsible Data & Curiosities Drawer (Sharp rounded-none, larger font) */}
      {isTelemetryOpen && (
        <div className="absolute right-2 sm:right-4 top-16 bottom-24 w-80 sm:w-[420px] bg-black/95 backdrop-blur-xl border border-cyan-500/40 rounded-none p-4 sm:p-5 overflow-y-auto pointer-events-auto shadow-[0_0_35px_rgba(0,0,0,0.95)] animate-slide-left text-xs sm:text-sm">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
            <div>
              <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                {activeType}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5 tracking-wide">
                {activeTitle}
              </h2>
            </div>
            
            <button
              onClick={() => setIsTelemetryOpen(false)}
              className="text-slate-400 hover:text-white p-1 text-base font-bold"
            >
              ✕
            </button>
          </div>

          {/* Special Probe Details */}
          {currentProbe && (
            <div className="mb-4">
              <span className="text-xs uppercase font-bold text-amber-400 block mb-1.5 flex items-center space-x-1">
                <Terminal className="w-4 h-4" />
                <span>Estado de Telemetría Espacial</span>
              </span>
              <div className="space-y-2 text-xs sm:text-sm bg-space-950/90 p-3 border border-slate-700 rounded-none">
                <div className="flex justify-between"><span className="text-slate-400">Lanzamiento:</span><span className="font-bold text-slate-200">{currentProbe.launchYear}</span></div>
                {currentProbe.distanceAU && <div className="flex justify-between"><span className="text-slate-400">Distancia Actual:</span><span className="font-bold text-cyan-300">{currentProbe.distanceAU}</span></div>}
                <div className="flex justify-between"><span className="text-slate-400">Velocidad:</span><span className="font-bold text-amber-300">{currentProbe.speedKmH}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Estado:</span><span className="font-bold text-emerald-400">{currentProbe.status}</span></div>
              </div>
            </div>
          )}

          {/* Curiosidades y Secretos Científicos (Ages 10-16) */}
          <div className="mb-4">
            <span className="text-xs uppercase font-bold text-cyan-400 block mb-2 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Curiosidades Científicas Destacadas</span>
            </span>
            <div className="space-y-2.5">
              {(currentProbe?.funFacts || currentBody?.funFacts || []).map((fact, idx) => (
                <div key={idx} className="bg-space-950/90 p-3 border border-slate-800 rounded-none hover:border-cyan-500/40 transition-all">
                  <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                    ✨ {fact}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* NASA Mission Link */}
          <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
            <span className="text-slate-400">NASA Science Open Data</span>
            <a
              href="https://science.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-200 underline flex items-center space-x-1 font-bold"
            >
              <span>Portal Oficial NASA</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      )}

    </div>
  );
}
