import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Compass, Gauge, Map, Navigation, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Plane, Wind, CheckCircle2, Circle, AlertCircle, Award, Volume2, VolumeX, Sparkles, Radio
} from 'lucide-react';
import SurfaceMap3D, { MARS_SAMPLE_TARGETS, OPPORTUNITY_MER_TARGETS, MOON_APOLLO_TARGETS, INGENUITY_AERIAL_WAYPOINTS } from './SurfaceMap3D';
import { getAssetPath } from '../utils/assets';
import SciFiButton from './ui/SciFiButton';
import { useI18n } from '../i18n';
import { localize } from '../i18n/localize';

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
  const { t, lang, localizeValue } = useI18n();
  const isMars = !artifact || artifact.body === 'Marte' || ['perseverance', 'ingenuity', 'opportunity', 'viking'].includes(artifact.id);
  const isApollo = artifact?.id === 'apollo11';
  const isOpportunity = artifact?.id === 'opportunity';
  const isViking = artifact?.id === 'viking';
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

  const activeMissionTargets = isOpportunity
    ? OPPORTUNITY_MER_TARGETS
    : isMars
    ? MARS_SAMPLE_TARGETS
    : MOON_APOLLO_TARGETS;
  // Resolved on every language change so the list re-renders translated.
  const missionTargets = useMemo(() => localize(activeMissionTargets, lang), [activeMissionTargets, lang]);

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
                {isOpportunity
                  ? t('surface.header.opportunity')
                  : isViking
                  ? t('surface.header.viking')
                  : isMars
                  ? t('surface.header.mars')
                  : t('surface.header.moon')}
              </p>
              <h2 className="text-sm font-bold text-white sm:text-base tracking-wide flex items-center space-x-2">
                <span>{isApollo ? (apolloLandingDone ? t('surface.title.astronaut') : t('surface.title.lem')) : localizeValue(artifact.name)}</span>
                <span className={`text-[10px] px-2 py-0.5 border font-mono ${
                  isApollo
                    ? (apolloLandingDone ? 'border-cyan-400 bg-cyan-950/70 text-cyan-300' : 'border-amber-400 bg-amber-950/70 text-amber-300 animate-pulse')
                    : isFlying
                    ? 'border-amber-400/80 bg-amber-950/60 text-amber-300'
                    : 'border-emerald-500/60 bg-emerald-950/60 text-emerald-300'
                }`}>
                  {isApollo
                    ? (apolloLandingDone ? t('surface.badge.astronaut') : t('surface.badge.landing'))
                    : isFlying
                    ? t('surface.badge.flight')
                    : t('surface.badge.rover')}
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
              title={isMars ? t('surface.audio.mars.title') : t('surface.audio.moon.title')}
            >
              {isAmbientPlaying ? (isMars ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <Radio className="w-3.5 h-3.5 text-cyan-400" />) : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isMars ? t('surface.audio.mars.label') : t('surface.audio.moon.label')}</span>
            </button>

            <button
              onClick={onClose}
              aria-label={t('surface.close')}
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
              <span>{isApollo ? (apolloLandingDone ? t('surface.telemetry.astronaut') : t('surface.telemetry.lem')) : (isFlying ? t('surface.telemetry.flight') : t('surface.telemetry.surface'))}</span>
              <span className="text-amber-400">{isApollo && !apolloLandingDone ? t('surface.telemetry.dpsActive') : t('surface.telemetry.radarActive')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{isApollo ? (apolloLandingDone ? t('surface.telemetry.stepSpeed') : t('surface.telemetry.speed')) : (isFlying ? t('surface.telemetry.flightSpeed') : t('surface.telemetry.speed'))}</span>
              <span className="font-bold text-amber-300">{telemetry.speedKmh} km/h</span>
            </div>
            {((isApollo && !apolloLandingDone) || isFlying) && (
              <div className="flex justify-between">
                <span className="text-slate-400">{t('surface.telemetry.altitude')}</span>
                <span className="font-bold text-cyan-300">{telemetry.altitude} m {isApollo ? t('surface.telemetry.overRegolith') : t('surface.telemetry.overDunes')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">{t('surface.telemetry.heading')}</span>
              <span className="font-bold text-white">{telemetry.headingDeg}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{t('surface.telemetry.terrain')}</span>
              <span className="font-bold text-emerald-200">{telemetry.elevation} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{t('surface.telemetry.coords')}</span>
              <span className="font-mono text-[10px] text-cyan-300">X: {telemetry.x} | Z: {telemetry.z}</span>
            </div>
            {isApollo && !apolloLandingDone && (
              <div className="border-t border-amber-500/40 pt-1 text-[10px] text-amber-300 font-bold animate-pulse">
                {t('surface.telemetry.descendHint')}
              </div>
            )}
          </div>

          {/* Top-Right Mission Tracker HUD Panel */}
          <div className="pointer-events-auto absolute top-3 right-3 bg-black/90 border border-cyan-500/50 p-2.5 text-[11px] sm:text-xs text-slate-200 shadow-2xl backdrop-blur-md max-w-xs sm:max-w-sm">
            <div className="border-b border-cyan-500/30 pb-1 mb-2 flex items-center justify-between">
              <span className="font-bold text-cyan-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isApollo ? t('surface.mission.moon') : isOpportunity ? t('surface.mission.opportunity') : t('surface.mission.mars')}</span>
              </span>
              <span className="text-amber-400 font-bold px-1.5 py-0.5 bg-amber-950/60 border border-amber-500/40 text-[10px]">
                {t('surface.mission.objectives', { collected: collectedSampleIds.length, total: activeMissionTargets.length })}
              </span>
            </div>

            <div className="space-y-1.5">
              {missionTargets.map((target) => {
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
                        <span className="text-emerald-400 font-bold">{t('surface.target.completed')}</span>
                      ) : (
                        <span className="text-cyan-300 font-mono">
                          {isNear ? `${proximityInfo.distance}m` : t('surface.target.radar')}
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
                {t('surface.landing.kicker')}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                {t('surface.landing.quote')}
              </h3>
              <p className="text-xs text-amber-300">
                {t('surface.landing.author')}
              </p>
              <div className="mt-2 text-[11px] text-slate-300 border-t border-emerald-500/40 pt-1">
                {t('surface.landing.body')}
              </div>
            </div>
          )}

          {/* HISTORIC BANNER 2: UN PEQUEÑO PASO */}
          {showFirstStepBanner && (
            <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 bg-black/95 border-2 border-cyan-400 p-4 text-center shadow-[0_0_35px_rgba(0,240,255,0.7)] backdrop-blur-xl z-40 max-w-lg w-[92%] animate-pulse">
              <div className="text-xs uppercase font-bold text-cyan-400 tracking-wider mb-1">
                {t('surface.firstStep.kicker')}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                {t('surface.firstStep.quote')}
              </h3>
              <p className="text-xs text-cyan-300">
                {t('surface.firstStep.author')}
              </p>
            </div>
          )}

          {/* INTERACTIVE ACTION PROMPT BANNER */}
          {proximityInfo.targetInRange && !isSamplingActive && (
            <div className="pointer-events-auto absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/95 border-2 border-amber-400 p-3 sm:p-4 text-center shadow-[0_0_25px_rgba(245,158,11,0.5)] backdrop-blur-xl animate-bounce max-w-md w-[92%] sm:w-auto z-30">
              <div className="text-[10px] uppercase font-bold text-amber-300 tracking-wider flex items-center justify-center space-x-1.5 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>{t('surface.prompt.kicker')}</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mb-2">
                {localizeValue(proximityInfo.targetInRange.name)}
              </h3>
              <SciFiButton
                size="lg"
                onClick={() => triggerSampling(proximityInfo.targetInRange)}
                className="w-full"
                icon={<span className="text-[10px] font-bold leading-none">E</span>}
              >
                {isApollo ? t('surface.prompt.astronautAction') : t('surface.prompt.drillAction')}
              </SciFiButton>
            </div>
          )}

          {/* ACTIVE OPERATION DIALOG */}
          {isSamplingActive && samplingTarget && (
            <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="w-full max-w-md border-2 border-cyan-400 bg-black/95 p-5 text-white shadow-[0_0_30px_rgba(0,240,255,0.4)] font-mono text-center space-y-4">
                <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                  {isApollo ? t('surface.sampling.eva') : t('surface.sampling.science')}
                </div>
                <h3 className="text-lg font-bold text-white">
                  {localizeValue(samplingTarget.name)}
                </h3>

                <div className="w-full bg-slate-900 border border-cyan-500/50 h-3 p-0.5">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${samplingProgress}%` }}
                  />
                </div>

                <div className="text-xs text-amber-300 font-bold">
                  {isApollo ? (
                    samplingStep === 1 ? t('surface.sampling.eva.step1') :
                    samplingStep === 2 ? t('surface.sampling.eva.step2') :
                    t('surface.sampling.eva.step3')
                  ) : (
                    samplingStep === 1 ? t('surface.sampling.mars.step1') :
                    samplingStep === 2 ? t('surface.sampling.mars.step2') :
                    t('surface.sampling.mars.step3')
                  )}
                </div>

                <p className="text-[11px] text-slate-400">
                  {t('surface.sampling.tool')} <span className="text-emerald-300">{localizeValue(samplingTarget.tool)}</span>
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
                    <span>{isApollo ? t('surface.dossier.historicTitle') : t('surface.dossier.sampleTitle')}</span>
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold">
                    {localizeValue(dossierTarget.tubeId)}
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{localizeValue(dossierTarget.name)}</h3>
                  <p className="text-xs text-cyan-300">{localizeValue(dossierTarget.type)}</p>
                </div>

                <div className="space-y-2 text-xs text-slate-300 leading-relaxed border-y border-slate-800 py-3">
                  <p><strong className="text-emerald-400">{t('surface.dossier.finding')}</strong> {localizeValue(dossierTarget.summary)}</p>
                  <p><strong className="text-amber-400">{isApollo ? t('surface.dossier.engineering') : t('surface.dossier.mineralogy')}</strong> {localizeValue(dossierTarget.mineralogy)}</p>
                  <p><strong className="text-cyan-400">{t('surface.dossier.science')}</strong> {localizeValue(dossierTarget.scienceValue)}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    {t('surface.dossier.completed')} <strong className="text-white">{collectedSampleIds.length}/{activeMissionTargets.length}</strong>
                  </span>
                  <SciFiButton onClick={() => setDossierTarget(null)} showArrow={false}>
                    {t('surface.dossier.continue')}
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
                <span>{isApollo ? t('surface.complete.moon.title') : t('surface.complete.mars.title')}</span>
              </div>
              <p className="text-[10px] text-slate-300 mt-1">
                {isApollo ? t('surface.complete.moon.body') : t('surface.complete.mars.body')}
              </p>
            </div>
          )}

          {/* Touch / Mouse On-Screen Controls */}
          {!dossierTarget && !isSamplingActive && (
            <div className="absolute bottom-4 right-4 flex items-end space-x-2 pointer-events-auto">
            {/* Descent / Climb controls (For LEM Landing or Ingenuity Drone) */}
            {((isApollo && !apolloLandingDone) || isFlying) && (
              <div className="flex flex-col space-y-1 bg-black/90 p-2 border border-amber-500/50">
                <span className="text-[9px] text-amber-300 text-center font-bold">{isApollo ? t('surface.controls.dpsThrust') : t('surface.controls.altitude')}</span>
                <button
                  onMouseDown={() => sendKey('KeyR', true)}
                  onMouseUp={() => sendKey('KeyR', false)}
                  onTouchStart={() => sendKey('KeyR', true)}
                  onTouchEnd={() => sendKey('KeyR', false)}
                  aria-label={t('surface.controls.ascendAria')}
                  className="px-3 py-2 bg-amber-950/80 hover:bg-amber-800 border border-amber-400 text-white font-bold text-xs"
                >
                  {isApollo ? t('surface.controls.brake') : t('surface.controls.climb')}
                </button>
                <button
                  onMouseDown={() => sendKey('KeyF', true)}
                  onMouseUp={() => sendKey('KeyF', false)}
                  onTouchStart={() => sendKey('KeyF', true)}
                  onTouchEnd={() => sendKey('KeyF', false)}
                  aria-label={t('surface.controls.descendAria')}
                  className="px-3 py-2 bg-amber-950/80 hover:bg-amber-800 border border-amber-400 text-white font-bold text-xs"
                >
                  {t('surface.controls.descend')}
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
                aria-label={t('surface.controls.forwardAria')}
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
                aria-label={t('surface.controls.leftAria')}
                className="px-3 py-2.5 bg-emerald-950/80 hover:bg-emerald-800 border border-emerald-400/80 text-white font-bold text-xs"
              >
                ◄
              </button>
              <button
                onMouseDown={() => sendKey('KeyS', true)}
                onMouseUp={() => sendKey('KeyS', false)}
                onTouchStart={() => sendKey('KeyS', true)}
                onTouchEnd={() => sendKey('KeyS', false)}
                aria-label={t('surface.controls.backAria')}
                className="px-3 py-2.5 bg-emerald-950/80 hover:bg-emerald-800 border border-emerald-400/80 text-white font-bold text-xs"
              >
                ▼
              </button>
              <button
                onMouseDown={() => sendKey('KeyD', true)}
                onMouseUp={() => sendKey('KeyD', false)}
                onTouchStart={() => sendKey('KeyD', true)}
                onTouchEnd={() => sendKey('KeyD', false)}
                aria-label={t('surface.controls.rightAria')}
                className="px-3 py-2.5 bg-emerald-950/80 hover:bg-emerald-800 border border-emerald-400/80 text-white font-bold text-xs"
              >
                ►
              </button>
              </div>
            </div>
          )}

        </div>

        {/* 3. Footer Bar */}
        <footer className="border-t border-emerald-500/30 bg-black/95 px-3 py-2 text-center sm:text-left text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="font-bold text-emerald-400">{t('surface.footer.controls')}</span>
            {isApollo && !apolloLandingDone ? (
              <span> {t('surface.footer.lem.pre')} <strong className="text-white">[W / A / S / D]</strong>{t('surface.footer.lem.afterSpeed')} <strong className="text-amber-300">[Shift / F]</strong>{t('surface.footer.lem.afterDescent')} <strong className="text-amber-300">[Space / R]</strong>{t('surface.footer.lem.tail')}</span>
            ) : isApollo && apolloLandingDone ? (
              <span> {t('surface.footer.eva.pre')} <strong className="text-white">[W / A / S / D]</strong>{t('surface.footer.eva.afterSpeed')} <strong className="text-amber-300">[E]</strong>{t('surface.footer.eva.tail')}</span>
            ) : (
              <span> {t('surface.footer.rover.pre')} <strong className="text-white">[W / A / S / D]</strong>{t('surface.footer.rover.afterSpeed')} <strong className="text-amber-300">[E]</strong>{t('surface.footer.rover.tail')}</span>
            )}
          </div>
          <div className="text-slate-400 text-[10px]">
            {isApollo ? t('surface.footer.location.moon') : isOpportunity ? t('surface.footer.location.opportunity') : isViking ? t('surface.footer.location.viking') : t('surface.footer.location.mars')}
          </div>
        </footer>

      </div>
    </div>
  );
}
