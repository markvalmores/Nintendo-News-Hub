import React, { useState } from "react";
import { ConsoleMode, JoyconTheme, DisplaySettings, GamepadStatus } from "../types";
import { NintendoNewsApp } from "./NintendoNewsApp";
import { soundEngine } from "../utils/audio";
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus, 
  Home, 
  Square,
  Radio,
  Sliders,
  Maximize2
} from "lucide-react";

interface Switch2ConsoleReplicaProps {
  mode: ConsoleMode;
  onSetMode: (mode: ConsoleMode) => void;
  theme: JoyconTheme;
  onSetTheme: (theme: JoyconTheme) => void;
  displaySettings: DisplaySettings;
  onUpdateDisplaySettings: (settings: Partial<DisplaySettings>) => void;
  gamepad: GamepadStatus;
  gamepadAction: string | null;
  onJoyconAction: (action: string) => void;
  tiltAngle?: { x: number; y: number };
}

export const Switch2ConsoleReplica: React.FC<Switch2ConsoleReplicaProps> = ({
  mode,
  onSetMode,
  theme,
  onSetTheme,
  displaySettings,
  onUpdateDisplaySettings,
  gamepad,
  gamepadAction,
  onJoyconAction,
  tiltAngle = { x: 0, y: 0 },
}) => {
  const [leftStickPos, setLeftStickPos] = useState({ x: 0, y: 0 });
  const [rightStickPos, setRightStickPos] = useState({ x: 0, y: 0 });

  const isDetached = mode === "tabletop";

  const handleButtonPress = (action: string) => {
    soundEngine.playMenuBlip(40);
    onJoyconAction(action);
  };

  return (
    <div 
      className="relative w-full max-w-[1340px] flex items-center justify-center p-2 sm:p-4 select-none transition-all duration-700"
      style={{
        transform: `perspective(1200px) rotateX(${tiltAngle.x * 0.25}deg) rotateY(${tiltAngle.y * 0.3}deg)`,
      }}
    >
      {/* Tabletop Kickstand Shadow / Perspective Grounding */}
      {isDetached && (
        <div className="absolute -bottom-8 w-[75%] h-8 bg-black/60 blur-xl rounded-full pointer-events-none" />
      )}

      {/* ENTIRE UNIFIED CONSOLE HOUSING */}
      <div className="relative flex items-stretch justify-center w-full transition-all duration-500">
        
        {/* ============================================================ */}
        {/* 1. LEFT JOY-CON (Matte Black with Vibrant Neon Red Thumbstick) */}
        {/* ============================================================ */}
        <div
          className={`relative z-20 flex flex-col justify-between w-20 sm:w-28 md:w-32 lg:w-36 py-4 px-2 sm:px-3 bg-gradient-to-b from-[#1a1b20] via-[#141518] to-[#121316] border border-[#262830] rounded-l-[32px] sm:rounded-l-[40px] shadow-2xl transition-all duration-500 ${
            isDetached 
              ? "-translate-x-6 sm:-translate-x-12 rotate-[-6deg] shadow-[0_20px_40px_rgba(0,0,0,0.8)] border-r" 
              : "translate-x-0 border-r-0 rounded-r-none"
          }`}
          style={{
            boxShadow: isDetached
              ? "-10px 15px 35px rgba(0,0,0,0.8), inset 1px 1px 2px rgba(255,255,255,0.12)"
              : "inset 2px 2px 4px rgba(255,255,255,0.08), -6px 10px 25px rgba(0,0,0,0.6)",
          }}
        >
          {/* Top Shoulder Triggers: ZL & L */}
          <div className="relative -mt-6 sm:-mt-7 mb-2 flex items-center justify-between w-full px-1">
            <button
              onClick={() => handleButtonPress("TOGGLE_MODE_PREV")}
              className={`h-6 sm:h-7 px-2 sm:px-2.5 rounded-t-xl bg-[#0e0f12] border-t border-x border-[#2b2d38] text-[10px] sm:text-xs font-black text-neutral-400 active:scale-95 shadow-md flex items-center justify-center transition-all ${
                gamepad.buttons.zl ? "bg-red-500 text-white" : "hover:text-white"
              }`}
              title="ZL Curved Analog Trigger"
            >
              ZL
            </button>

            <button
              onClick={() => handleButtonPress("PREV_TAB")}
              className={`h-5 sm:h-6 px-2 sm:px-3 rounded-t-lg bg-[#18191f] border-t border-x border-[#2c2e3a] text-[9px] sm:text-[10px] font-black text-neutral-400 active:scale-95 shadow-sm flex items-center justify-center transition-all ${
                gamepad.buttons.l ? "bg-red-500 text-white" : "hover:text-white"
              }`}
              title="L Shoulder Button"
            >
              L
            </button>

            {/* Minus (-) Button */}
            <button
              onClick={() => handleButtonPress("ACTION_MINUS")}
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#0d0e11] border border-[#2b2d38] text-neutral-300 flex items-center justify-center font-black active:scale-90 shadow-inner hover:text-white transition-colors"
              title="Minus (-)"
            >
              <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </button>
          </div>

          {/* LEFT THUMBSTICK (Black with Vibrant NEON RED Theme Ring & Underglow!) */}
          <div className="flex flex-col items-center my-2 sm:my-3">
            <div 
              className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#0d0e11] border-2 border-red-500/80 shadow-[0_0_15px_rgba(255,59,48,0.4)] flex items-center justify-center cursor-pointer group"
              onClick={() => handleButtonPress("NAV_UP")}
              title="Left Analog Stick (Neon Red Theme)"
            >
              {/* Neon Red Collar Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-pulse pointer-events-none opacity-80" />
              
              {/* Stick Base & Cap with Red Center Core */}
              <div 
                className={`relative w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-[#22242c] to-[#121316] border border-[#333642] shadow-xl flex items-center justify-center transition-transform active:scale-95 ${
                  gamepad.axes[0] !== 0 || gamepad.axes[1] !== 0 ? "border-red-400 scale-95" : ""
                }`}
                style={{
                  transform: `translate(${gamepad.axes[0] * 8}px, ${gamepad.axes[1] * 8}px)`
                }}
              >
                {/* Grip Ring */}
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full border border-neutral-700 flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ff3b30]" />
                </div>
              </div>
            </div>
            <span className="text-[9px] font-mono text-red-400 font-bold mt-1 tracking-tighter">
              JOY-CON (L)
            </span>
          </div>

          {/* DIRECTIONAL D-PAD BUTTONS (Up, Down, Left, Right) */}
          <div className="flex flex-col items-center my-1 sm:my-2">
            <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
              <div />
              <button
                onClick={() => handleButtonPress("NAV_UP")}
                className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#0e0f12] border border-[#2d2f3a] text-neutral-300 flex items-center justify-center shadow-md active:scale-90 transition-all ${
                  gamepad.buttons.dpadUp ? "bg-red-500 text-white scale-90" : "hover:text-white"
                }`}
              >
                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <div />

              <button
                onClick={() => handleButtonPress("NAV_LEFT")}
                className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#0e0f12] border border-[#2d2f3a] text-neutral-300 flex items-center justify-center shadow-md active:scale-90 transition-all ${
                  gamepad.buttons.dpadLeft ? "bg-red-500 text-white scale-90" : "hover:text-white"
                }`}
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#121316] opacity-30" />
              <button
                onClick={() => handleButtonPress("NAV_RIGHT")}
                className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#0e0f12] border border-[#2d2f3a] text-neutral-300 flex items-center justify-center shadow-md active:scale-90 transition-all ${
                  gamepad.buttons.dpadRight ? "bg-red-500 text-white scale-90" : "hover:text-white"
                }`}
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              <div />
              <button
                onClick={() => handleButtonPress("NAV_DOWN")}
                className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#0e0f12] border border-[#2d2f3a] text-neutral-300 flex items-center justify-center shadow-md active:scale-90 transition-all ${
                  gamepad.buttons.dpadDown ? "bg-red-500 text-white scale-90" : "hover:text-white"
                }`}
              >
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <div />
            </div>
          </div>

          {/* Bottom Area: Capture Button & Player Status LEDs */}
          <div className="flex items-center justify-between w-full px-1 pt-1 mt-auto">
            <button
              onClick={() => handleButtonPress("ACTION_CAPTURE")}
              className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-[#0d0e11] border border-[#2b2d38] text-neutral-400 flex items-center justify-center active:scale-90 shadow hover:text-white"
              title="Capture Button"
            >
              <Square className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
            </button>

            {/* Wireless Player 1 LED */}
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
            </div>
          </div>

          {/* Detached Magnetic Rail Contacts on inner edge */}
          {isDetached && (
            <div className="absolute right-0 top-1/4 bottom-1/4 w-1.5 bg-gradient-to-b from-amber-400/80 via-amber-300 to-amber-400/80 rounded-l shadow-[0_0_8px_#ffd700]" />
          )}
        </div>

        {/* ============================================================ */}
        {/* 2. CENTER REPLICA TABLET CONSOLE (8" OLED Screen Embedded)   */}
        {/* ============================================================ */}
        <div className="relative z-10 flex-1 flex flex-col bg-[#111216] border-y border-[#262832] shadow-2xl rounded-none overflow-hidden min-w-0">
          
          {/* Exact Replica Top Edge: Vents, Game Card Slot, Audio Jack, Buttons */}
          <div className="h-6 sm:h-7 bg-gradient-to-r from-[#17181f] via-[#1a1b22] to-[#17181f] border-b border-[#252732] flex items-center justify-between px-3 sm:px-6 text-[10px] text-neutral-400 font-mono shadow-inner">
            
            {/* Left: Power, Volume, Headphone */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-1 bg-neutral-600 rounded" />
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold hidden sm:inline">POWER</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-5 h-1 bg-neutral-600 rounded" />
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold hidden sm:inline">VOL</span>
              </div>
              <div className="w-2.5 h-2.5 rounded-full border-2 border-neutral-600 bg-black" title="3.5mm Audio Jack" />
            </div>

            {/* Center: Dual Cooling Vents & Switch 2 Logo */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5 bg-black/80 px-2 py-0.5 rounded border border-neutral-700">
                {[...Array(6)].map((_, i) => (
                  <span key={i} className="w-0.5 h-2 bg-neutral-600 rounded-sm" />
                ))}
              </div>
              <span className="text-[10px] font-black text-neutral-300 tracking-wider font-['Chakra_Petch']">
                NINTENDO SWITCH 2
              </span>
              <div className="flex gap-0.5 bg-black/80 px-2 py-0.5 rounded border border-neutral-700">
                {[...Array(6)].map((_, i) => (
                  <span key={i} className="w-0.5 h-2 bg-neutral-600 rounded-sm" />
                ))}
              </div>
            </div>

            {/* Right: Game Card Slot & Top USB-C */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-[9px] font-bold text-neutral-300">
                GAME CARD
              </div>
              <div className="w-3 h-1.5 rounded-sm bg-neutral-700 border border-neutral-600" title="Top USB-C Port" />
            </div>
          </div>

          {/* OLED Display Screen Frame (House the Nintendo News App) */}
          <div className="relative w-full flex-1 aspect-[16/10] min-h-[420px] sm:min-h-[520px] lg:min-h-[580px] bg-black overflow-hidden flex flex-col shadow-inner">
            <NintendoNewsApp
              mode={mode}
              onSetMode={onSetMode}
              theme={theme}
              onSetTheme={onSetTheme}
              displaySettings={displaySettings}
              onUpdateDisplaySettings={onUpdateDisplaySettings}
              gamepadAction={gamepadAction}
            />
          </div>

          {/* Exact Replica Bottom Edge: Stereo Speakers & Dock USB-C */}
          <div className="h-5 sm:h-6 bg-gradient-to-r from-[#17181f] via-[#1a1b22] to-[#17181f] border-t border-[#252732] flex items-center justify-between px-4 sm:px-8 text-[9px] text-neutral-500 font-mono shadow-inner">
            {/* Left Speaker Grill */}
            <div className="flex gap-1">
              <span className="w-2 h-1 bg-neutral-700 rounded-sm" />
              <span className="w-2 h-1 bg-neutral-700 rounded-sm" />
              <span className="w-2 h-1 bg-neutral-700 rounded-sm" />
              <span className="text-[8px] text-neutral-500 font-bold ml-1 hidden sm:inline">STEREO L</span>
            </div>

            {/* Center USB-C High Speed Dock Port */}
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
              <div className="w-7 h-2 rounded bg-black border border-neutral-600 flex items-center justify-center">
                <div className="w-4 h-0.5 bg-neutral-500 rounded" />
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
            </div>

            {/* Right Speaker Grill */}
            <div className="flex gap-1 items-center">
              <span className="text-[8px] text-neutral-500 font-bold mr-1 hidden sm:inline">STEREO R</span>
              <span className="w-2 h-1 bg-neutral-700 rounded-sm" />
              <span className="w-2 h-1 bg-neutral-700 rounded-sm" />
              <span className="w-2 h-1 bg-neutral-700 rounded-sm" />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. RIGHT JOY-CON (Matte Black with Vibrant Neon Blue Stick)  */}
        {/* ============================================================ */}
        <div
          className={`relative z-20 flex flex-col justify-between w-20 sm:w-28 md:w-32 lg:w-36 py-4 px-2 sm:px-3 bg-gradient-to-b from-[#1a1b20] via-[#141518] to-[#121316] border border-[#262830] rounded-r-[32px] sm:rounded-r-[40px] shadow-2xl transition-all duration-500 ${
            isDetached 
              ? "translate-x-6 sm:translate-x-12 rotate-[6deg] shadow-[0_20px_40px_rgba(0,0,0,0.8)] border-l" 
              : "translate-x-0 border-l-0 rounded-l-none"
          }`}
          style={{
            boxShadow: isDetached
              ? "10px 15px 35px rgba(0,0,0,0.8), inset -1px 1px 2px rgba(255,255,255,0.12)"
              : "inset -2px 2px 4px rgba(255,255,255,0.08), 6px 10px 25px rgba(0,0,0,0.6)",
          }}
        >
          {/* Top Shoulder Triggers: Plus (+), R, ZR */}
          <div className="relative -mt-6 sm:-mt-7 mb-2 flex items-center justify-between w-full px-1">
            {/* Plus (+) Button */}
            <button
              onClick={() => handleButtonPress("TOGGLE_SETTINGS")}
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#0d0e11] border border-[#2b2d38] text-neutral-300 flex items-center justify-center font-black active:scale-90 shadow-inner hover:text-white transition-colors"
              title="Plus (+)"
            >
              <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </button>

            <button
              onClick={() => handleButtonPress("NEXT_TAB")}
              className={`h-5 sm:h-6 px-2 sm:px-3 rounded-t-lg bg-[#18191f] border-t border-x border-[#2c2e3a] text-[9px] sm:text-[10px] font-black text-neutral-400 active:scale-95 shadow-sm flex items-center justify-center transition-all ${
                gamepad.buttons.r ? "bg-cyan-500 text-white" : "hover:text-white"
              }`}
              title="R Shoulder Button"
            >
              R
            </button>

            <button
              onClick={() => handleButtonPress("TOGGLE_MODE_NEXT")}
              className={`h-6 sm:h-7 px-2 sm:px-2.5 rounded-t-xl bg-[#0e0f12] border-t border-x border-[#2b2d38] text-[10px] sm:text-xs font-black text-neutral-400 active:scale-95 shadow-md flex items-center justify-center transition-all ${
                gamepad.buttons.zr ? "bg-cyan-500 text-white" : "hover:text-white"
              }`}
              title="ZR Curved Analog Trigger"
            >
              ZR
            </button>
          </div>

          {/* ACTION BUTTONS (X, Y, A, B) */}
          <div className="flex flex-col items-center my-1 sm:my-2">
            <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
              <div />
              <button
                onClick={() => handleButtonPress("ACTION_X")}
                className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#0e0f12] border border-[#2d2f3a] text-neutral-200 font-black text-[10px] sm:text-xs flex items-center justify-center shadow-md active:scale-90 transition-all ${
                  gamepad.buttons.x ? "bg-cyan-500 text-white scale-90" : "hover:text-white"
                }`}
              >
                X
              </button>
              <div />

              <button
                onClick={() => handleButtonPress("FILTER_Y")}
                className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#0e0f12] border border-[#2d2f3a] text-neutral-200 font-black text-[10px] sm:text-xs flex items-center justify-center shadow-md active:scale-90 transition-all ${
                  gamepad.buttons.y ? "bg-cyan-500 text-white scale-90" : "hover:text-white"
                }`}
              >
                Y
              </button>
              <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#121316] opacity-30" />
              <button
                onClick={() => handleButtonPress("SELECT_A")}
                className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#0e0f12] border border-[#2d2f3a] text-neutral-200 font-black text-[10px] sm:text-xs flex items-center justify-center shadow-md active:scale-90 transition-all ${
                  gamepad.buttons.a ? "bg-cyan-500 text-white scale-90" : "hover:text-white"
                }`}
              >
                A
              </button>

              <div />
              <button
                onClick={() => handleButtonPress("BACK_B")}
                className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#0e0f12] border border-[#2d2f3a] text-neutral-200 font-black text-[10px] sm:text-xs flex items-center justify-center shadow-md active:scale-90 transition-all ${
                  gamepad.buttons.b ? "bg-cyan-500 text-white scale-90" : "hover:text-white"
                }`}
              >
                B
              </button>
              <div />
            </div>
          </div>

          {/* RIGHT THUMBSTICK (Black with Vibrant NEON BLUE / CYAN Theme Ring & Underglow!) */}
          <div className="flex flex-col items-center my-2 sm:my-3">
            <div 
              className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#0d0e11] border-2 border-cyan-400/80 shadow-[0_0_15px_rgba(0,199,255,0.4)] flex items-center justify-center cursor-pointer group"
              onClick={() => handleButtonPress("NAV_DOWN")}
              title="Right Analog Stick (Neon Blue Theme)"
            >
              {/* Neon Blue Collar Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-pulse pointer-events-none opacity-80" />
              
              {/* Stick Base & Cap with Blue Center Core */}
              <div 
                className={`relative w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-[#22242c] to-[#121316] border border-[#333642] shadow-xl flex items-center justify-center transition-transform active:scale-95 ${
                  gamepad.axes[2] !== 0 || gamepad.axes[3] !== 0 ? "border-cyan-400 scale-95" : ""
                }`}
                style={{
                  transform: `translate(${gamepad.axes[2] * 8}px, ${gamepad.axes[3] * 8}px)`
                }}
              >
                {/* Grip Ring */}
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full border border-neutral-700 flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#00c7ff]" />
                </div>
              </div>
            </div>
            <span className="text-[9px] font-mono text-cyan-400 font-bold mt-1 tracking-tighter">
              JOY-CON (R)
            </span>
          </div>

          {/* Bottom Area: Home Button with Cyan Ring & Player Status LEDs */}
          <div className="flex items-center justify-between w-full px-1 pt-1 mt-auto">
            {/* Wireless Player 1 LED */}
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
            </div>

            {/* Home Button with Illuminated Blue Ring */}
            <button
              onClick={() => handleButtonPress("TOGGLE_SETTINGS")}
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#0d0e11] border-2 border-cyan-400 shadow-[0_0_8px_rgba(0,199,255,0.5)] text-cyan-300 flex items-center justify-center active:scale-90"
              title="Nintendo Home Button"
            >
              <Home className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </button>
          </div>

          {/* Detached Magnetic Rail Contacts on inner edge */}
          {isDetached && (
            <div className="absolute left-0 top-1/4 bottom-1/4 w-1.5 bg-gradient-to-b from-amber-400/80 via-amber-300 to-amber-400/80 rounded-r shadow-[0_0_8px_#ffd700]" />
          )}
        </div>
      </div>
    </div>
  );
};
