import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Crosshair, Camera, Compass, Award, X, Sparkles, CheckCircle2, 
  ChevronRight, RotateCcw, Eye, Info, Volume2, VolumeX, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Layers
} from 'lucide-react';
import { getAssetPath } from '../utils/assets';

const OBSERVATION_TARGETS = [
  {
    id: 'pillars',
    name: 'Pilares de la Creación (M16)',
    objectType: 'Nebulosa de Emisión / Guardería Estelar',
    constellation: 'Serpens (Serpiente)',
    distance: '6,500 años luz',
    coordinates: { ra: '18h 18m 48s', dec: '-13° 49′ 00″' },
    targetOffset: { x: -35, y: -25 }, // Relative positioning in telescope arc
    image: '/textures/hubble/pillars.jpg',
    filter: 'F656N (H-Alpha) + F502N ([O III])',
    summary: 'Colosales chimeneas de gas hidrógeno molecular y polvo cósmico esculpidas por la intensa radiación ultravioleta de estrellas masivas recién nacidas.',
    discoveryText: 'Hubble demostró que dentro de estos densos "glóbulos gaseosos en evaporación" (EGGs) están naciendo sistemas estelares enteros con planetas embrionarios.',
    year: '1995 & 2014'
  },
  {
    id: 'deep_field',
    name: 'Campo Ultra Profundo (HUDF)',
    objectType: 'Cosmología Profunda / Galaxias Primitivas',
    constellation: 'Fornax (El Horno)',
    distance: 'Hasta 13,000 millones de años luz',
    coordinates: { ra: '03h 32m 39s', dec: '-27° 47′ 29″' },
    targetOffset: { x: 42, y: 32 },
    image: '/textures/hubble/deep_field.jpg',
    filter: 'ACS/WFC + WFC3/IR (Multi-banda)',
    summary: 'Mirando hacia un diminuto parche del cielo que parecía completamente negro y desierto, Hubble acumuló fotones durante 11 días seguidos.',
    discoveryText: 'Reveló casi 10,000 galaxias en todas las etapas de evolución, muchas de ellas existiendo cuando el universo tenía apenas unos cientos de millones de años.',
    year: '2004 – 2014'
  },
  {
    id: 'catseye',
    name: 'Nebulosa del Ojo de Gato (NGC 6543)',
    objectType: 'Nebulosa Planetaria Compleja',
    constellation: 'Draco (El Dragón)',
    distance: '3,300 años luz',
    coordinates: { ra: '17h 58m 33s', dec: '+66° 37′ 59″' },
    targetOffset: { x: -48, y: 35 },
    image: '/textures/hubble/catseye.jpg',
    filter: 'WFC3 UVIS Narrowband',
    summary: 'El sudario brillante y concéntrico expulsado por una estrella agonizante similar a nuestro Sol en sus etapas finales de vida.',
    discoveryText: 'Mostró una intrincada serie de burbujas, chorros y anillos concéntricos expulsados cada 1,500 años, revelando por primera vez la muerte caótica de estrellas solares.',
    year: '1994 – 2004'
  },
  {
    id: 'sombrero',
    name: 'Galaxia del Sombrero (M104)',
    objectType: 'Galaxia Espiral No Barrada',
    constellation: 'Virgo (La Virgen)',
    distance: '29.3 millones de años luz',
    coordinates: { ra: '12h 39m 59s', dec: '-11° 37′ 23″' },
    targetOffset: { x: 50, y: -30 },
    image: '/textures/hubble/sombrero.jpg',
    filter: 'ACS/WFC Visible Spectrum',
    summary: 'Famosa por su brillante bulbo central blanco y una densa y simétrica banda de polvo interestelar que la hace parecer un sombrero mexicano.',
    discoveryText: 'La espectroscopía de alta resolución del Hubble demostró que en su corazón reside un monstruoso agujero negro supermasivo de 1,000 millones de masas solares.',
    year: '2003'
  },
  {
    id: 'orion',
    name: 'Gran Nebulosa de Orión (M42)',
    objectType: 'Región H II / Guardería Protoplanetaria',
    constellation: 'Orión (El Cazador)',
    distance: '1,344 años luz',
    coordinates: { ra: '05h 35m 17s', dec: '-05° 23′ 28″' },
    targetOffset: { x: -20, y: 45 },
    image: '/textures/hubble/orion.jpg',
    filter: 'ACS + WFPC2 Mosaico 18,000 px',
    summary: 'La fábrica de estrellas masivas más cercana a la Tierra, visible incluso a simple vista en la espada de Orión.',
    discoveryText: 'Hubble fotografió por primera vez discos protoplanetarios ("proplyds"): discos de polvo y gas girando alrededor de estrellas recién nacidas donde nacen nuevos planetas.',
    year: '2006'
  },
  {
    id: 'antennae',
    name: 'Galaxias de las Antenas (NGC 4038/4039)',
    objectType: 'Colisión Galáctica en Curso',
    constellation: 'Corvus (El Cuervo)',
    distance: '62 millones de años luz',
    coordinates: { ra: '12h 01m 53s', dec: '-18° 52′ 10″' },
    targetOffset: { x: 30, y: -45 },
    image: '/textures/hubble/antennae.jpg',
    filter: 'WFC3 Multi-wavelength',
    summary: 'Dos majestuosas galaxias espirales chocando de frente, arrancándose gigantescas colas de estrellas y gas por atracción gravitacional.',
    discoveryText: 'Hubble descubrió miles de supercúmulos estelares jóvenes naciendo en las zonas de compresión de gas, un presagio de la futura colisión entre la Vía Láctea y Andrómeda.',
    year: '1997 & 2010'
  }
];

export default function HubbleObservatory({ onClose, onUnlockDiscovery }) {
  const [selectedTargetId, setSelectedTargetId] = useState('pillars');
  const [discoveredIds, setDiscoveredIds] = useState(['pillars']);
  const [telescopePos, setTelescopePos] = useState({ x: 0, y: 0 });
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [revealedTarget, setRevealedTarget] = useState(null);
  const [activeTab, setActiveTab] = useState('viewport'); // 'viewport' | 'targets'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Audio Context ref for synthesized SFX (servos, lock ping, camera shutter)
  const audioCtxRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialX: 0, initialY: 0 });

  const activeTarget = useMemo(
    () => OBSERVATION_TARGETS.find(t => t.id === selectedTargetId) || OBSERVATION_TARGETS[0],
    [selectedTargetId]
  );

  // Calculate distance between telescope reticle and target coordinates
  const distanceToTarget = useMemo(() => {
    const dx = telescopePos.x - activeTarget.targetOffset.x;
    const dy = telescopePos.y - activeTarget.targetOffset.y;
    return Math.hypot(dx, dy);
  }, [telescopePos, activeTarget]);

  // Alignment percentage: 100% when right on target, 0% when far
  const alignmentPercent = useMemo(() => {
    const maxDist = 75;
    const score = Math.max(0, Math.min(100, Math.round(100 - (distanceToTarget / maxDist) * 100)));
    return score;
  }, [distanceToTarget]);

  const isLockAcquired = alignmentPercent >= 93;

  // Web Audio Synth for authentic Space Telescope telemetry sounds
  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      if (type === 'gyro') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140 + Math.random() * 20, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'lock') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(1760, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'shutter') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch {
      // Audio autoplay gracefully handled
    }
  };

  // Sound cue on lock acquisition
  const wasLockedRef = useRef(false);
  useEffect(() => {
    if (isLockAcquired && !wasLockedRef.current) {
      playSound('lock');
    }
    wasLockedRef.current = isLockAcquired;
  }, [isLockAcquired]);

  // Keyboard navigation for telescope pointing (W/A/S/D or Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (revealedTarget || isCapturing) return;
      const step = e.shiftKey ? 4 : 1.5;
      let moved = false;

      setTelescopePos(prev => {
        let newX = prev.x;
        let newY = prev.y;

        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          newY = Math.max(-65, prev.y - step);
          moved = true;
        }
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          newY = Math.min(65, prev.y + step);
          moved = true;
        }
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          newX = Math.max(-65, prev.x - step);
          moved = true;
        }
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          newX = Math.min(65, prev.x + step);
          moved = true;
        }

        return { x: newX, y: newY };
      });

      if (moved) playSound('gyro');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [revealedTarget, isCapturing]);

  // Touch and Mouse Drag to Pan Telescope Reticle
  const handlePointerDown = (e) => {
    if (revealedTarget || isCapturing) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialX: telescopePos.x,
      initialY: telescopePos.y
    };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || revealedTarget || isCapturing) return;
    const dx = (e.clientX - dragStartRef.current.x) * 0.18;
    const dy = (e.clientY - dragStartRef.current.y) * 0.18;

    const newX = Math.max(-65, Math.min(65, dragStartRef.current.initialX - dx));
    const newY = Math.max(-65, Math.min(65, dragStartRef.current.initialY - dy));

    setTelescopePos({ x: newX, y: newY });
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Direct Slew with D-Pad
  const slewTelescope = (dx, dy) => {
    playSound('gyro');
    setTelescopePos(prev => ({
      x: Math.max(-65, Math.min(65, prev.x + dx)),
      y: Math.max(-65, Math.min(65, prev.y + dy))
    }));
  };

  // Auto-calibrar / Slew to current target
  const handleAutoAlign = () => {
    playSound('gyro');
    setTelescopePos({
      x: activeTarget.targetOffset.x,
      y: activeTarget.targetOffset.y
    });
  };

  // Trigger scientific exposure
  const handleCaptureExposure = () => {
    if (!isLockAcquired || isCapturing) return;
    setIsCapturing(true);
    setCaptureProgress(0);
    playSound('shutter');

    let current = 0;
    const interval = setInterval(() => {
      current += 8;
      setCaptureProgress(Math.min(100, current));

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsCapturing(false);
          setRevealedTarget(activeTarget);
          if (!discoveredIds.includes(activeTarget.id)) {
            const next = [...discoveredIds, activeTarget.id];
            setDiscoveredIds(next);
            if (onUnlockDiscovery) onUnlockDiscovery(activeTarget.id);
          }
        }, 350);
      }
    }, 90);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 font-mono text-cyan-300 select-none overflow-hidden">
      
      {/* 1. TOP SCIENTIFIC HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/40 bg-black/90 px-3 py-2.5 sm:px-6 backdrop-blur-md">
        
        {/* Observatory Title */}
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-none border border-cyan-400 bg-cyan-950/80 shadow-[0_0_12px_rgba(0,240,255,0.4)]">
            <Crosshair className="h-4 w-4 text-cyan-300 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-cyan-200">HUBBLE SPACE TELESCOPE</span>
              <span className="hidden sm:inline-block border border-emerald-500/60 bg-emerald-950/80 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300">
                FGS LOCK: NOMINAL
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              STScI SOC // ÓRBITA LEO (535 KM) // SENSOR WFC3/ACS
            </div>
          </div>
        </div>

        {/* Discovery Counter & Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* Badge discovery tally */}
          <div className="flex items-center space-x-1.5 border border-amber-500/50 bg-amber-950/30 px-2.5 py-1 text-xs">
            <Award className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-slate-300 hidden sm:inline">Descubrimientos:</span>
            <span className="font-bold text-amber-300">{discoveredIds.length}/{OBSERVATION_TARGETS.length}</span>
          </div>

          {/* Sound Toggle */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className="border border-slate-700 bg-black/60 p-1.5 hover:border-cyan-400 text-slate-300 hover:text-white"
            title="Activar / Desactivar Sonido"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-cyan-400" /> : <VolumeX className="h-4 w-4 text-slate-500" />}
          </button>

          {/* Close Observatory */}
          <button
            onClick={onClose}
            className="flex items-center space-x-1 border border-rose-500/60 bg-rose-950/40 px-3 py-1.5 text-xs font-bold text-rose-300 transition-all hover:bg-rose-900/60 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Cerrar Visor</span>
          </button>

        </div>

      </header>

      {/* 2. MOBILE TAB SELECTOR (Telescope Viewport vs Target Catalog) */}
      <div className="flex md:hidden border-b border-cyan-500/30 bg-black/70 text-xs">
        <button
          onClick={() => setActiveTab('viewport')}
          className={`flex-1 py-2 font-bold text-center border-b-2 transition-all ${
            activeTab === 'viewport' 
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40' 
              : 'border-transparent text-slate-400'
          }`}
        >
          🔭 Visor del Telescopio
        </button>
        <button
          onClick={() => setActiveTab('targets')}
          className={`flex-1 py-2 font-bold text-center border-b-2 transition-all ${
            activeTab === 'targets' 
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40' 
              : 'border-transparent text-slate-400'
          }`}
        >
          🎯 Catálogo de Misión ({discoveredIds.length}/{OBSERVATION_TARGETS.length})
        </button>
      </div>

      {/* 3. MAIN WORKSPACE */}
      <div className="relative flex flex-1 flex-col md:flex-row overflow-hidden">
        
        {/* LEFT / MAIN: TELESCOPE RETICLE & SKY VIEWPORT */}
        <div 
          className={`relative flex-1 flex flex-col items-center justify-center bg-black overflow-hidden select-none cursor-crosshair ${
            activeTab === 'targets' ? 'hidden md:flex' : 'flex'
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Cosmic Starfield Background with Twinkle */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none">
            {/* Twinkling star field */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fde047_1.5px,transparent_1.5px)] [background-size:64px_64px]"></div>
          </div>

          {/* Faint Target Silhouette in Space (Relative to telescope offset) */}
          <div 
            className="absolute pointer-events-none transition-transform duration-75 ease-out"
            style={{
              transform: `translate(${(activeTarget.targetOffset.x - telescopePos.x) * 6}px, ${(activeTarget.targetOffset.y - telescopePos.y) * 6}px)`
            }}
          >
            <div className="relative flex items-center justify-center">
              {/* Outer detection pulse */}
              <div className={`w-32 h-32 rounded-full border border-dashed transition-all duration-300 ${
                isLockAcquired ? 'border-cyan-400 scale-105 animate-pulse' : 'border-cyan-500/30'
              }`}></div>
              
              {/* Target Image Preview Silhouette */}
              <div className="absolute w-24 h-24 rounded-full overflow-hidden border border-cyan-400/50 opacity-40 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                <img 
                  src={getAssetPath(activeTarget.image)} 
                  alt={activeTarget.name}
                  className="w-full h-full object-cover filter blur-[1px]"
                />
              </div>

              {/* Target Tag */}
              <div className="absolute -bottom-8 whitespace-nowrap bg-black/85 border border-cyan-500/50 px-2 py-0.5 text-[10px] text-cyan-300">
                [SEÑAL FGS]: {activeTarget.name.toUpperCase()}
              </div>
            </div>
          </div>

          {/* TELESCOPE RETICLE OVERLAY (HUD Optical Targeting Glass) */}
          <div className="relative w-[min(380px,85vw)] h-[min(380px,85vw)] rounded-full border-2 border-cyan-500/40 pointer-events-none flex items-center justify-center shadow-[0_0_40px_rgba(0,240,255,0.15)]">
            
            {/* Concentric Measurement Circles */}
            <div className="absolute inset-4 rounded-full border border-cyan-500/20 border-dashed"></div>
            <div className="absolute inset-16 rounded-full border border-cyan-500/30"></div>
            <div className="absolute inset-28 rounded-full border border-cyan-500/20"></div>

            {/* Crosshair Lines */}
            <div className="absolute w-full h-[1px] bg-cyan-500/40"></div>
            <div className="absolute h-full w-[1px] bg-cyan-500/40"></div>

            {/* Tick marks on axes */}
            <div className="absolute inset-0 flex items-center justify-between px-2 text-[9px] text-cyan-500/70 font-mono">
              <span>-60′</span>
              <span>-30′</span>
              <span>+30′</span>
              <span>+60′</span>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-between py-2 text-[9px] text-cyan-500/70 font-mono">
              <span>+60″</span>
              <span>+30″</span>
              <span>-30″</span>
              <span>-60″</span>
            </div>

            {/* Central Precision Guidance Box */}
            <div className={`w-14 h-14 border transition-all duration-200 flex items-center justify-center ${
              isLockAcquired 
                ? 'border-2 border-emerald-400 bg-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.8)] scale-110' 
                : 'border-cyan-400/60 bg-cyan-950/20'
            }`}>
              <div className={`w-2 h-2 ${isLockAcquired ? 'bg-emerald-300' : 'bg-cyan-400'} rounded-none`}></div>
            </div>

            {/* Live Reticle Status Readout */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/90 border border-cyan-500/40 px-3 py-0.5 text-[10px] tracking-widest font-bold">
              {isLockAcquired ? (
                <span className="text-emerald-400 animate-pulse font-black">● GUIDANCE LOCK CONFIRMADO</span>
              ) : (
                <span className="text-slate-400">BUSCANDO SEÑAL ESTELAR...</span>
              )}
            </div>

          </div>

          {/* TELEMETRY READOUTS (Floating HUD corners) */}
          <div className="absolute top-3 left-3 bg-black/80 border border-slate-700 p-2 text-[10px] text-slate-300 pointer-events-none space-y-1">
            <div className="text-cyan-400 font-bold border-b border-slate-800 pb-0.5">TELEMETRÍA DE APUNTADO</div>
            <div>RA: <span className="text-white font-mono">{activeTarget.coordinates.ra}</span></div>
            <div>DEC: <span className="text-white font-mono">{activeTarget.coordinates.dec}</span></div>
            <div>DERIVA GIRO: <span className="text-emerald-400 font-mono">0.007″/hr</span></div>
            <div>FILTRO ACTIVO: <span className="text-amber-300">{activeTarget.filter.split(' ')[0]}</span></div>
          </div>

          {/* ALIGNMENT METER (Top Right) */}
          <div className="absolute top-3 right-3 bg-black/85 border border-cyan-500/40 p-2.5 text-xs pointer-events-none w-44">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-slate-400">ALINEACIÓN FGS:</span>
              <span className={`font-bold ${isLockAcquired ? 'text-emerald-400' : 'text-cyan-300'}`}>
                {alignmentPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-900 border border-slate-700 h-2.5 overflow-hidden">
              <div 
                className={`h-full transition-all duration-150 ${
                  isLockAcquired 
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' 
                    : 'bg-cyan-500'
                }`}
                style={{ width: `${alignmentPercent}%` }}
              ></div>
            </div>
            <div className="text-[9px] text-slate-400 mt-1 flex justify-between">
              <span>Tolerancia: &lt;3%</span>
              <span className={isLockAcquired ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {isLockAcquired ? 'OBJETIVO EN MIRA' : 'FUERA DE EJE'}
              </span>
            </div>
          </div>

          {/* BOTTOM FLOATING CONTROLS: D-PAD & CAPTURE BUTTON */}
          <div className="absolute bottom-3 inset-x-3 flex flex-wrap items-end justify-between gap-3 pointer-events-auto">
            
            {/* On-screen touch D-Pad for mobile / touch steering */}
            <div className="bg-black/90 border border-cyan-500/40 p-2 shadow-2xl backdrop-blur-md flex flex-col items-center">
              <div className="text-[9px] text-slate-400 mb-1 font-bold">GIROSCOPIOS RCS</div>
              <div className="grid grid-cols-3 gap-1 w-28">
                <div></div>
                <button 
                  onClick={() => slewTelescope(0, -6)}
                  className="h-8 bg-slate-900 hover:bg-cyan-950 border border-cyan-500/50 flex items-center justify-center active:bg-cyan-600"
                  title="Giro Arriba"
                >
                  <ArrowUp className="h-4 w-4 text-cyan-300" />
                </button>
                <div></div>
                <button 
                  onClick={() => slewTelescope(-6, 0)}
                  className="h-8 bg-slate-900 hover:bg-cyan-950 border border-cyan-500/50 flex items-center justify-center active:bg-cyan-600"
                  title="Giro Izquierda"
                >
                  <ArrowLeft className="h-4 w-4 text-cyan-300" />
                </button>
                <button 
                  onClick={handleAutoAlign}
                  className="h-8 bg-cyan-950/80 hover:bg-cyan-800 border border-cyan-400 flex items-center justify-center font-bold text-[9px] text-cyan-200"
                  title="Auto-Centrar Señal"
                >
                  AUTO
                </button>
                <button 
                  onClick={() => slewTelescope(6, 0)}
                  className="h-8 bg-slate-900 hover:bg-cyan-950 border border-cyan-500/50 flex items-center justify-center active:bg-cyan-600"
                  title="Giro Derecha"
                >
                  <ArrowRight className="h-4 w-4 text-cyan-300" />
                </button>
                <div></div>
                <button 
                  onClick={() => slewTelescope(0, 6)}
                  className="h-8 bg-slate-900 hover:bg-cyan-950 border border-cyan-500/50 flex items-center justify-center active:bg-cyan-600"
                  title="Giro Abajo"
                >
                  <ArrowDown className="h-4 w-4 text-cyan-300" />
                </button>
                <div></div>
              </div>
            </div>

            {/* Instruction Tip */}
            <div className="hidden lg:block bg-black/80 border border-slate-700 px-3 py-1.5 text-[11px] text-slate-300 max-w-xs">
              💡 <span className="font-bold text-cyan-300">Consejo:</span> Usa las teclas <kbd className="border border-slate-600 px-1 bg-slate-800">W/A/S/D</kbd> o arrastra el ratón para alinear el centro con la señal estelar.
            </div>

            {/* PRIMARY ACTION: CAPTURE EXPOSURE */}
            <button
              onClick={handleCaptureExposure}
              disabled={!isLockAcquired || isCapturing}
              className={`px-5 py-3 border font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all shadow-xl ${
                isCapturing
                  ? 'border-amber-400 bg-amber-950/80 text-amber-300 animate-pulse'
                  : isLockAcquired
                  ? 'border-emerald-400 bg-emerald-600 hover:bg-emerald-500 text-black shadow-[0_0_25px_rgba(16,185,129,0.7)] animate-bounce'
                  : 'border-slate-800 bg-slate-950 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              <Camera className="h-4 w-4" />
              <span>
                {isCapturing 
                  ? `EXPOSICIÓN EN CURSO (${captureProgress}%)...` 
                  : isLockAcquired 
                  ? 'TOMAR FOTOGRAFÍA (WFC3 / ACS)' 
                  : 'ALINEA EL TELESCOPIO PARA CAPTURAR'}
              </span>
            </button>

          </div>

          {/* EXPOSURE IN-PROGRESS MODAL OVERLAY */}
          {isCapturing && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 z-40">
              <div className="w-80 max-w-full bg-slate-950 border border-cyan-400 p-6 text-center space-y-4 shadow-[0_0_35px_rgba(0,240,255,0.3)]">
                <div className="h-10 w-10 mx-auto rounded-none border-2 border-cyan-400 border-t-transparent animate-spin"></div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-white">RECOLECTANDO FOTONES DE ESPACIO PROFUNDO</h3>
                  <p className="text-[11px] text-slate-400">Sensor CCD refrigerado a -81°C // Filtro {activeTarget.filter}</p>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-900 border border-slate-700 h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-100"
                    style={{ width: `${captureProgress}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-cyan-300 font-mono">
                  PROCESANDO IMAGEN MATRIZ FIT // {captureProgress}% COMPLETADO
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT: TARGETS CATALOG & MISSION DOSSIER */}
        <div 
          className={`w-full md:w-96 md:border-l border-cyan-500/40 bg-black/95 flex flex-col justify-between overflow-y-auto ${
            activeTab === 'viewport' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Target Selection Header */}
          <div className="p-3 sm:p-4 border-b border-cyan-500/30">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">PLAN DE OBSERVACIÓN</span>
            <h2 className="text-sm sm:text-base font-bold text-white">OBJETIVOS CIENTÍFICOS DE HUBBLE</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Selecciona un astro para calibrar las coordenadas y apuntar el observatorio:
            </p>
          </div>

          {/* Targets List */}
          <div className="flex-1 p-3 space-y-2 overflow-y-auto">
            {OBSERVATION_TARGETS.map((target) => {
              const isSelected = selectedTargetId === target.id;
              const isDiscovered = discoveredIds.includes(target.id);

              return (
                <button
                  key={target.id}
                  onClick={() => {
                    setSelectedTargetId(target.id);
                    setActiveTab('viewport');
                  }}
                  className={`w-full text-left p-2.5 border transition-all flex items-center space-x-3 ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                      : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  {/* Thumbnail / Status */}
                  <div className="relative w-12 h-12 flex-shrink-0 border border-slate-700 overflow-hidden bg-black">
                    <img 
                      src={getAssetPath(target.image)} 
                      alt={target.name}
                      className={`w-full h-full object-cover ${isDiscovered ? '' : 'filter grayscale blur-[1px]'}`}
                    />
                    {isDiscovered && (
                      <div className="absolute top-0 right-0 bg-emerald-500 text-black p-0.5" title="Registrado en Bitácora">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white truncate">{target.name}</span>
                      <span className="text-[10px] text-amber-300 font-mono">{target.year}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{target.objectType}</p>
                    <div className="flex items-center space-x-2 text-[9px] text-cyan-400 mt-1">
                      <span>{target.distance}</span>
                      <span>•</span>
                      <span>{target.constellation}</span>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Quick Info Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 text-[11px] space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Espejo Primario:</span>
              <span className="text-white font-bold">2.4 m Ritchey-Chrétien</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Sensibilidad:</span>
              <span className="text-white font-bold">115 a 2,500 nanómetros</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Resolución angular:</span>
              <span className="text-emerald-400 font-bold">0.05 arcosegundos</span>
            </div>
          </div>

        </div>

      </div>

      {/* 4. DISCOVERY REVEAL MODAL (When an image is successfully captured) */}
      {revealedTarget && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-2xl border border-cyan-400 bg-slate-950 p-4 sm:p-6 space-y-4 shadow-[0_0_40px_rgba(0,240,255,0.4)] relative">
            
            {/* Close Button */}
            <button
              onClick={() => setRevealedTarget(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 border border-slate-700 hover:border-cyan-400"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge */}
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>¡NUEVO DESCUBRIMIENTO REGISTRADO EN LA BITÁCORA!</span>
            </div>

            {/* Full-res NASA Photograph */}
            <div className="border border-cyan-500/40 overflow-hidden bg-black relative group">
              <img 
                src={getAssetPath(revealedTarget.image)} 
                alt={revealedTarget.name}
                className="w-full h-64 sm:h-80 object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3 text-xs">
                <span className="text-[10px] text-amber-400 font-bold block">FOTOGRAFÍA OFICIAL DE LA NASA / ESA // HST</span>
                <span className="text-white font-bold text-sm sm:text-base">{revealedTarget.name}</span>
              </div>
            </div>

            {/* Scientific Breakdown */}
            <div className="space-y-2 text-xs sm:text-sm">
              <p className="text-slate-200 leading-relaxed font-sans">{revealedTarget.summary}</p>
              <div className="border-l-2 border-cyan-400 pl-3 py-1 bg-cyan-950/20 text-slate-300 font-sans text-xs leading-relaxed">
                <span className="font-bold text-cyan-300">Importancia científica:</span> {revealedTarget.discoveryText}
              </div>
            </div>

            {/* Technical Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[10px] sm:text-xs">
              <div className="bg-slate-900 p-2 border border-slate-800">
                <span className="text-slate-400 block">Distancia:</span>
                <span className="text-white font-bold">{revealedTarget.distance}</span>
              </div>
              <div className="bg-slate-900 p-2 border border-slate-800">
                <span className="text-slate-400 block">Constelación:</span>
                <span className="text-white font-bold">{revealedTarget.constellation}</span>
              </div>
              <div className="bg-slate-900 p-2 border border-slate-800">
                <span className="text-slate-400 block">Filtros Ópticos:</span>
                <span className="text-cyan-300 font-bold truncate block">{revealedTarget.filter}</span>
              </div>
              <div className="bg-slate-900 p-2 border border-slate-800">
                <span className="text-slate-400 block">Año de Toma:</span>
                <span className="text-amber-400 font-bold">{revealedTarget.year}</span>
              </div>
            </div>

            {/* Continue Button */}
            <div className="pt-2 flex justify-end space-x-3">
              <button
                onClick={() => setRevealedTarget(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              >
                Continuar Observaciones
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
