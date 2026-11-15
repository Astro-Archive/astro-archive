import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Viewer3D from './components/Viewer3D';
import TelemetryHUD from './components/TelemetryHUD';
import BadgesModal from './components/BadgesModal';
import { ARTIFACTS } from './data/artifactsData';
import { ChevronLeft, ChevronRight, Sparkles, MapPin, Radio, Terminal } from 'lucide-react';

export default function App() {
  const [filter, setFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(ARTIFACTS[0].id);
  const [scannedIds, setScannedIds] = useState([ARTIFACTS[0].id]);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);

  // Filter artifacts
  const filteredArtifacts = ARTIFACTS.filter((art) => {
    if (filter === 'All') return true;
    return art.body.toLowerCase() === filter.toLowerCase();
  });

  // Keep selected artifact in sync with filter
  useEffect(() => {
    if (!filteredArtifacts.some((a) => a.id === selectedId)) {
      if (filteredArtifacts.length > 0) {
        setSelectedId(filteredArtifacts[0].id);
      }
    }
  }, [filter]);

  // Track scanned relics in state
  const handleSelectArtifact = (id) => {
    setSelectedId(id);
    if (!scannedIds.includes(id)) {
      setScannedIds((prev) => [...prev, id]);
    }
  };

  const currentArtifact = ARTIFACTS.find((a) => a.id === selectedId) || ARTIFACTS[0];
  const currentIndex = filteredArtifacts.findIndex((a) => a.id === selectedId);

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % filteredArtifacts.length;
    handleSelectArtifact(filteredArtifacts[nextIdx].id);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + filteredArtifacts.length) % filteredArtifacts.length;
    handleSelectArtifact(filteredArtifacts[prevIdx].id);
  };

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col font-mono selection:bg-cyan-500 selection:text-black">
      
      {/* Navigation */}
      <Navbar
        activeFilter={filter}
        setFilter={setFilter}
        unlockedCount={scannedIds.length}
        totalCount={ARTIFACTS.length}
        onOpenBadges={() => setIsBadgesOpen(true)}
      />

      {/* Main Mission Control Screen */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 flex flex-col space-y-6">
        
        {/* Artifact Selector Ribbon */}
        <div className="flex items-center justify-between bg-space-900/60 p-2.5 rounded-2xl border border-slate-800 backdrop-blur-md">
          
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-space-950/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all flex items-center space-x-1 text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev Relic</span>
          </button>

          {/* Selector Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto py-1 px-2 no-scrollbar">
            {filteredArtifacts.map((art) => {
              const isSelected = art.id === selectedId;
              const isScanned = scannedIds.includes(art.id);
              return (
                <button
                  key={art.id}
                  onClick={() => handleSelectArtifact(art.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center space-x-2 flex-shrink-0 ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                      : 'bg-space-950/60 text-slate-400 border border-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <span className="text-sm">{art.body === 'Moon' ? '🌙' : '🔴'}</span>
                  <span className="font-bold truncate max-w-[140px] sm:max-w-none">{art.name}</span>
                  {isScanned && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-space-950/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all flex items-center space-x-1 text-xs"
          >
            <span className="hidden sm:inline">Next Relic</span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: 3D Tactical Visor (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <Viewer3D
              artifact={currentArtifact}
              onInspectHardware={() => setIsInspecting(true)}
            />

            {/* Quick Context Pill */}
            <div className="bg-space-900/40 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Sector: {currentArtifact.location}</span>
              </div>
              <span className="text-[11px] text-amber-400/90 font-mono">
                {currentArtifact.body.toUpperCase()} HISTORIC PRESERVE
              </span>
            </div>
          </div>

          {/* Right Column: Telemetry & Hardware HUD (5 cols on lg) */}
          <div className="lg:col-span-5">
            <TelemetryHUD
              artifact={currentArtifact}
              isInspecting={isInspecting}
              setIsInspecting={setIsInspecting}
            />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-space-950/80 px-4 py-4 text-center text-xs text-slate-500">
        <p>NASA Space Apps Challenge 2026 // Team Eclipse</p>
        <p className="text-[10px] text-slate-600 mt-1">
          Open NASA Data & 3D Assets used under NASA Open Media Guidelines. Built with React & WebGL.
        </p>
      </footer>

      {/* Badges & Passport Modal */}
      <BadgesModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        artifacts={ARTIFACTS}
        scannedIds={scannedIds}
      />

    </div>
  );
}
