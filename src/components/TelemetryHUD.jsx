import React, { useState } from 'react';
import { Activity, Cpu, Radio, ExternalLink, Volume2, VolumeX, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function TelemetryHUD({ artifact, isInspecting, setIsInspecting }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const toggleAudio = () => {
    // Basic web audio trigger or placeholder alert
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <div className="flex flex-col space-y-4 font-mono">
      
      {/* Header Info */}
      <div className="bg-space-900/80 border border-slate-800 p-4 lg:p-5 rounded-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${
              artifact.statusType === 'green' ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]' :
              artifact.statusType === 'warning' ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]' :
              'bg-rose-500 shadow-[0_0_10px_#f43f5e]'
            }`}></span>
            <span className="text-xs uppercase font-bold text-slate-300">
              STATUS: {artifact.status}
            </span>
          </div>
          <span className="text-xs text-cyan-400/90 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            {artifact.missionTime}
          </span>
        </div>

        <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white mb-1">
          {artifact.name}
        </h1>
        <p className="text-xs text-slate-400 mb-3">
          Site: <span className="text-slate-200">{artifact.location}</span> ({artifact.coordinates})
        </p>

        <p className="text-xs leading-relaxed text-slate-300 border-l-2 border-cyan-500/50 pl-3 py-0.5">
          {artifact.theStory}
        </p>
      </div>

      {/* Diagnostics Grid */}
      <div className="bg-space-900/60 border border-slate-800/80 p-4 rounded-xl">
        <div className="text-[11px] uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5 mb-3 font-bold">
          <Activity className="w-3.5 h-3.5" />
          <span>Diagnostic Telemetry</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          {Object.entries(artifact.diagnostics).map(([key, value]) => (
            <div key={key} className="bg-space-950/70 p-2.5 rounded-lg border border-slate-800/60">
              <span className="text-[10px] text-slate-500 uppercase block mb-0.5">
                {key.replace(/([A-Z])/g, ' $1')}
              </span>
              <span className="font-semibold text-slate-200 text-xs truncate block">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Audio Signal / Sound Feed */}
      <div className="bg-space-900/60 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 block font-bold">Acoustic / Radio Archive</span>
            <span className="text-xs text-slate-200">{artifact.audioTitle}</span>
          </div>
        </div>

        <button
          onClick={toggleAudio}
          className={`px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 border transition-all ${
            isPlayingAudio
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30'
          }`}
        >
          {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span>{isPlayingAudio ? 'Stop Feed' : 'Simulate Feed'}</span>
        </button>
      </div>

      {/* Engineering Breakdown (Hardware Specs for 10-16 yo) */}
      <div className="bg-space-900/60 border border-slate-800/80 p-4 rounded-xl">
        <div className="text-[11px] uppercase tracking-wider text-amber-400 flex items-center space-x-1.5 mb-3 font-bold">
          <Cpu className="w-3.5 h-3.5" />
          <span>Hardware Deconstructed (Engineering for Explorers)</span>
        </div>

        <div className="space-y-3">
          {artifact.engineeringBreakdown.map((item, idx) => (
            <div key={idx} className="bg-space-950/80 p-3 rounded-lg border border-slate-800/80 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">{item.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300">
                  {item.specs}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Legacy & NASA Data Source */}
      <div className="bg-cyan-950/30 border border-cyan-500/30 p-4 rounded-xl flex flex-col space-y-2">
        <div className="flex items-start space-x-2">
          <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-cyan-300 uppercase block">The Scientific Legacy</span>
            <p className="text-xs text-slate-300 font-sans mt-0.5">{artifact.legacy}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-cyan-900/40 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Validated with NASA Open Science Data</span>
          <a
            href={artifact.officialNasaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-200 transition-colors underline"
          >
            <span>NASA Mission Archive</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

    </div>
  );
}
