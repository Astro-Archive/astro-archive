import React, { useState, useEffect, useRef } from 'react';
import {
  Compass, Gauge, Map, Navigation, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Plane, Wind, CheckCircle2, Circle, AlertCircle, Award, Volume2, VolumeX, Sparkles
} from 'lucide-react';
import SurfaceMap3D, { MARS_SAMPLE_TARGETS, INGENUITY_AERIAL_WAYPOINTS } from './SurfaceMap3D';

/**
 * Web Audio API synthesizer for instant zero-latency sound effects:
 * drill rumble, laser chirp, and mission completion chime.
 */
function playSfx(type) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') ctx.resume();

    if (type === 'drill') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 2.0);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.2);
    } else if (type === 'laser') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'complete') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.9);
      });
    }
  } catch (e) {
    console.warn('Audio SFX skipped:', e);
  }
}

export default function SurfaceExplorer({ artifact, onClose }) {
  const [telemetry, setTelemetry] = useState({
    speedKmh: '0.0',
    x: '0.0',
    z: '0.0',
    elevation: '0.0',
    altitude: '0.0',
    headingDeg: 0,
    isFlying: false
  });

  // Mission State
  const [collectedSampleIds, setCollectedSampleIds] = useState([]);
  const [clearedWaypointIds, setClearedWaypointIds] = useState([]);
  const [proximityInfo, setProximityInfo] = useState({ nearestTarget: null, targetInRange: null, distance: '0.0' });
  
  // Sampling sequence state
  const [isSamplingActive, setIsSamplingActive] = useState(false);
  const [samplingTarget, setSamplingTarget] = useState(null);
  const [samplingStep, setSamplingStep] = useState(1);
  const [samplingProgress, setSamplingProgress] = useState(0);

  // Scientific dossier modal
  const [dossierTarget, setDossierTarget] = useState(null);
  const [isWindPlaying, setIsWindPlaying] = useState(true);

  const windAudioRef = useRef(null);

  const isMars = !artifact || artifact.body === 'Marte' || ['perseverance', 'ingenuity', 'opportunity', 'viking'].includes(artifact.id);
  const isFlying = artifact?.id === 'ingenuity';

  const sendKey = (code, isDown) => {
    window.dispatchEvent(new KeyboardEvent(isDown ? 'keydown' : 'keyup', { code }));
  };

  // Autoplay real Martian wind audio (filtered Perseverance recording)
  useEffect(() => {
    if (windAudioRef.current) {
      windAudioRef.current.volume = 0.25;
      if (isWindPlaying) {
        windAudioRef.current.play().catch(() => {});
      } else {
        windAudioRef.current.pause();
      }
    }
  }, [isWindPlaying]);

  // Handle Drilling & Core Sampling Action
  const triggerSampling = (target) => {
    if (!target || isSamplingActive || collectedSampleIds.includes(target.id)) return;

    setIsSamplingActive(true);
    setSamplingTarget(target);
    setSamplingStep(1);
    setSamplingProgress(10);
    playSfx('laser');

    // Step 1: Laser LIBS & Surface Abrasion
    setTimeout(() => {
      setSamplingStep(2);
      setSamplingProgress(45);
      playSfx('drill');
    }, 1000);

    // Step 2: Diamond Coring Bit & Extraction
    setTimeout(() => {
      setSamplingStep(3);
      setSamplingProgress(85);
      playSfx('drill');
    }, 2000);

    // Step 3: Hermetic Sealing & Complete
    setTimeout(() => {
      setSamplingProgress(100);
      playSfx('complete');
      setCollectedSampleIds((prev) => [...prev, target.id]);
      setIsSamplingActive(false);
      setDossierTarget(target);
    }, 3000);
  };

  // Keyboard shortcut [E] to sample rock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'KeyE') {
        if (proximityInfo.targetInRange && !isSamplingActive) {
          triggerSampling(proximityInfo.targetInRange);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [proximityInfo.targetInRange, isSamplingActive]);

  if (!artifact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-1 sm:p-4 backdrop-blur-md font-mono select-none">
      <div className="relative flex h-full max-h-[880px] w-full max-w-6xl flex-col overflow-hidden border border-emerald-500/60 bg-black shadow-2xl">
        
        {/* Hidden Martian Wind Audio Player */}
        <audio ref={windAudioRef} src="/audio/mars_wind.wav" loop preload="auto" />

        {/* 1. Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/40 bg-black/95 px-3 py-2.5 sm:px-5">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-none animate-ping ${isFlying ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-emerald-400">
                {isMars ? '🪐 Superficie Marciana // Cráter Jezero' : '🌕 Superficie Lunar // Mar de la Tranquilidad'}
              </p>
              <h2 className="text-sm font-bold text-white sm:text-base tracking-wide flex items-center space-x-2">
                <span>{artifact.name}</span>
                <span className={`text-[10px] px-2 py-0.5 border font-mono ${
                  isFlying
                    ? 'border-amber-400/80 bg-amber-950/60 text-amber-300'
                    : 'border-emerald-500/60 bg-emerald-950/60 text-emerald-300'
                }`}>
                  {isFlying ? '🚁 MODO VUELO ATMOSFÉRICO 360°' : '🚜 ROVER TERRESTRE 360°'}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Real Martian Wind Audio Toggle */}
            <button
              onClick={() => setIsWindPlaying(!isWindPlaying)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 text-[11px] border transition-all ${
                isWindPlaying
                  ? 'border-emerald-400 bg-emerald-950/60 text-emerald-300'
                  : 'border-slate-700 bg-black text-slate-400 hover:text-white'
              }`}
              title="Audio ambiental real grabado por Perseverance en Jezero"
            >
              {isWindPlaying ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Viento de Marte</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Cerrar simulación de superficie"
              className="text-slate-400 hover:text-white p-1 hover:bg-white/10 transition-all font-bold"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* 2. 3D Viewport with Real 3D Model, Solid Boulders & Missions */}
        <div className="relative min-h-0 flex-1 overflow-hidden bg-black">
          <SurfaceMap3D
            artifact={artifact}
            onTelemetryChange={setTelemetry}
            onTargetProximity={setProximityInfo}
            collectedSampleIds={collectedSampleIds}
            clearedWaypointIds={clearedWaypointIds}
            isSamplingActive={isSamplingActive}
            samplingTarget={samplingTarget}
          />

          {/* Top-Left Telemetry HUD Overlay */}
          <div className="pointer-events-none absolute top-3 left-3 bg-black/85 border border-emerald-500/50 p-2.5 text-[11px] sm:text-xs text-emerald-300 space-y-1 shadow-2xl backdrop-blur-md max-w-xs">
            <div className="text-[10px] uppercase font-bold text-emerald-400 border-b border-emerald-500/30 pb-1 flex items-center justify-between">
              <span>{isFlying ? '🚁 Telemetría de Vuelo' : '📡 Telemetría de Superficie'}</span>
              <span className="text-amber-400">RADAR: ACTIVO</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{isFlying ? 'Vel. de Vuelo:' : 'Velocidad:'}</span>
              <span className="font-bold text-amber-300">{telemetry.speedKmh} km/h</span>
            </div>
            {isFlying && (
              <div className="flex justify-between">
                <span className="text-slate-400">Altitud de Vuelo:</span>
                <span className="font-bold text-cyan-300">{telemetry.altitude} m (sobre dunas)</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Rumbo (Yaw):</span>
              <span className="font-bold text-white">{telemetry.headingDeg}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Elevación Cota:</span>
              <span className="font-bold text-emerald-200">{telemetry.elevation} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Coordenadas:</span>
              <span className="font-mono text-[10px] text-cyan-300">X: {telemetry.x} | Z: {telemetry.z}</span>
            </div>
          </div>

          {/* Top-Right Mission Tracker HUD Panel */}
          <div className="pointer-events-auto absolute top-3 right-3 bg-black/90 border border-cyan-500/50 p-2.5 text-[11px] sm:text-xs text-slate-200 shadow-2xl backdrop-blur-md max-w-xs sm:max-w-sm">
            <div className="border-b border-cyan-500/30 pb-1 mb-2 flex items-center justify-between">
              <span className="font-bold text-cyan-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>MISIÓN: TESTIGOS DE JEZERO</span>
              </span>
              <span className="text-amber-400 font-bold px-1.5 py-0.5 bg-amber-950/60 border border-amber-500/40 text-[10px]">
                {collectedSampleIds.length} / {MARS_SAMPLE_TARGETS.length} TUBOS
              </span>
            </div>

            <div className="space-y-1.5">
              {MARS_SAMPLE_TARGETS.map((target) => {
                const isCollected = collectedSampleIds.includes(target.id);
                const isNear = proximityInfo.nearestTarget?.id === target.id;
                return (
                  <div
                    key={target.id}
                    className={`p-1.5 border transition-all text-[10px] sm:text-[11px] flex items-center justify-between ${
                      isCollected
                        ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300'
                        : isNear
                        ? 'border-amber-400 bg-amber-950/50 text-white animate-pulse'
                        : 'border-slate-800 bg-black/60 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      {isCollected ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-bold text-slate-200">{target.name}</div>
                        <div className="text-[9px] text-slate-400">{target.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {isCollected ? (
                        <span className="text-emerald-400 font-bold">{target.tubeId}</span>
                      ) : (
                        <span className="text-cyan-300 font-mono">
                          {isNear ? `${proximityInfo.distance}m` : 'Radar'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* INTERACTIVE SAMPLING PROMPT BANNER (When within 4 meters of target rock) */}
          {proximityInfo.targetInRange && !isSamplingActive && (
            <div className="pointer-events-auto absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/95 border-2 border-amber-400 p-3 sm:p-4 text-center shadow-[0_0_25px_rgba(245,158,11,0.5)] backdrop-blur-xl animate-bounce max-w-md w-[92%] sm:w-auto">
              <div className="text-[10px] uppercase font-bold text-amber-300 tracking-wider flex items-center justify-center space-x-1.5 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>OBJETIVO CIENTÍFICO EN RANGO OPERATIVO</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mb-2">
                {proximityInfo.targetInRange.name} ({proximityInfo.targetInRange.type})
              </h3>
              <button
                onClick={() => triggerSampling(proximityInfo.targetInRange)}
                className="w-full px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-xs sm:text-sm uppercase tracking-wider border border-amber-300 shadow-lg flex items-center justify-center space-x-2"
              >
                <span>⚡ PERFORAR Y RECOLECTAR MUESTRA</span>
                <span className="bg-black/30 text-white px-1.5 py-0.5 rounded-none text-[10px]">TECLA [E]</span>
              </button>
            </div>
          )}

          {/* ACTIVE DRILLING / SAMPLING SEQUENCE DIALOG */}
          {isSamplingActive && samplingTarget && (
            <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="w-full max-w-md border-2 border-cyan-400 bg-black/95 p-5 text-white shadow-[0_0_30px_rgba(0,240,255,0.4)] font-mono text-center space-y-4">
                <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                  OPERACIÓN CIENTÍFICA EN CURSO
                </div>
                <h3 className="text-lg font-bold text-white">
                  {samplingTarget.name}
                </h3>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 border border-cyan-500/50 h-3 p-0.5">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${samplingProgress}%` }}
                  />
                </div>

                <div className="text-xs text-amber-300 font-bold">
                  {samplingStep === 1 && 'Fase 1/3: SuperCam — Vaporización láser y análisis espectral...'}
                  {samplingStep === 2 && 'Fase 2/3: Taladro percutor — Extrayendo testigo cilíndrico a 5.8 cm...'}
                  {samplingStep === 3 && 'Fase 3/3: Brazo robótico — Sellado hermético en tubo de titanio ultra-limpio...'}
                </div>

                <p className="text-[11px] text-slate-400">
                  Herramienta activa: <span className="text-emerald-300">{samplingTarget.tool}</span>
                </p>
              </div>
            </div>
          )}

          {/* SCIENTIFIC DOSSIER MODAL (When sample successfully sealed) */}
          {dossierTarget && (
            <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
              <div className="w-full max-w-lg border-2 border-emerald-400 bg-black/95 p-5 text-white shadow-[0_0_35px_rgba(16,185,129,0.5)] font-mono space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-500/40 pb-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>TESTIGO DE ROCA SELLADO CON ÉXITO</span>
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold">
                    {dossierTarget.tubeId}
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{dossierTarget.name}</h3>
                  <p className="text-xs text-cyan-300">{dossierTarget.type}</p>
                </div>

                <div className="space-y-2 text-xs text-slate-300 leading-relaxed border-y border-slate-800 py-3">
                  <p><strong className="text-emerald-400">Hallazgo de la Misión:</strong> {dossierTarget.summary}</p>
                  <p><strong className="text-amber-400">Mineralogía Detectada:</strong> {dossierTarget.mineralogy}</p>
                  <p><strong className="text-cyan-400">Relevancia Científica NASA:</strong> {dossierTarget.scienceValue}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    Tubos recolectados: <strong className="text-white">{collectedSampleIds.length}/3</strong>
                  </span>
                  <button
                    onClick={() => setDossierTarget(null)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    CONTINUAR EXPLORACIÓN
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ALL MISSIONS COMPLETE BANNER */}
          {collectedSampleIds.length === MARS_SAMPLE_TARGETS.length && (
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-emerald-950/90 border border-emerald-400 p-3 shadow-2xl backdrop-blur-md">
              <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
                <Award className="w-4 h-4 text-amber-400" />
                <span>¡CAMPAÑA DE MUESTREO DE JEZERO COMPLETADA!</span>
              </div>
              <p className="text-[10px] text-slate-300 mt-1">
                Los 3 testigos clave de roca marciana han sido asegurados en el carrusel de Perseverance para la misión Mars Sample Return.
              </p>
            </div>
          )}

          {/* Touch / Mouse On-Screen Controls */}
          <div className="absolute bottom-4 right-4 flex items-end space-x-2 pointer-events-auto">
            {/* Elevation Controls for Flying Helicopter */}
            {isFlying && (
              <div className="flex flex-col space-y-1 bg-black/90 p-2 border border-amber-500/50">
                <span className="text-[9px] text-amber-300 text-center font-bold">ALTITUD</span>
                <button
                  onMouseDown={() => sendKey('KeyR', true)}
                  onMouseUp={() => sendKey('KeyR', false)}
                  onTouchStart={() => sendKey('KeyR', true)}
                  onTouchEnd={() => sendKey('KeyR', false)}
                  aria-label="Subir altitud"
                  className="px-3 py-2 bg-amber-950/80 hover:bg-amber-800 border border-amber-400 text-white font-bold text-xs"
                >
                  ▲ SUBIR
                </button>
                <button
                  onMouseDown={() => sendKey('KeyF', true)}
                  onMouseUp={() => sendKey('KeyF', false)}
                  onTouchStart={() => sendKey('KeyF', true)}
                  onTouchEnd={() => sendKey('KeyF', false)}
                  aria-label="Bajar altitud"
                  className="px-3 py-2 bg-amber-950/80 hover:bg-amber-800 border border-amber-400 text-white font-bold text-xs"
                >
                  ▼ BAJAR
                </button>
              </div>
            )}

            {/* D-Pad */}
            <div className="grid grid-cols-3 gap-1 border border-emerald-500/50 bg-black/90 p-2 shadow-2xl">
              <span />
              <button
                onMouseDown={() => sendKey('KeyW', true)}
                onMouseUp={() => sendKey('KeyW', false)}
                onTouchStart={() => sendKey('KeyW', true)}
                onTouchEnd={() => sendKey('KeyW', false)}
                aria-label="Avanzar"
                className="px-3 py-2.5 bg-emerald-950/80 hover:bg-emerald-800 border border-emerald-400/80 text-white font-bold text-xs"
              >
                ▲
              </button>
              <span />
              <button
                onMouseDown={() => sendKey('KeyA', true)}
                onMouseUp={() => sendKey('KeyA', false)}
                onTouchStart={() => sendKey('KeyA', true)}
                onTouchEnd={() => sendKey('KeyA', false)}
                aria-label="Girar izquierda"
                className="px-3 py-2.5 bg-emerald-950/80 hover:bg-emerald-800 border border-emerald-400/80 text-white font-bold text-xs"
              >
                ◄
              </button>
              <button
                onMouseDown={() => sendKey('KeyS', true)}
                onMouseUp={() => sendKey('KeyS', false)}
                onTouchStart={() => sendKey('KeyS', true)}
                onTouchEnd={() => sendKey('KeyS', false)}
                aria-label="Retroceder"
                className="px-3 py-2.5 bg-emerald-950/80 hover:bg-emerald-800 border border-emerald-400/80 text-white font-bold text-xs"
              >
                ▼
              </button>
              <button
                onMouseDown={() => sendKey('KeyD', true)}
                onMouseUp={() => sendKey('KeyD', false)}
                onTouchStart={() => sendKey('KeyD', true)}
                onTouchEnd={() => sendKey('KeyD', false)}
                aria-label="Girar derecha"
                className="px-3 py-2.5 bg-emerald-950/80 hover:bg-emerald-800 border border-emerald-400/80 text-white font-bold text-xs"
              >
                ►
              </button>
            </div>
          </div>

        </div>

        {/* 3. Footer Bar */}
        <footer className="border-t border-emerald-500/30 bg-black/95 px-3 py-2 text-center sm:text-left text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="font-bold text-emerald-400">CONTROLES:</span> Conduce con <span className="text-white font-bold">[W / A / S / D]</span>. Presiona <span className="text-amber-300 font-bold">[E]</span> para perforar rocas en rango.
            {isFlying && (
              <span className="ml-2 text-amber-300">Usa <span className="text-white font-bold">[Space / R]</span> para ascender y <span className="text-white font-bold">[Shift / F]</span> para descender.</span>
            )}
          </div>
          <div className="text-slate-400 text-[10px]">
            Cámara orbital 360° (arrastra el ratón) // Rocas sólidas de basalto marciano
          </div>
        </footer>

      </div>
    </div>
  );
}
