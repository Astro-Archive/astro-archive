import React, { useState, useEffect, useRef } from 'react';
import {
  Compass, Gauge, Map, Navigation, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Plane, Wind, CheckCircle2, Circle, AlertCircle, Award, Volume2, VolumeX, Sparkles, Radio
} from 'lucide-react';
import SurfaceMap3D, { MARS_SAMPLE_TARGETS, MOON_APOLLO_TARGETS, INGENUITY_AERIAL_WAYPOINTS } from './SurfaceMap3D';
import { getAssetPath } from '../utils/assets';
import SciFiButton from './ui/SciFiButton';

/**
 * Web Audio API synthesizer for instant zero-latency sound effects.
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
  const isMars = !artifact || artifact.body === 'Marte' || ['perseverance', 'ingenuity', 'opportunity', 'viking'].includes(artifact.id);
  const isApollo = artifact?.id === 'apollo11';
  const isFlying = artifact?.id === 'ingenuity';

  const [telemetry, setTelemetry] = useState({
    speedKmh: '0.0',
    x: '0.0',
    z: '0.0',
    elevation: '0.0',
    altitude: isApollo ? '16.0' : '0.0',
    headingDeg: 0,
    isFlying: false,
    hasLanded: false
  });

  // Apollo 11 Landing & Astronaut Walk States
  const [apolloLandingDone, setApolloLandingDone] = useState(false);
  const [showLandingBanner, setShowLandingBanner] = useState(false);
  const [showFirstStepBanner, setShowFirstStepBanner] = useState(false);

  // Mission State (Targets for Mars or Moon)
  const [collectedSampleIds, setCollectedSampleIds] = useState([]);
  const [clearedWaypointIds, setClearedWaypointIds] = useState([]);
  const [proximityInfo, setProximityInfo] = useState({ nearestTarget: null, targetInRange: null, distance: '0.0' });
  
  // Sampling / Interaction state
  const [isSamplingActive, setIsSamplingActive] = useState(false);
  const [samplingTarget, setSamplingTarget] = useState(null);
  const [samplingStep, setSamplingStep] = useState(1);
  const [samplingProgress, setSamplingProgress] = useState(0);

  // Scientific dossier modal
  const [dossierTarget, setDossierTarget] = useState(null);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(true);

  const ambientAudioRef = useRef(null);
  const historicAudioRef = useRef(null);

  const activeMissionTargets = isMars ? MARS_SAMPLE_TARGETS : MOON_APOLLO_TARGETS;

  const sendKey = (code, isDown) => {
    window.dispatchEvent(new KeyboardEvent(isDown ? 'keydown' : 'keyup', { code }));
  };

  // Play historic NASA speech clip
  const playHistoricAudio = (url) => {
    if (!url) return;
    try {
      if (historicAudioRef.current) {
        historicAudioRef.current.pause();
      }
      historicAudioRef.current = new Audio(getAssetPath(url));
      historicAudioRef.current.volume = 0.9;
      historicAudioRef.current.play().catch((e) => console.warn('Historic audio play blocked:', e));
    } catch (e) {
      console.warn('Historic audio error:', e);
    }
  };

  // Autoplay ambient audio: Martian wind for Mars, Apollo Capcom radio for Moon
  useEffect(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = isMars ? 0.25 : 0.18;
      if (isAmbientPlaying) {
        ambientAudioRef.current.play().catch(() => {});
      } else {
        ambientAudioRef.current.pause();
      }
    }
  }, [isAmbientPlaying, isMars]);

  // Touchdown Handler for Apollo 11 LEM Eagle
  const handleApolloTouchdown = () => {
    setApolloLandingDone(true);
    setShowLandingBanner(true);
    playHistoricAudio('/audio/eagle_landed.mp3');
    setTimeout(() => {
      setShowLandingBanner(false);
    }, 9000);
  };

  // First step on the Moon handler
  const handleFirstStep = () => {
    setShowFirstStepBanner(true);
    playHistoricAudio('/audio/one_small_step.mp3');
    setTimeout(() => {
      setShowFirstStepBanner(false);
    }, 9000);
  };

  // Handle Drilling, Sampling or Deploying lunar experiment
  const triggerSampling = (target) => {
    if (!target || isSamplingActive || collectedSampleIds.includes(target.id)) return;

    setIsSamplingActive(true);
    setSamplingTarget(target);
    setSamplingStep(1);
    setSamplingProgress(15);
    playSfx('laser');

    if (target.id === 'apollo_plaque') {
      playHistoricAudio('/audio/we_came_in_peace.mp3');
    }

    setTimeout(() => {
      setSamplingStep(2);
      setSamplingProgress(50);
      playSfx('drill');
    }, 1000);

    setTimeout(() => {
      setSamplingStep(3);
      setSamplingProgress(85);
      playSfx('drill');
    }, 2000);

    setTimeout(() => {
      setSamplingProgress(100);
      playSfx('complete');
      setCollectedSampleIds((prev) => [...prev, target.id]);
      setIsSamplingActive(false);
      setDossierTarget(target);
    }, 3000);
  };

  // Keyboard shortcut [E]
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
        
        {/* Hidden Ambient Audio Player (Martian Wind or Apollo Radio) */}
        <audio
          ref={ambientAudioRef}
          src={getAssetPath(isMars ? '/audio/mars_wind.wav' : '/audio/space_ambient.mp3')}
          loop
          preload="auto"
        />

        {/* 1. Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/40 bg-black/95 px-3 py-2.5 sm:px-5">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-none animate-ping ${
              isApollo ? (apolloLandingDone ? 'bg-cyan-400' : 'bg-amber-400') : (isFlying ? 'bg-amber-400' : 'bg-emerald-400')
            }`}></div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-emerald-400">
                {isMars ? '🪐 Superficie Marciana // Cráter Jezero' : '🌕 Superficie Lunar // Mar de la Tranquilidad (Base Tranquilidad)'}
              </p>
              <h2 className="text-sm font-bold text-white sm:text-base tracking-wide flex items-center space-x-2">
                <span>{isApollo ? (apolloLandingDone ? 'Neil Armstrong (EVA Apolo 11)' : 'Módulo Lunar LEM Eagle (Apolo 11)') : artifact.name}</span>
                <span className={`text-[10px] px-2 py-0.5 border font-mono ${
                  isApollo
                    ? (apolloLandingDone ? 'border-cyan-400 bg-cyan-950/70 text-cyan-300' : 'border-amber-400 bg-amber-950/70 text-amber-300 animate-pulse')
                    : isFlying
                    ? 'border-amber-400/80 bg-amber-950/60 text-amber-300'
                    : 'border-emerald-500/60 bg-emerald-950/60 text-emerald-300'
                }`}>
                  {isApollo
                    ? (apolloLandingDone ? '👨‍🚀 NEIL ARMSTRONG (CAMINATA LUNAR 1/6 g)' : '🚀 FASE DE ALUNIZAJE MANUAL DPS')
                    : isFlying
                    ? '🚁 MODO VUELO ATMOSFÉRICO 360°'
                    : '🚜 ROVER TERRESTRE 360°'}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Ambient Audio Toggle */}
            <button
              onClick={() => setIsAmbientPlaying(!isAmbientPlaying)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 text-[11px] border transition-all ${
                isAmbientPlaying
                  ? 'border-emerald-400 bg-emerald-950/60 text-emerald-300'
                  : 'border-slate-700 bg-black text-slate-400 hover:text-white'
              }`}
              title={isMars ? 'Audio ambiental de viento marciano de Perseverance' : 'Audio ambiental radio Capcom de la misión Apolo 11'}
            >
              {isAmbientPlaying ? (isMars ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <Radio className="w-3.5 h-3.5 text-cyan-400" />) : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isMars ? 'Viento de Marte' : 'Radio Capcom Houston'}</span>
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

        {/* 2. 3D Viewport */}
        <div className="relative min-h-0 flex-1 overflow-hidden bg-black">
          <SurfaceMap3D
            artifact={artifact}
            onTelemetryChange={setTelemetry}
            onTargetProximity={setProximityInfo}
            collectedSampleIds={collectedSampleIds}
            clearedWaypointIds={clearedWaypointIds}
            isSamplingActive={isSamplingActive}
            samplingTarget={samplingTarget}
            onApolloTouchdown={handleApolloTouchdown}
            onFirstStep={handleFirstStep}
            apolloLandingDone={apolloLandingDone}
          />

          {/* Top-Left Telemetry HUD Overlay */}
          <div className="pointer-events-none absolute top-3 left-3 bg-black/85 border border-emerald-500/50 p-2.5 text-[11px] sm:text-xs text-emerald-300 space-y-1 shadow-2xl backdrop-blur-md max-w-xs">
            <div className="text-[10px] uppercase font-bold text-emerald-400 border-b border-emerald-500/30 pb-1 flex items-center justify-between">
              <span>{isApollo ? (apolloLandingDone ? '👨‍🚀 Telemetría de Astronauta' : '🚀 Telemetría Alunizaje LEM') : (isFlying ? '🚁 Telemetría de Vuelo' : '📡 Telemetría de Superficie')}</span>
              <span className="text-amber-400">{isApollo && !apolloLandingDone ? 'MOTOR DPS: ACTIVO' : 'RADAR: ACTIVO'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{isApollo ? (apolloLandingDone ? 'Vel. de Pasos:' : 'Velocidad:') : (isFlying ? 'Vel. de Vuelo:' : 'Velocidad:')}</span>
              <span className="font-bold text-amber-300">{telemetry.speedKmh} km/h</span>
            </div>
            {(!apolloLandingDone || isFlying) && (
              <div className="flex justify-between">
                <span className="text-slate-400">Altitud Radar:</span>
                <span className="font-bold text-cyan-300">{telemetry.altitude} m {isApollo ? '(sobre regolito)' : '(sobre dunas)'}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Rumbo (Yaw):</span>
              <span className="font-bold text-white">{telemetry.headingDeg}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cota Terreno:</span>
              <span className="font-bold text-emerald-200">{telemetry.elevation} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Coordenadas:</span>
              <span className="font-mono text-[10px] text-cyan-300">X: {telemetry.x} | Z: {telemetry.z}</span>
            </div>
            {isApollo && !apolloLandingDone && (
              <div className="border-t border-amber-500/40 pt-1 text-[10px] text-amber-300 font-bold animate-pulse">
                ▼ DESCENDER A MENOS DE 0.2 m PARA ALUNIZAR
              </div>
            )}
          </div>

          {/* Top-Right Mission Tracker HUD Panel */}
          <div className="pointer-events-auto absolute top-3 right-3 bg-black/90 border border-cyan-500/50 p-2.5 text-[11px] sm:text-xs text-slate-200 shadow-2xl backdrop-blur-md max-w-xs sm:max-w-sm">
            <div className="border-b border-cyan-500/30 pb-1 mb-2 flex items-center justify-between">
              <span className="font-bold text-cyan-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isApollo ? 'MISIÓN: BASE TRANQUILIDAD' : 'MISIÓN: TESTIGOS DE JEZERO'}</span>
              </span>
              <span className="text-amber-400 font-bold px-1.5 py-0.5 bg-amber-950/60 border border-amber-500/40 text-[10px]">
                {collectedSampleIds.length} / {activeMissionTargets.length} OBJETIVOS
              </span>
            </div>

            <div className="space-y-1.5">
              {activeMissionTargets.map((target) => {
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
                        <span className="text-emerald-400 font-bold">COMPLETADO</span>
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

          {/* HISTORIC BANNER 1: ALUNIZAJE CONFIRMADO */}
          {showLandingBanner && (
            <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 bg-black/95 border-2 border-emerald-400 p-4 text-center shadow-[0_0_35px_rgba(16,185,129,0.7)] backdrop-blur-xl z-40 max-w-lg w-[92%] animate-pulse">
              <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider mb-1">
                🎙️ TRANSMISIÓN HISTÓRICA DESDE EL MAR DE LA TRANQUILIDAD
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                "Houston, Tranquility Base here. The Eagle has landed."
              </h3>
              <p className="text-xs text-amber-300">
                — Neil Armstrong (20 de julio de 1969)
              </p>
              <div className="mt-2 text-[11px] text-slate-300 border-t border-emerald-500/40 pt-1">
                Alunizaje exitoso. El módulo Eagle queda posado fijo. Control transferido a Neil Armstrong para la caminata lunar EVA.
              </div>
            </div>
          )}

          {/* HISTORIC BANNER 2: UN PEQUEÑO PASO */}
          {showFirstStepBanner && (
            <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 bg-black/95 border-2 border-cyan-400 p-4 text-center shadow-[0_0_35px_rgba(0,240,255,0.7)] backdrop-blur-xl z-40 max-w-lg w-[92%] animate-pulse">
              <div className="text-xs uppercase font-bold text-cyan-400 tracking-wider mb-1">
                🎙️ PRIMER PASO DE LA HUMANIDAD EN OTRO MUNDO
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                "That's one small step for [a] man, one giant leap for mankind."
              </h3>
              <p className="text-xs text-cyan-300">
                — Neil Armstrong al pisar el regolito lunar
              </p>
            </div>
          )}

          {/* INTERACTIVE ACTION PROMPT BANNER */}
          {proximityInfo.targetInRange && !isSamplingActive && (
            <div className="pointer-events-auto absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/95 border-2 border-amber-400 p-3 sm:p-4 text-center shadow-[0_0_25px_rgba(245,158,11,0.5)] backdrop-blur-xl animate-bounce max-w-md w-[92%] sm:w-auto z-30">
              <div className="text-[10px] uppercase font-bold text-amber-300 tracking-wider flex items-center justify-center space-x-1.5 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>OBJETIVO CIENTÍFICO EN RANGO</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mb-2">
                {proximityInfo.targetInRange.name}
              </h3>
              <SciFiButton
                size="lg"
                onClick={() => triggerSampling(proximityInfo.targetInRange)}
                className="w-full"
                icon={<span className="text-[10px] font-bold leading-none">E</span>}
              >
                {isApollo ? 'Completar objetivo lunar' : 'Perforar y recolectar'}
              </SciFiButton>
            </div>
          )}

          {/* ACTIVE OPERATION DIALOG */}
          {isSamplingActive && samplingTarget && (
            <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="w-full max-w-md border-2 border-cyan-400 bg-black/95 p-5 text-white shadow-[0_0_30px_rgba(0,240,255,0.4)] font-mono text-center space-y-4">
                <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                  {isApollo ? 'OPERACIÓN EXTRAVEHICULAR EVA' : 'OPERACIÓN CIENTÍFICA EN CURSO'}
                </div>
                <h3 className="text-lg font-bold text-white">
                  {samplingTarget.name}
                </h3>

                <div className="w-full bg-slate-900 border border-cyan-500/50 h-3 p-0.5">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${samplingProgress}%` }}
                  />
                </div>

                <div className="text-xs text-amber-300 font-bold">
                  {isApollo ? (
                    samplingStep === 1 ? 'Paso 1/3: Desplegando instrumental en el regolito lunar...' :
                    samplingStep === 2 ? 'Paso 2/3: Ajustando fijaciones y alineación con la Tierra...' :
                    'Paso 3/3: Verificación de telemetría con Capcom Houston...'
                  ) : (
                    samplingStep === 1 ? 'Fase 1/3: SuperCam — Vaporización láser y análisis espectral...' :
                    samplingStep === 2 ? 'Fase 2/3: Taladro percutor — Extrayendo testigo a 5.8 cm...' :
                    'Fase 3/3: Brazo robótico — Sellado hermético en tubo de titanio...'
                  )}
                </div>

                <p className="text-[11px] text-slate-400">
                  Herramienta: <span className="text-emerald-300">{samplingTarget.tool}</span>
                </p>
              </div>
            </div>
          )}

          {/* SCIENTIFIC DOSSIER MODAL */}
          {dossierTarget && (
            <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
              <div className="w-full max-w-lg border-2 border-emerald-400 bg-black/95 p-5 text-white shadow-[0_0_35px_rgba(16,185,129,0.5)] font-mono space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-500/40 pb-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>{isApollo ? 'OBJETIVO HISTÓRICO COMPLETADO' : 'TESTIGO DE ROCA SELLADO'}</span>
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
                  <p><strong className="text-emerald-400">Hallazgo Histórico:</strong> {dossierTarget.summary}</p>
                  <p><strong className="text-amber-400">{isApollo ? 'Datos de Ingeniería / Materiales:' : 'Mineralogía Detectada:'}</strong> {dossierTarget.mineralogy}</p>
                  <p><strong className="text-cyan-400">Relevancia Científica NASA:</strong> {dossierTarget.scienceValue}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    Completados: <strong className="text-white">{collectedSampleIds.length}/{activeMissionTargets.length}</strong>
                  </span>
                  <SciFiButton onClick={() => setDossierTarget(null)} showArrow={false}>
                    Continuar exploración
                  </SciFiButton>
                </div>
              </div>
            </div>
          )}

          {/* ALL MISSIONS COMPLETE BANNER */}
          {collectedSampleIds.length === activeMissionTargets.length && (
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-emerald-950/90 border border-emerald-400 p-3 shadow-2xl backdrop-blur-md z-30">
              <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{isApollo ? '¡MISIÓN APOLO 11 EN EL MAR DE LA TRANQUILIDAD CUMPLIDA!' : '¡CAMPAÑA DE MUESTREO DE JEZERO COMPLETADA!'}</span>
              </div>
              <p className="text-[10px] text-slate-300 mt-1">
                {isApollo
                  ? 'Todos los experimentos han sido desplegados y las muestras lunares quedan aseguradas para su retorno a la Tierra en el módulo Columbia.'
                  : 'Los 3 testigos clave de roca marciana han sido asegurados en el carrusel de Perseverance para la misión Mars Sample Return.'}
              </p>
            </div>
          )}

          {/* Touch / Mouse On-Screen Controls */}
          <div className="absolute bottom-4 right-4 flex items-end space-x-2 pointer-events-auto">
            {/* Descent / Climb controls (For LEM Landing or Ingenuity Drone) */}
            {(!apolloLandingDone || isFlying) && (
              <div className="flex flex-col space-y-1 bg-black/90 p-2 border border-amber-500/50">
                <span className="text-[9px] text-amber-300 text-center font-bold">{isApollo ? 'EMPUJE DPS' : 'ALTITUD'}</span>
                <button
                  onMouseDown={() => sendKey('KeyR', true)}
                  onMouseUp={() => sendKey('KeyR', false)}
                  onTouchStart={() => sendKey('KeyR', true)}
                  onTouchEnd={() => sendKey('KeyR', false)}
                  aria-label="Subir altitud o frenar descenso"
                  className="px-3 py-2 bg-amber-950/80 hover:bg-amber-800 border border-amber-400 text-white font-bold text-xs"
                >
                  ▲ {isApollo ? 'FRENAR' : 'SUBIR'}
                </button>
                <button
                  onMouseDown={() => sendKey('KeyF', true)}
                  onMouseUp={() => sendKey('KeyF', false)}
                  onTouchStart={() => sendKey('KeyF', true)}
                  onTouchEnd={() => sendKey('KeyF', false)}
                  aria-label="Descender"
                  className="px-3 py-2 bg-amber-950/80 hover:bg-amber-800 border border-amber-400 text-white font-bold text-xs"
                >
                  ▼ BAJAR
                </button>
              </div>
            )}

            {/* D-Pad Controls */}
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
            <span className="font-bold text-emerald-400">CONTROLES:</span>
            {isApollo && !apolloLandingDone ? (
              <span> Maniobra con <strong className="text-white">[W / A / S / D]</strong>. Desciende con <strong className="text-amber-300">[Shift / F]</strong> y activa empuje DPS con <strong className="text-amber-300">[Space / R]</strong>. Aluniza a menos de 0.2 m.</span>
            ) : isApollo && apolloLandingDone ? (
              <span> Camina con Neil Armstrong usando <strong className="text-white">[W / A / S / D]</strong> (gravedad lunar 1/6 g). Presiona <strong className="text-amber-300">[E]</strong> para interactuar con los experimentos.</span>
            ) : (
              <span> Conduce con <strong className="text-white">[W / A / S / D]</strong>. Presiona <strong className="text-amber-300">[E]</strong> para perforar rocas en rango.</span>
            )}
          </div>
          <div className="text-slate-400 text-[10px]">
            {isApollo ? 'Mar de la Tranquilidad // La Tierra visible en el cielo lunar' : 'Cráter Jezero // Dunas Marcianas'}
          </div>
        </footer>

      </div>
    </div>
  );
}
