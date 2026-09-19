import React from "react";
import { GamepadStatus, ConsoleMode, JoyconTheme } from "../types";
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
  Radio
} from "lucide-react";

interface JoyconGamepadOverlayProps {
  gamepad: GamepadStatus;
  mode: ConsoleMode;
  theme: JoyconTheme;
  onAction: (action: string) => void;
  mobileCompact?: boolean;
}

export const JoyconGamepadOverlay: React.FC<JoyconGamepadOverlayProps> = ({
  gamepad,
  mode,
  theme,
  onAction,
  mobileCompact = false,
}) => {
  const getThemeColors = () => {
    switch (theme) {
      case "neon":
        return {
          leftBg: "bg-red-500",
          leftBorder: "border-red-600",
          rightBg: "bg-cyan-500",
          rightBorder: "border-cyan-600",
        };
      case "titanium":
        return {
          leftBg: "bg-neutral-800",
          leftBorder: "border-neutral-700",
          rightBg: "bg-neutral-700",
          rightBorder: "border-neutral-600",
        };
      case "retro":
        return {
          leftBg: "bg-blue-600",
          leftBorder: "border-blue-700",
          rightBg: "bg-red-600",
          rightBorder: "border-red-700",
        };
      case "atomic":
        return {
          leftBg: "bg-purple-600/90",
          leftBorder: "border-purple-500",
          rightBg: "bg-fuchsia-600/90",
          rightBorder: "border-fuchsia-500",
        };
      default:
        return {
          leftBg: "bg-red-500",
          leftBorder: "border-red-600",
          rightBg: "bg-cyan-500",
          rightBorder: "border-cyan-600",
        };
    }
  };

  const colors = getThemeColors();

  const handlePress = (action: string) => {
    soundEngine.playMenuBlip(40);
    onAction(action);
  };

  return (
    <div className={`pointer-events-auto flex items-center justify-between w-full transition-all duration-500 ${
      mobileCompact ? "px-2 py-1" : "px-3 py-2"
    }`}>
      {/* Real Gamepad Connection Toast Pill if active */}
      {gamepad.connected && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs shadow-lg backdrop-blur animate-bounce">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>
            {gamepad.isJoycon1 ? "🎮 Real Joy-Con 1 Connected" : "🎮 Gamepad Connected"}: {gamepad.id.slice(0, 24)}
          </span>
        </div>
      )}

      {/* LEFT JOY-CON 1 / 2 */}
      <div 
        className={`relative flex flex-col items-center justify-between p-2.5 sm:p-3.5 rounded-3xl ${colors.leftBg} ${colors.leftBorder} border shadow-xl text-neutral-900 select-none transition-transform duration-300 ${
          mode === "tabletop" ? "rotate-[-6deg] scale-95" : ""
        } ${mobileCompact ? "w-28 sm:w-32" : "w-32 sm:w-36"}`}
        style={{
          boxShadow: "0 10px 25px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4)"
        }}
      >
        {/* Top ZL & L triggers */}
        <div className="flex items-center justify-between w-full -mt-1 mb-2 px-1">
          <button
            onClick={() => handlePress("TOGGLE_MODE_PREV")}
            className={`px-2 py-1 rounded-lg text-[10px] font-extrabold bg-neutral-900 text-white shadow-inner active:scale-95 transition-all ${
              gamepad.buttons.zl ? "bg-white text-black scale-95" : ""
            }`}
          >
            ZL
          </button>
          <button
            onClick={() => handlePress("PREV_TAB")}
            className={`px-2 py-1 rounded-lg text-[10px] font-extrabold bg-neutral-900 text-white shadow-inner active:scale-95 transition-all ${
              gamepad.buttons.l ? "bg-white text-black scale-95" : ""
            }`}
          >
            L
          </button>
          <button
            onClick={() => handlePress("ACTION_MINUS")}
            className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs active:scale-95"
            title="Minus (-)"
          >
            <Minus className="w-3 h-3" />
          </button>
        </div>

        {/* Left Analog Stick (Interactive) */}
        <div 
          onClick={() => handlePress("NAV_UP")}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-neutral-900 border-2 border-neutral-700 shadow-inner flex items-center justify-center cursor-pointer active:scale-95 transition-all ${
            gamepad.axes[0] !== 0 || gamepad.axes[1] !== 0 ? "border-cyan-400" : ""
          }`}
          style={{
            transform: `translate(${gamepad.axes[0] * 12}px, ${gamepad.axes[1] * 12}px)`
          }}
        >
          <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-600 flex items-center justify-center shadow">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-950" />
          </div>
        </div>

        {/* Directional D-Pad Buttons */}
        <div className="grid grid-cols-3 gap-1 my-2">
          <div />
          <button
            onClick={() => handlePress("NAV_UP")}
            className={`w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-inner active:scale-90 transition-all ${
              gamepad.buttons.dpadUp ? "bg-white text-black scale-90" : ""
            }`}
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <div />

          <button
            onClick={() => handlePress("NAV_LEFT")}
            className={`w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-inner active:scale-90 transition-all ${
              gamepad.buttons.dpadLeft ? "bg-white text-black scale-90" : ""
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <div className="w-6 h-6 rounded-full bg-neutral-900/40" />
          <button
            onClick={() => handlePress("NAV_RIGHT")}
            className={`w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-inner active:scale-90 transition-all ${
              gamepad.buttons.dpadRight ? "bg-white text-black scale-90" : ""
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <div />
          <button
            onClick={() => handlePress("NAV_DOWN")}
            className={`w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-inner active:scale-90 transition-all ${
              gamepad.buttons.dpadDown ? "bg-white text-black scale-90" : ""
            }`}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <div />
        </div>

        {/* Capture Button */}
        <div className="flex items-center justify-start w-full px-2 mt-1">
          <button
            onClick={() => handlePress("ACTION_CAPTURE")}
            className="w-5 h-5 rounded bg-neutral-900 text-white flex items-center justify-center active:scale-90 shadow"
            title="Screen Capture"
          >
            <Square className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* RIGHT JOY-CON 1 / 2 */}
      <div 
        className={`relative flex flex-col items-center justify-between p-2.5 sm:p-3.5 rounded-3xl ${colors.rightBg} ${colors.rightBorder} border shadow-xl text-neutral-900 select-none transition-transform duration-300 ${
          mode === "tabletop" ? "rotate-[6deg] scale-95" : ""
        } ${mobileCompact ? "w-28 sm:w-32" : "w-32 sm:w-36"}`}
        style={{
          boxShadow: "0 10px 25px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4)"
        }}
      >
        {/* Top ZR & R triggers */}
        <div className="flex items-center justify-between w-full -mt-1 mb-2 px-1">
          <button
            onClick={() => handlePress("TOGGLE_SETTINGS")}
            className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs active:scale-95"
            title="Plus (+)"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            onClick={() => handlePress("NEXT_TAB")}
            className={`px-2 py-1 rounded-lg text-[10px] font-extrabold bg-neutral-900 text-white shadow-inner active:scale-95 transition-all ${
              gamepad.buttons.r ? "bg-white text-black scale-95" : ""
            }`}
          >
            R
          </button>
          <button
            onClick={() => handlePress("TOGGLE_MODE_NEXT")}
            className={`px-2 py-1 rounded-lg text-[10px] font-extrabold bg-neutral-900 text-white shadow-inner active:scale-95 transition-all ${
              gamepad.buttons.zr ? "bg-white text-black scale-95" : ""
            }`}
          >
            ZR
          </button>
        </div>

        {/* Action Buttons (A, B, X, Y) */}
        <div className="grid grid-cols-3 gap-1 my-1">
          <div />
          <button
            onClick={() => handlePress("ACTION_X")}
            className={`w-6 h-6 rounded-full bg-neutral-900 text-white font-extrabold text-[11px] flex items-center justify-center shadow-inner active:scale-90 transition-all ${
              gamepad.buttons.x ? "bg-white text-black scale-90" : ""
            }`}
          >
            X
          </button>
          <div />

          <button
            onClick={() => handlePress("FILTER_Y")}
            className={`w-6 h-6 rounded-full bg-neutral-900 text-white font-extrabold text-[11px] flex items-center justify-center shadow-inner active:scale-90 transition-all ${
              gamepad.buttons.y ? "bg-white text-black scale-90" : ""
            }`}
          >
            Y
          </button>
          <div className="w-6 h-6 rounded-full bg-neutral-900/40" />
          <button
            onClick={() => handlePress("SELECT_A")}
            className={`w-6 h-6 rounded-full bg-neutral-900 text-white font-extrabold text-[11px] flex items-center justify-center shadow-inner active:scale-90 transition-all ${
              gamepad.buttons.a ? "bg-white text-black scale-90" : ""
            }`}
          >
            A
          </button>

          <div />
          <button
            onClick={() => handlePress("BACK_B")}
            className={`w-6 h-6 rounded-full bg-neutral-900 text-white font-extrabold text-[11px] flex items-center justify-center shadow-inner active:scale-90 transition-all ${
              gamepad.buttons.b ? "bg-white text-black scale-90" : ""
            }`}
          >
            B
          </button>
          <div />
        </div>

        {/* Right Analog Stick */}
        <div 
          onClick={() => handlePress("NAV_DOWN")}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-neutral-900 border-2 border-neutral-700 shadow-inner flex items-center justify-center cursor-pointer active:scale-95 transition-all my-1 ${
            gamepad.axes[2] !== 0 || gamepad.axes[3] !== 0 ? "border-cyan-400" : ""
          }`}
          style={{
            transform: `translate(${gamepad.axes[2] * 12}px, ${gamepad.axes[3] * 12}px)`
          }}
        >
          <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-600 flex items-center justify-center shadow">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-950" />
          </div>
        </div>

        {/* Home Button with Blue Glow Ring */}
        <div className="flex items-center justify-end w-full px-2 mt-1">
          <button
            onClick={() => handlePress("TOGGLE_SETTINGS")}
            className="w-5 h-5 rounded-full bg-neutral-900 text-white ring-2 ring-cyan-400 flex items-center justify-center active:scale-90 shadow"
            title="Nintendo Home"
          >
            <Home className="w-2.5 h-2.5 text-cyan-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
