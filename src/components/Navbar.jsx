import React from 'react';
import { Compass, Award, Globe, Satellite, Terminal } from 'lucide-react';

export default function Navbar({ activeFilter, setFilter, unlockedCount, totalCount, onOpenBadges }) {
  return (
    <header className="border-b border-cyan-900/40 bg-space-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Satellite className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base lg:text-lg tracking-wider text-white">SPACE RELICS</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                Cyber-Archaeology
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">NASA Space Apps Challenge 2026 // Team Eclipse</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-1.5 bg-space-900/90 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setFilter('All')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeFilter === 'All'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Relics
          </button>
          <button
            onClick={() => setFilter('Moon')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1 ${
              activeFilter === 'Moon'
                ? 'bg-slate-300/20 text-slate-100 border border-slate-300/40 shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Moon (2)</span>
          </button>
          <button
            onClick={() => setFilter('Mars')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1 ${
              activeFilter === 'Mars'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(255,183,3,0.2)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Mars (2)</span>
          </button>
        </div>

        {/* Passport / Badges */}
        <button
          onClick={onOpenBadges}
          className="flex items-center space-x-2 text-xs font-mono bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 px-3.5 py-1.5 rounded-lg text-cyan-300 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.25)]"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Cadet Log:</span>
          <span className="font-bold text-amber-400">{unlockedCount}/{totalCount} Scanned</span>
        </button>

      </div>
    </header>
  );
}
