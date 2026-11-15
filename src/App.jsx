import React, { useState, useEffect, useRef } from 'react';
import SpaceSimulator from './components/SpaceSimulator';
import SpaceXHUD from './components/SpaceXHUD';
import BadgesModal from './components/BadgesModal';
import { ARTIFACTS } from './data/artifactsData';

export default function App() {
  const [selectedTarget, setSelectedTarget] = useState('OVERVIEW');
  const [isFlightMode, setIsFlightMode] = useState(false);
  const [scannedIds, setScannedIds] = useState(['apollo11', 'ingenuity']);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);

  const getActiveAudio = () => {
    if (selectedTarget === 'APOLLO') return '/audio/eagle_landed.mp3';
    return '/audio/space_ambient.mp3';
  };

  const handleSelectTarget = (target) => {
    setSelectedTarget(target);
    setIsFlightMode(false); // Disengage flight mode when locking onto a new body

    // Track badges
    if (target === 'APOLLO' && !scannedIds.includes('apollo11')) {
      setScannedIds(prev => [...prev, 'apollo11']);
    } else if (target === 'INGENUITY' && !scannedIds.includes('ingenuity')) {
      setScannedIds(prev => [...prev, 'ingenuity']);
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

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      
      {/* 1. Fullscreen Three.js WebGL Universe Canvas (Smooth 60FPS Space Engine with Orbiting Planets & Spacecraft) */}
      <SpaceSimulator
        selectedTarget={selectedTarget}
        onSelectTarget={handleSelectTarget}
        isFlightMode={isFlightMode}
      />

      {/* 2. SpaceX ISS Docking Simulator Style HUD Overlay */}
      <SpaceXHUD
        selectedTarget={selectedTarget}
        onSelectTarget={handleSelectTarget}
        isFlightMode={isFlightMode}
        onToggleFlightMode={handleToggleFlightMode}
        artifacts={ARTIFACTS}
        onOpenBadges={() => setIsBadgesOpen(true)}
        scannedCount={scannedIds.length}
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={handleToggleAudio}
      />

      {/* 3. Badges & Cadet Certification Modal */}
      <BadgesModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        artifacts={ARTIFACTS}
        scannedIds={scannedIds}
      />

    </div>
  );
}
