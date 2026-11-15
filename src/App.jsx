import React, { useState, useRef } from 'react';
import SpaceSimulator from './components/SpaceSimulator';
import SpaceXHUD from './components/SpaceXHUD';
import BadgesModal from './components/BadgesModal';
import SurfaceExplorer from './components/SurfaceExplorer';
import { ARTIFACTS } from './data/artifactsData';

export default function App() {
  const [selectedTarget, setSelectedTarget] = useState('OVERVIEW');
  const [isFlightMode, setIsFlightMode] = useState(false);
  const [flightVelocity, setFlightVelocity] = useState('0.0');
  const [scannedIds, setScannedIds] = useState([]);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSurfaceOpen, setIsSurfaceOpen] = useState(false);
  const [settings, setSettings] = useState({ showOrbits: true, reducedMotion: false, highContrast: false });
  const audioRef = useRef(null);

  const getActiveAudio = () => {
    if (selectedTarget === 'APOLLO') return '/audio/eagle_landed.mp3';
    return '/audio/space_ambient.mp3';
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
      audioRef.current = new Audio(src);
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
  };
  const selectedArtifact = ARTIFACTS.find((artifact) => artifact.id === artifactTargetIds[selectedTarget]);
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
        settings={settings}
      />

      {/* 2. Space Engine Inspired Sharp HUD Overlay */}
      <SpaceXHUD
        selectedTarget={selectedTarget}
        onSelectTarget={handleSelectTarget}
        isFlightMode={isFlightMode}
        onToggleFlightMode={handleToggleFlightMode}
        flightVelocity={flightVelocity}
        artifacts={ARTIFACTS}
        onOpenBadges={() => setIsBadgesOpen(true)}
        scannedCount={scannedIds.length}
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={handleToggleAudio}
        onOpenSurface={() => selectedArtifact && setIsSurfaceOpen(true)}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      {/* 3. Badges & Cadet Certification Modal */}
      <BadgesModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        artifacts={ARTIFACTS}
        scannedIds={scannedIds}
      />

      {isSurfaceOpen && selectedArtifact && (
        <SurfaceExplorer artifact={selectedArtifact} onClose={() => setIsSurfaceOpen(false)} />
      )}

    </div>
  );
}
