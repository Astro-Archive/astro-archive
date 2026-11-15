import React, { useState } from 'react';
import { 
  Compass, Radio, Volume2, VolumeX, Award, ExternalLink, Activity, 
  Sparkles, Layers, Maximize2, ShieldCheck, Terminal, Eye, Info,
  Navigation, Plane, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, Target, Settings, ChevronUp, ChevronDown, Map
} from 'lucide-react';
import { SOLAR_BODIES, SPECIAL_PROBES } from '../data/solarSystemData';
import CuriosityPanel from './CuriosityPanel';
import SciFiButton from './ui/SciFiButton';
import SciFiTag from './ui/SciFiTag';
import SciFiLoader from './ui/SciFiLoader';

export default function SpaceXHUD({
  selectedTarget,
  onSelectTarget,
  isFlightMode,
  onToggleFlightMode,
  flightVelocity,
  flightTelemetry,
  artifacts,
  onOpenBadges,
  scannedCount,
  isPlayingAudio,
  onToggleAudio,
  onOpenSurface,
  onOpenHubble,
  settings,
  onUpdateSettings
}) {
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDestinoMenuOpen, setIsDestinoMenuOpen] = useState(false);

  // Helper for cardinal compass heading
  const getCardinal = (deg) => {
    const val = ((deg % 360) + 360) % 360;
    if (val >= 337.5 || val < 22.5) return 'NORTE (N)';
    if (val >= 22.5 && val < 67.5) return 'NORESTE (NE)';
    if (val >= 67.5 && val < 112.5) return 'ESTE (E)';
    if (val >= 112.5 && val < 157.5) return 'SURESTE (SE)';
    if (val >= 157.5 && val < 202.5) return 'SUR (S)';
    if (val >= 202.5 && val < 247.5) return 'SUROESTE (SW)';
    if (val >= 247.5 && val < 292.5) return 'OESTE (W)';
    return 'NOROESTE (NW)';
  };

  const currentHeading = flightTelemetry?.heading ?? 180;
  const currentPitch = flightTelemetry?.pitch ?? 0;

  // Look up target
  const currentBody = SOLAR_BODIES.find(b => b.id.toUpperCase() === selectedTarget.toUpperCase());
  const currentProbe = SPECIAL_PROBES.find(p => p.id.toUpperCase() === selectedTarget.toUpperCase());
  const artifactTargetIds = {
    APOLLO: 'apollo11',
    APOLLO11: 'apollo11',
    INGENUITY: 'ingenuity',
    OPPORTUNITY: 'opportunity',
    VIKING: 'viking',
    PERSEVERANCE: 'perseverance',
    HUBBLE: 'hubble',
    JWST: 'jwst',
  };
  const currentArtifact = artifacts.find(a => a.id === artifactTargetIds[selectedTarget]);

  const activeTitle = currentProbe ? currentProbe.name : currentBody ? currentBody.name : currentArtifact ? currentArtifact.name : selectedTarget;
  const activeType = currentProbe ? currentProbe.type : currentBody ? currentBody.type : 'Objeto Espacial';

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-2 sm:p-4 select-none font-mono">
      
      {/* 1. TOP BAR: Sharp Sci-Fi Header */}
      <div className="relative z-40 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        
        {/* Brand & Tracking Status (Renamed from SIMULADOR ESPACIAL to ASTRO ARCHIVE) */}
        <div className="flex items-center gap-3 bg-black/90 backdrop-blur-md border border-cyan-500/50 px-4 py-2 rounded-none shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <div className="w-2.5 h-2.5 rounded-none bg-cyan-400 animate-ping"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base tracking-widest text-cyan-300">ASTRO ARCHIVE</span>
              <SciFiTag
                type={isFlightMode ? 'success' : 'information'}
                shape="cut-edge"
                showArrow={false}
              >
                {isFlightMode ? 'Piloto nave' : 'Orbital lock'}
              </SciFiTag>
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">
              OBJETIVO: <span className="text-cyan-300 font-bold">{activeTitle.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Center Mode Controls */}
        <div className="flex items-center gap-2 bg-black/90 backdrop-blur-md p-1 border border-slate-700 rounded-none">

          <SciFiButton
            variant={isFlightMode ? 'secondary' : 'primary'}
            onClick={() => onSelectTarget('OVERVIEW')}
            showArrow={false}
            className="hidden sm:inline-flex"
          >
            Sistema
          </SciFiButton>

          {/* SPACESHIP FLIGHT MODE TOGGLE */}
          <SciFiButton
            variant={isFlightMode ? 'primary' : 'secondary'}
            onClick={onToggleFlightMode}
            showArrow={false}
          >
            {isFlightMode ? 'Pilotando' : 'Pilotar nave'}
          </SciFiButton>

        </div>

        {/* Cadet Log / Badges Button */}
        <SciFiButton onClick={onOpenBadges} showArrow={false}>
          <span className="hidden sm:inline">Bitácora&nbsp;</span>{scannedCount}/{artifacts.length}
        </SciFiButton>

      </div>

      {/* 2. CENTER: SPACE ENGINE FLIGHT HUD (When Flight Mode Active - Clean Separation, NO Overlaps!) */}
      {isFlightMode ? (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between pt-28 sm:pt-20 pb-16 px-3 sm:px-6">
          
          {/* Top Compass Heading Tape (Space Engine Style - Dynamic & Functional) */}
          <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 bg-black/90 border border-emerald-500/50 px-4 py-1.5 text-xs text-emerald-300 flex items-center space-x-3 sm:space-x-5 backdrop-blur-md font-mono hidden md:flex shadow-[0_0_20px_rgba(0,0,0,0.9)]">
            <span className="text-[10px] text-slate-400 font-bold border-r border-emerald-500/40 pr-3">
              🧭 RUMBO: <span className="text-emerald-400">{getCardinal(currentHeading)}</span>
            </span>
            <span className="text-slate-500">{((currentHeading - 30 + 360) % 360)}°</span>
            <span className="text-slate-400">{((currentHeading - 20 + 360) % 360)}°</span>
            <span className="text-slate-300">{((currentHeading - 10 + 360) % 360)}°</span>
            <span className="text-emerald-400 font-black border-b-2 border-emerald-400 px-1.5 bg-emerald-950/50">
              {currentHeading}° ▲
            </span>
            <span className="text-slate-300">{((currentHeading + 10) % 360)}°</span>
            <span className="text-slate-400">{((currentHeading + 20) % 360)}°</span>
            <span className="text-slate-500">{((currentHeading + 30) % 360)}°</span>
            <span className="text-amber-400 font-bold ml-2 border-l border-emerald-500/40 pl-3">
              PITCH: {currentPitch > 0 ? `+${currentPitch}°` : `${currentPitch}°`}
            </span>
          </div>

          {/* Side Telemetry Panels: Left Functional Coordinates + Right Navigation */}
          <div className="flex justify-between items-start mt-4 sm:mt-6">
            
            {/* Left Telemetry Column: Real Coordinates & Distance */}
            <div className="bg-black/90 backdrop-blur-md p-3 border border-emerald-500/50 rounded-none w-64 sm:w-72 space-y-1.5 text-[11px] sm:text-xs text-emerald-400 shadow-[0_0_25px_rgba(0,0,0,0.9)]">
              <div className="text-[10px] uppercase font-bold text-emerald-300 border-b border-emerald-500/30 pb-1 flex items-center justify-between">
                <span>🛸 NAVEGACIÓN Y COORDENADAS</span>
                <span className="text-amber-400">ENLACE ACTIVO</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Coordenada X:</span>
                <span className="text-white font-bold font-mono">{flightTelemetry?.x || '0.0'} Mkm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Coordenada Y (Cota):</span>
                <span className="text-white font-bold font-mono">{flightTelemetry?.y || '0.0'} Mkm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Coordenada Z:</span>
                <span className="text-white font-bold font-mono">{flightTelemetry?.z || '0.0'} Mkm</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1">
                <span className="text-slate-400">Astro de referencia:</span>
                <span className="text-cyan-300 font-bold truncate max-w-[130px]">{flightTelemetry?.nearestName || activeTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Distancia a referencia:</span>
                <span className="text-amber-300 font-bold font-mono">{flightTelemetry?.nearestDist || '12.4'} Mkm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Velocidad impulso:</span>
                <span className="text-emerald-300 font-bold font-mono">{flightTelemetry?.speed || flightVelocity || '0.0'} km/s</span>
              </div>
            </div>

            {/* Right Orbital & Flight Status Column */}
            <div className="bg-black/90 backdrop-blur-md p-3 border border-emerald-500/50 rounded-none w-56 sm:w-64 space-y-1.5 text-[11px] sm:text-xs text-emerald-400 text-right shadow-[0_0_20px_rgba(0,0,0,0.8)] hidden sm:block">
              <div className="text-[10px] uppercase font-bold text-emerald-300 border-b border-emerald-500/30 pb-1 flex items-center justify-between">
                <span className="text-cyan-300">ESTADO DE VUELO</span>
                <span>GIROSCÓPICO 🌐</span>
              </div>
              <div className="flex justify-between"><span className="text-slate-400">Rumbo (Yaw):</span><span className="text-white font-bold font-mono">{currentHeading}°</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Cabeceo (Pitch):</span><span className="text-amber-300 font-bold font-mono">{currentPitch}°</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Propulsión:</span><span className="text-emerald-300 font-bold">{parseFloat(flightTelemetry?.speed || flightVelocity || '0') > 0 ? 'IMPULSO ACTIVO' : 'DERIVA INERCIAL'}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Sensores RCS:</span><span className="text-cyan-300 font-bold">ARMADOS (4x)</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Modo de vuelo:</span><span className="text-emerald-400 font-bold">Libre 360°</span></div>
            </div>

          </div>

          {/* Center: Dynamic Pitch Ladder & Reticle (Artificial Horizon) */}
          <div className="flex-1 flex items-center justify-center relative my-2">
            
            {/* Left & Right Pitch Degree Ladder (Translates with flight pitch!) */}
            <div 
              className="absolute flex items-center space-x-16 sm:space-x-32 text-emerald-400 text-xs font-mono select-none transition-transform duration-75"
              style={{ transform: `translateY(${currentPitch * 2.2}px)` }}
            >
              <div className="space-y-3.5 text-right">
                <div className="opacity-70 text-[10px]">▲ +15° CABECEO</div>
                <div className="opacity-90">-- +10°L</div>
                <div className="text-emerald-300 font-black border-y border-emerald-400/60 py-0.5">── 0° HORIZONTE</div>
                <div className="opacity-90">-- -10°L</div>
                <div className="opacity-70 text-[10px]">▼ -15° CABECEO</div>
              </div>

              {/* Center Flight Reticle */}
              <div className="w-16 h-16 border-2 border-emerald-400 rounded-none flex items-center justify-center relative shadow-[0_0_20px_rgba(16,185,129,0.4)] bg-black/40">
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-none"></div>
                <div className="absolute -top-7 text-[10px] text-emerald-300 font-bold bg-black/90 px-1.5 py-0.5 border border-emerald-500/60">
                  {flightTelemetry?.speed || flightVelocity || '0.0'} km/s
                </div>
                <div className="absolute -bottom-6 text-[9px] text-cyan-300 font-mono bg-black/80 px-1">
                  HDG: {currentHeading}°
                </div>
              </div>

              <div className="space-y-3.5 text-left">
                <div className="opacity-70 text-[10px]">CABECEO +15° ▲</div>
                <div className="opacity-90">+10°R --</div>
                <div className="text-emerald-300 font-black border-y border-emerald-400/60 py-0.5">HORIZONTE 0° ──</div>
                <div className="opacity-90">-10°R --</div>
                <div className="opacity-70 text-[10px]">CABECEO -15° ▼</div>
              </div>
            </div>

            {/* Simulated Spaceship Cockpit Silhouette at Bottom Center */}
            <div className="absolute bottom-1 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[28px] border-b-emerald-400/90 shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[9px] text-emerald-400 font-mono tracking-widest mt-1">VECTOR PROA // RCS</span>
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
          <SciFiButton
            variant="secondary"
            onClick={() => setIsDestinoMenuOpen(!isDestinoMenuOpen)}
            showArrow={false}
            icon={isDestinoMenuOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          >
            Destino: {activeTitle}
          </SciFiButton>

          {/* ELEVATED CUSTOM DROPDOWN MENU */}
          {isDestinoMenuOpen && (
            <div className="absolute bottom-12 left-0 w-80 sm:w-96 max-h-[72vh] overflow-y-auto bg-black/95 backdrop-blur-xl border border-cyan-500/70 p-3 shadow-2xl z-50 pointer-events-auto space-y-3">
              
              {/* Menu Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/40 pb-2">
                <span className="font-bold uppercase tracking-wider text-cyan-300 text-xs flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Navegación del Sistema</span>
                </span>
                <div className="flex items-center gap-2">
                  <SciFiTag type="information" shape="cut-edge" showArrow={false}>
                    {activeTitle}
                  </SciFiTag>
                  <button
                    onClick={() => setIsDestinoMenuOpen(false)}
                    className="text-slate-400 hover:text-white px-1 font-bold text-xs"
                    aria-label="Cerrar menú"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Vista General — acción principal */}
              <SciFiButton
                onClick={() => { onSelectTarget('OVERVIEW'); setIsDestinoMenuOpen(false); }}
              >
                Sistema completo
              </SciFiButton>

              {/* 1. Astros del Sistema Solar — variante transparent / secondary */}
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
                  <span>🪐 Astros &amp; Cuerpos Celestes</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {SOLAR_BODIES.map((body) => {
                    const isSelected = selectedTarget.toUpperCase() === body.id.toUpperCase();
                    return (
                      <SciFiButton
                        key={body.id}
                        variant={isSelected ? 'secondary' : 'transparent'}
                        showArrow={false}
                        className="w-full"
                        onClick={() => { onSelectTarget(body.id.toUpperCase()); setIsDestinoMenuOpen(false); }}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="inline-block h-2 w-2 flex-none"
                            style={{ backgroundColor: body.color }}
                          />
                          {body.shortName || body.name}
                        </span>
                      </SciFiButton>
                    );
                  })}
                </div>
              </div>

              {/* 2. Sondas, telescopios y estación — variante single-stroke */}
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider mb-1.5 flex items-center gap-1">
                  <span>🛰️ Sondas, Telescopios y Estación</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'HUBBLE', label: 'Hubble' },
                    { id: 'JWST', label: 'James Webb' },
                    { id: 'ISS', label: 'ISS (LEO)' },
                    { id: 'HALLEY', label: 'C. Halley' },
                    { id: 'VOYAGER1', label: 'Voyager 1' },
                    { id: 'VOYAGER2', label: 'Voyager 2' },
                  ].map((probe) => {
                    const isSelected = selectedTarget.toUpperCase() === probe.id;
                    return (
                      <SciFiButton
                        key={probe.id}
                        variant={isSelected ? 'secondary' : 'single-stroke'}
                        showArrow={false}
                        className="w-full"
                        onClick={() => { onSelectTarget(probe.id); setIsDestinoMenuOpen(false); }}
                      >
                        {probe.label}
                      </SciFiButton>
                    );
                  })}
                </div>
              </div>

              {/* 3. Reliquias históricas — variante transparent con la superficie */}
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-1.5 flex items-center gap-1">
                  <span>🚀 Reliquias Históricas en Superficie</span>
                </div>
                <div className="space-y-1.5">
                  {artifacts.map((artifact) => {
                    const isSelected = selectedTarget === artifact.id.toUpperCase();
                    return (
                      <SciFiButton
                        key={artifact.id}
                        variant={isSelected ? 'secondary' : 'transparent'}
                        showArrow={false}
                        className="w-full"
                        onClick={() => { onSelectTarget(artifact.id.toUpperCase()); setIsDestinoMenuOpen(false); }}
                      >
                        <span className="flex w-full items-center justify-between gap-2">
                          <span className="truncate">{artifact.name.split(' (')[0]}</span>
                          <span className="flex-none text-[10px] uppercase tracking-wider opacity-60">
                            {artifact.body}
                          </span>
                        </span>
                      </SciFiButton>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Audio, Telemetry & Settings Controls (Right Side) */}
        <div className="flex flex-wrap items-center justify-end gap-2 bg-black/95 backdrop-blur-md p-1.5 border border-cyan-500/40 rounded-none shadow-[0_0_15px_rgba(0,0,0,0.8)] max-w-[calc(100vw-1rem)]">
          
          <SciFiButton
            variant={isPlayingAudio ? 'primary' : 'secondary'}
            onClick={onToggleAudio}
            showArrow={false}
            icon={isPlayingAudio ? <SciFiLoader size="sm" /> : <Volume2 className="w-4 h-4" />}
            title="Audio histórico de la NASA"
          >
            {isPlayingAudio ? 'Silenciar' : 'Audio NASA'}
          </SciFiButton>

          {currentArtifact && ['Moon', 'Mars'].includes(currentArtifact.body) && (
            <SciFiButton
              onClick={onOpenSurface}
              showArrow={false}
              title="Explorar Superficie 3D con Rover o Dron"
            >
              Explorar superficie
            </SciFiButton>
          )}

          {(['HUBBLE', 'JWST'].includes(selectedTarget.toUpperCase()) || ['hubble', 'jwst'].includes(currentArtifact?.id) || ['hubble', 'jwst'].includes(currentProbe?.id)) && (
            <SciFiButton
              onClick={() => onOpenHubble(selectedTarget.toUpperCase() === 'JWST' || currentArtifact?.id === 'jwst' || currentProbe?.id === 'jwst' ? 'jwst' : 'hubble')}
              showArrow={false}
              icon={<Eye className="w-4 h-4" />}
              title="Operar Telescopio Espacial y apuntar a astros de espacio profundo"
            >
              {selectedTarget.toUpperCase() === 'JWST' || currentArtifact?.id === 'jwst' || currentProbe?.id === 'jwst' ? 'Operar James Webb' : 'Operar Hubble'}
            </SciFiButton>
          )}


          <SciFiButton
            variant={isTelemetryOpen ? 'secondary' : 'transparent'}
            onClick={() => setIsTelemetryOpen(!isTelemetryOpen)}
            showArrow={false}
            title="Ficha y Curiosidades"
          >
            {isTelemetryOpen ? 'Ocultar' : 'Curiosidades'}
          </SciFiButton>

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
          onOpenHubble={onOpenHubble}
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

            <label className="flex items-center justify-between gap-3 text-slate-200 cursor-pointer">
              <span>Sonidos de interfaz (hover y click)</span>
              <input
                type="checkbox"
                checked={settings.uiSound !== false}
                onChange={(event) => onUpdateSettings({ uiSound: event.target.checked })}
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
