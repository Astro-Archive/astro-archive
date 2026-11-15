import React, { useState, useEffect, useRef } from 'react';
import SpaceSimulator from './components/SpaceSimulator';
import SpaceXHUD from './components/SpaceXHUD';
import BadgesModal from './components/BadgesModal';
import { ARTIFACTS } from './data/artifactsData';

export default function App() {
  const [selectedArtifact, setSelectedArtifact] = useState(ARTIFACTS[0]);
  const [viewMode, setViewMode] = useState('RELIC'); // Default to close-up relic view
  const [isSimulatingMission, setIsSimulatingMission] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [scannedIds, setScannedIds] = useState([ARTIFACTS[0].id]);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [manualVector, setManualVector] = useState(null);
  const audioRef = useRef(null);

  // Stop previous audio when artifact changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlayingAudio(false);
  }, [selectedArtifact.id]);

  const handleSelectArtifact = (artifact) => {
    setSelectedArtifact(artifact);
    setViewMode('RELIC');
    if (!scannedIds.includes(artifact.id)) {
      setScannedIds((prev) => [...prev, artifact.id]);
    }
  };

  const handleStartSimulation = () => {
    setIsSimulatingMission(true);
    setSimProgress(0);

    // Auto-play historic audio when simulation starts!
    if (!isPlayingAudio && selectedArtifact.audioSample) {
      if (!audioRef.current) {
        audioRef.current = new Audio(selectedArtifact.audioSample);
        audioRef.current.onended = () => setIsPlayingAudio(false);
      }
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((e) => console.warn("Audio autoplay policy:", e));
    }
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(selectedArtifact.audioSample);
        audioRef.current.onended = () => setIsPlayingAudio(false);
      }
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((e) => console.warn("Audio autoplay policy:", e));
    }
  };

  // Brief manual nudge on flight controls
  const handleManualVector = (vec) => {
    setManualVector(vec);
    setTimeout(() => setManualVector(null), 150);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      
      {/* 1. Fullscreen Three.js WebGL Universe Canvas (Space Engine / SpaceX Simulator) */}
      <SpaceSimulator
        selectedArtifact={selectedArtifact}
        viewMode={viewMode}
        isSimulatingMission={isSimulatingMission}
        onSimulationProgress={(p) => setSimProgress(p)}
        onSimulationEnd={() => setIsSimulatingMission(false)}
        simProgress={simProgress}
        manualVector={manualVector}
      />

      {/* 2. SpaceX ISS Docking Simulator Style HUD Overlay */}
      <SpaceXHUD
        artifacts={ARTIFACTS}
        selectedArtifact={selectedArtifact}
        onSelectArtifact={handleSelectArtifact}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isSimulatingMission={isSimulatingMission}
        onStartSimulation={handleStartSimulation}
        simProgress={simProgress}
        onOpenBadges={() => setIsBadgesOpen(true)}
        scannedCount={scannedIds.length}
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={handleToggleAudio}
        onManualVector={handleManualVector}
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
