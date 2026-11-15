import React, { useState } from 'react';
import { 
  Compass, Radio, Volume2, VolumeX, Play, RotateCcw, 
  ChevronRight, ChevronLeft, Award, ExternalLink, Activity, 
  Sparkles, Layers, Maximize2, ShieldCheck, Terminal, Crosshair,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Eye, RefreshCw
} from 'lucide-react';

export default function SpaceXHUD({
  artifacts,
  selectedArtifact,
  onSelectArtifact,
  viewMode,
  setViewMode,
  isSimulatingMission,
  onStartSimulation,
  simProgress,
  onOpenBadges,
  scannedCount,
  isPlayingAudio,
  onToggleAudio,
  onManualVector
}) {
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false); // Default collapsed so users see the glorious 3D space immediately!
  const [showFlightPad, setShowFlightPad] = useState(true);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 sm:p-5 select-none font-mono">
      
      {/* 1. TOP BAR: SpaceX-Style Celestial Mission Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        
        {/* Brand / Mode Indicator */}
        <div className="flex items-center space-x-3 bg-black/80 backdrop-blur-md border border-cyan-500/40 px-3.5 py-2 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs sm:text-sm tracking-widest text-white">SPACEX-STYLE SIMULATOR</span>
              <span className="text-[10px] bg-cyan-950 border border-cyan-500/50 text-cyan-300 px-1.5 py-0.2 rounded font-mono">
                SIM // v3.0
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              TARGET LOCK: <span className="text-cyan-300 font-bold">{selectedArtifact ? selectedArtifact.name.toUpperCase() : 'DEEP SPACE'}</span>
            </div>
          </div>
        </div>

        {/* Orbit / Camera Views */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 bg-black/85 backdrop-blur-md p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode(viewMode === 'OVERVIEW' ? 'RELIC' : 'OVERVIEW')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              viewMode === 'OVERVIEW'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{viewMode === 'OVERVIEW' ? 'Spacecraft Close-up' : 'Wide Orbital View'}</span>
          </button>
        </div>

        {/* Cadet Log / Badges Button */}
        <button
          onClick={onOpenBadges}
          className="flex items-center space-x-2 text-xs bg-black/80 hover:bg-cyan-950/50 backdrop-blur-md border border-cyan-500/40 px-3.5 py-2 rounded-xl text-cyan-300 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Cadet Log:</span>
          <span className="font-bold text-amber-400">{scannedCount}/{artifacts.length} Discovered</span>
        </button>

      </div>

      {/* 2. CENTER: SpaceX ISS Crosshair Reticle & Target Lock */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        
        {/* Reticle Circle */}
        <div className="relative w-52 h-52 sm:w-72 sm:h-72 border border-cyan-500/25 rounded-full flex items-center justify-center">
          {/* Inner ticks */}
          <div className="absolute inset-3 border border-dashed border-cyan-500/20 rounded-full"></div>
          
          {/* Crosshair Lines */}
          <div className="w-full h-[1px] bg-cyan-500/20"></div>
          <div className="h-full w-[1px] bg-cyan-500/20 absolute"></div>

          {/* Center Precision Target Box */}
          <div className="w-8 h-8 border border-cyan-400/80 rounded-md absolute flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>

          {/* SpaceX Pitch & Yaw Degree Markers */}
          <div className="absolute top-2 text-[9px] text-cyan-400/80 font-mono tracking-widest">+05° PITCH</div>
          <div className="absolute bottom-2 text-[9px] text-cyan-400/80 font-mono tracking-widest">-05° PITCH</div>
          <div className="absolute left-2 text-[9px] text-cyan-400/80 font-mono tracking-widest">-02° YAW</div>
          <div className="absolute right-2 text-[9px] text-cyan-400/80 font-mono tracking-widest">+02° YAW</div>
        </div>

        {/* Real-time Distance & Speed Vector (SpaceX Style) */}
        <div className="absolute top-20 sm:top-24 text-center">
          <div className="text-[10px] text-cyan-300 tracking-widest bg-black/75 px-3 py-1 rounded-full border border-cyan-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            ALTITUDE: {isSimulatingMission ? `${(3.0 * (1 - simProgress)).toFixed(1)} M` : '0.0 M (SURFACE)'} // RATE: {isSimulatingMission ? '1.25 M/S' : '0.00 M/S'} // ATTITUDE: NOMINAL
          </div>
        </div>

      </div>

      {/* 3. FLIGHT CONTROL PADS: SpaceX ISS Simulator Manual Dials (Bottom Left) */}
      {showFlightPad && (
        <div className="absolute left-4 bottom-20 pointer-events-auto hidden md:flex flex-col space-y-2 bg-black/75 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-xs">
          <div className="text-[9px] text-slate-400 uppercase tracking-widest text-center border-b border-slate-800 pb-1">
            Manual Flight Controls
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div></div>
            <button
              onClick={() => onManualVector && onManualVector({ pitch: -1 })}
              className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300"
              title="Pitch Up"
            >
              <ArrowUp className="w-3.5 h-3.5 mx-auto" />
            </button>
            <div></div>

            <button
              onClick={() => onManualVector && onManualVector({ yaw: -1 })}
              className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300"
              title="Yaw Left"
            >
              <ArrowLeft className="w-3.5 h-3.5 mx-auto" />
            </button>
            <div className="text-[9px] flex items-center justify-center text-slate-500 font-bold">ROT</div>
            <button
              onClick={() => onManualVector && onManualVector({ yaw: 1 })}
              className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300"
              title="Yaw Right"
            >
              <ArrowRight className="w-3.5 h-3.5 mx-auto" />
            </button>

            <div></div>
            <button
              onClick={() => onManualVector && onManualVector({ pitch: 1 })}
              className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300"
              title="Pitch Down"
            >
              <ArrowDown className="w-3.5 h-3.5 mx-auto" />
            </button>
            <div></div>
          </div>
          <div className="text-[9px] text-slate-500 text-center">
            Or Click & Drag to Orbit 360°
          </div>
        </div>
      )}

      {/* 4. BOTTOM PANEL: Artifact Selector & Mission Simulation Controller */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 pointer-events-auto">
        
        {/* Artifact Quick Switcher */}
        <div className="flex items-center space-x-1.5 bg-black/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 overflow-x-auto max-w-full">
          {artifacts.map((art) => {
            const isSelected = selectedArtifact && selectedArtifact.id === art.id;
            return (
              <button
                key={art.id}
                onClick={() => onSelectArtifact(art)}
                className={`px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2 transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{art.body === 'Moon' ? '🌙' : '🔴'}</span>
                <span className="font-bold">{art.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controller: Replay Event, Audio & Telemetry Toggle */}
        <div className="flex items-center space-x-2 bg-black/85 backdrop-blur-md p-2 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          
          {/* Mission Event Replay Button */}
          <button
            onClick={onStartSimulation}
            disabled={isSimulatingMission}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              isSimulatingMission
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 animate-pulse'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
            }`}
          >
            <Play className={`w-4 h-4 ${isSimulatingMission ? 'animate-spin' : ''}`} />
            <span>{isSimulatingMission ? `Simulating (${Math.round(simProgress * 100)}%)` : '▶ Replay Historic Event'}</span>
          </button>

          {/* NASA Audio Feed Button */}
          <button
            onClick={onToggleAudio}
            className={`p-2 rounded-xl text-xs border transition-all ${
              isPlayingAudio
                ? 'bg-rose-500/30 text-rose-300 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                : 'bg-space-900 text-cyan-300 border-slate-700 hover:border-cyan-400'
            }`}
            title="Toggle Historical Audio"
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Toggle Telemetry Drawer */}
          <button
            onClick={() => setIsTelemetryOpen(!isTelemetryOpen)}
            className={`p-2 rounded-xl text-xs border transition-all ${
              isTelemetryOpen
                ? 'bg-cyan-500/25 text-cyan-300 border-cyan-400'
                : 'border-slate-700 bg-space-900 text-slate-300 hover:text-white hover:border-cyan-400'
            }`}
            title="Toggle Technical Telemetry"
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline ml-1.5 text-xs">{isTelemetryOpen ? 'Hide Data' : 'Specs'}</span>
          </button>

        </div>

      </div>

      {/* 5. RIGHT SIDE: Collapsible Glassmorphism Telemetry Drawer */}
      {isTelemetryOpen && selectedArtifact && (
        <div className="absolute right-3 sm:right-5 top-20 bottom-24 w-80 sm:w-96 bg-black/85 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 sm:p-5 overflow-y-auto pointer-events-auto shadow-[0_0_35px_rgba(0,0,0,0.9)] animate-slide-left">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div>
              <div className="flex items-center space-x-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  selectedArtifact.statusType === 'green' ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' :
                  selectedArtifact.statusType === 'warning' ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' :
                  'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                }`}></span>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {selectedArtifact.status}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5 tracking-wide">
                {selectedArtifact.name}
              </h2>
            </div>
            
            <button
              onClick={() => setIsTelemetryOpen(false)}
              className="text-slate-500 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          {/* Story & What Happened */}
          <div className="mb-4">
            <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
              Historic Mission Event
            </span>
            <p className="text-xs text-slate-300 font-sans leading-relaxed bg-space-950/60 p-2.5 rounded-xl border border-slate-800">
              {selectedArtifact.theStory}
            </p>
          </div>

          {/* Live Telemetry Matrix */}
          <div className="mb-4">
            <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1.5 flex items-center space-x-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>Diagnostic Telemetry Matrix</span>
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(selectedArtifact.diagnostics).map(([k, v]) => (
                <div key={k} className="bg-space-950/80 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[9px] text-slate-500 uppercase block truncate">
                    {k.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="font-semibold text-slate-200 text-[11px] truncate block">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hardware Deconstructed */}
          <div className="mb-4">
            <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1.5">
              Engineering Deconstructed (Ages 10-16)
            </span>
            <div className="space-y-2">
              {selectedArtifact.engineeringBreakdown.map((item, idx) => (
                <div key={idx} className="bg-space-950/70 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-bold text-slate-200">{item.title}</span>
                    <span className="text-[9px] px-1 rounded bg-slate-900 border border-slate-700 text-amber-300">
                      {item.specs}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* NASA Open Science Link */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">NASA Open Science Directorate</span>
            <a
              href={selectedArtifact.officialNasaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-200 underline flex items-center space-x-1"
            >
              <span>Mission Archive</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

        </div>
      )}

    </div>
  );
}
