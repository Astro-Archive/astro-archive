import React, { useEffect, useMemo, useState, useRef } from 'react';
import SpaceSimulator from './components/SpaceSimulator';
import SpaceXHUD from './components/SpaceXHUD';
import BadgesModal from './components/BadgesModal';
import SurfaceExplorer from './components/SurfaceExplorer';
import HubbleObservatory from './components/HubbleObservatory';
import { getAssetPath } from './utils/assets';
import { isUISoundEnabled, setUISoundEnabled } from './utils/uiSound';
import { useI18n } from './i18n';
import { getArtifacts } from './data/artifactsData';

export default function App() {
  const { lang } = useI18n();
  const artifacts = useMemo(() => getArtifacts(lang), [lang]);
  const [selectedTarget, setSelectedTarget] = useState('OVERVIEW');
  const [isFlightMode, setIsFlightMode] = useState(false);
  const [flightVelocity, setFlightVelocity] = useState('0.0');
  const [flightTelemetry, setFlightTelemetry] = useState(null);
  const [scannedIds, setScannedIds] = useState([]);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSurfaceOpen, setIsSurfaceOpen] = useState(false);
  const [observatoryTelescope, setObservatoryTelescope] = useState(null);
  const [settings, setSettings] = useState({
    showOrbits: true,
    showTrails: true,
    simSpeed: 1,
    reducedMotion: false,
    highContrast: false,
    uiSound: isUISoundEnabled(),
  });
  const audioRef = useRef(null);

  useEffect(() => {
    setUISoundEnabled(settings.uiSound);
  }, [settings.uiSound]);

  const getActiveAudio = () => {
    switch (selectedTarget) {
      case 'APOLLO':
        return '/audio/eagle_landed.mp3';
      case 'MOON':
        return '/audio/one_small_step.mp3';
      case 'INGENUITY':
        return '/audio/ingenuity_flight.wav';
      case 'MARS':
      case 'PERSEVERANCE':
      case 'OPPORTUNITY':
      case 'VIKING':
        return '/audio/mars_wind.wav';
      case 'JUPITER':
        return '/audio/jupiter_waves.wav';
      case 'EARTH':
      case 'ISS':
      case 'HUBBLE':
      case 'JWST':
        return '/audio/we_came_in_peace.mp3';
      default:
        return '/audio/space_ambient.mp3';
    }
  };

  const handleSelectTarget = (target) => {
    setSelectedTarget(target);
    setIsFlightMode(false); // Stop manual flight when clicking a target to allow clean tracking
    setIsSurfaceOpen(false);

    const targetToArtifact = {
      APOLLO: 'apollo11',
      INGENUITY: 'ingenuity',
      OPPORTUNITY: 'opportunity',
      VIKING: 'viking',
      PERSEVERANCE: 'perseverance',
      HUBBLE: 'hubble',
      JWST: 'jwst',
    };
    const artifactId = targetToArtifact[target];
    if (artifactId) {
      setScannedIds(prev => prev.includes(artifactId) ? prev : [...prev, artifactId]);
    }

    // Stop audio on target change
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlayingAudio(false);
    }
  };

  const handleToggleFlightMode = () => {
    setIsFlightMode(!isFlightMode);
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      const src = getActiveAudio();
      audioRef.current = new Audio(getAssetPath(src));
      audioRef.current.onended = () => setIsPlayingAudio(false);
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(e => console.warn("Audio autoplay blocked:", e));
    }
  };

  const artifactTargetIds = {
    APOLLO: 'apollo11',
    INGENUITY: 'ingenuity',
    OPPORTUNITY: 'opportunity',
    VIKING: 'viking',
    PERSEVERANCE: 'perseverance',
    HUBBLE: 'hubble',
    JWST: 'jwst',
  };
  const selectedArtifact = artifacts.find((artifact) => artifact.id === artifactTargetIds[selectedTarget]);
  const updateSettings = (changes) => setSettings((current) => ({ ...current, ...changes }));

  return (
    <div className={`relative w-screen h-screen overflow-hidden bg-black select-none font-mono ${settings.highContrast ? 'contrast-125' : ''}`}>
      
      {/* 1. Fullscreen Three.js WebGL Universe Canvas (Smooth 60FPS Space Engine with Orbiting Planets & Spacecraft) */}
      <SpaceSimulator
        selectedTarget={selectedTarget}
        onSelectTarget={handleSelectTarget}
        isFlightMode={isFlightMode}
        flightVelocity={flightVelocity}
        setFlightVelocity={setFlightVelocity}
        onFlightTelemetry={setFlightTelemetry}
        settings={settings}
      />

      {/* 2. Space Engine Inspired Sharp HUD Overlay */}
      <SpaceXHUD
        selectedTarget={selectedTarget}
        onSelectTarget={handleSelectTarget}
        isFlightMode={isFlightMode}
        onToggleFlightMode={handleToggleFlightMode}
        flightVelocity={flightVelocity}
        flightTelemetry={flightTelemetry}
        artifacts={artifacts}
        onOpenBadges={() => setIsBadgesOpen(true)}
        scannedCount={scannedIds.length}
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={handleToggleAudio}
        onOpenSurface={() => selectedArtifact && setIsSurfaceOpen(true)}
        onOpenHubble={(tel) => setObservatoryTelescope(tel || (selectedTarget === 'JWST' ? 'jwst' : 'hubble'))}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      {/* 3. Badges & Cadet Certification Modal */}
      <BadgesModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        artifacts={artifacts}
        scannedIds={scannedIds}
      />

      {isSurfaceOpen && selectedArtifact && (
        <SurfaceExplorer artifact={selectedArtifact} onClose={() => setIsSurfaceOpen(false)} />
      )}

      {/* 4. Space Telescope Observatory Minigame (Hubble & James Webb) */}
      {observatoryTelescope && (
        <HubbleObservatory 
          initialTelescope={observatoryTelescope}
          onClose={() => setObservatoryTelescope(null)} 
          onUnlockDiscovery={(id) => {
            const key = id.startsWith('webb') ? 'jwst' : 'hubble';
            setScannedIds(prev => prev.includes(key) ? prev : [...prev, key]);
          }}
        />
      )}

    </div>
  );
}
