import React from 'react';
import { X, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import SciFiButton from './ui/SciFiButton';
import SciFiTag from './ui/SciFiTag';

export default function BadgesModal({ isOpen, onClose, artifacts, scannedIds }) {
  if (!isOpen) return null;

  const isCompleted = scannedIds.length === artifacts.length;

  const triggerCertificate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono">
      <div className="relative w-full max-w-xl bg-space-950 border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,240,255,0.2)]">

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-space-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 pr-9">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-none">
            <Award className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-white tracking-wider">CADET LOG: SPACE ARCHAEOLOGIST</h2>
            <p className="text-xs text-slate-400">Field Telemetry Progress // Team Eclipse</p>
          </div>
          <SciFiTag
            type={isCompleted ? 'success' : 'neutral'}
            shape="cut-edge"
            showArrow={false}
            className="flex-none"
          >
            {scannedIds.length}/{artifacts.length}
          </SciFiTag>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 bg-space-900 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-xs text-slate-300 mb-1.5">
            <span>Hardware Diagnostic Progress</span>
            <span className="font-bold text-cyan-400">{scannedIds.length} / {artifacts.length} Complete</span>
          </div>
          <div className="w-full h-2 bg-space-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-500"
              style={{ width: `${(scannedIds.length / artifacts.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Artifact Badges List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {artifacts.map((art) => {
            const isScanned = scannedIds.includes(art.id);
            return (
              <div
                key={art.id}
                className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  isScanned
                    ? 'bg-cyan-950/30 border-cyan-500/40'
                    : 'bg-space-900/30 border-slate-800/80 opacity-70'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <span className={`text-xs font-bold truncate block ${isScanned ? 'text-slate-100' : 'text-slate-400'}`}>
                    {art.name}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">{art.body}</span>
                </div>
                <SciFiTag
                  type={isScanned ? 'success' : 'neutral'}
                  shape="cut-edge"
                  showArrow={false}
                  className="flex-none"
                >
                  {isScanned ? 'Done' : 'Locked'}
                </SciFiTag>
              </div>
            );
          })}
        </div>

        {/* Completion Box */}
        {isCompleted ? (
          <div className="bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-transparent p-4 rounded-xl border border-amber-500/30 flex flex-col items-center text-center space-y-2">
            <div className="flex items-center space-x-2 text-amber-300 text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <span>OFFICIAL CLEARANCE: JUNIOR ARTIFACT CURATOR</span>
            </div>
            <p className="text-xs text-slate-300 font-sans max-w-md">
              Congratulations! You have completed the technical diagnostics of NASA's lunar and Martian legacy hardware.
            </p>
            <SciFiButton size="lg" onClick={triggerCertificate} className="mt-2">
              Celebrate Certification
            </SciFiButton>
          </div>
        ) : (
          <p className="text-center text-xs text-slate-500">
            Inspect all relics in the 3D viewer to earn your certification seal.
          </p>
        )}

      </div>
    </div>
  );
}
