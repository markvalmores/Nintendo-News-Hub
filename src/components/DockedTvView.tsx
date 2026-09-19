import React from "react";
import { soundEngine } from "../utils/audio";
import { Tv, Sparkles, Volume2, ShieldCheck, ArrowDownToLine } from "lucide-react";

interface DockedTvViewProps {
  onUndock: () => void;
  activeBannerColor?: string;
  children: React.ReactNode;
}

export const DockedTvView: React.FC<DockedTvViewProps> = ({
  onUndock,
  activeBannerColor = "from-red-600 via-purple-600 to-cyan-600",
  children,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden">
      {/* 1. Living Room Ambient Wall Backlight (Ambilight) */}
      <div 
        className={`absolute inset-0 bg-gradient-to-tr ${activeBannerColor} opacity-25 blur-3xl transition-all duration-1000 scale-125 pointer-events-none`}
      />

      {/* 2. Television Stand / Bezel */}
      <div className="relative z-10 w-full max-w-5xl h-full max-h-[92%] flex flex-col items-center justify-between">
        
        {/* TV Top Frame with Ambient Light */}
        <div className="w-full flex items-center justify-between px-4 py-1.5 bg-neutral-900/90 border border-neutral-800 rounded-t-2xl backdrop-blur text-neutral-300 text-xs shadow-lg">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-white font-mono tracking-wide">
              HDMI 2.1 — 4K UHD 120Hz VRR
            </span>
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              HDR10+ / Dolby Atmos
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundEngine.playSwitchSnap();
                onUndock();
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              title="Undock console to Handheld mode"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Undock Switch 2 (ZL)</span>
            </button>
          </div>
        </div>

        {/* 3. The TV Screen containing the live Nintendo News OS */}
        <div className="relative w-full flex-1 bg-neutral-950 border-x-4 border-b-4 border-neutral-800 rounded-b-2xl shadow-2xl overflow-hidden flex flex-col">
          {children}
        </div>

        {/* 4. Sleek Soundbar / TV Base */}
        <div className="w-48 sm:w-72 h-3 bg-neutral-800 rounded-b-lg border-t border-neutral-700 shadow-md mt-1 flex items-center justify-center">
          <div className="w-32 h-1 bg-neutral-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};
