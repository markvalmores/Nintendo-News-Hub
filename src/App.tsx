import React, { useState, useEffect, useRef } from "react";
import { ConsoleMode, JoyconTheme, DisplaySettings } from "./types";
import { Switch2Mesh } from "./components/Switch2Mesh";
import { Switch2ConsoleReplica } from "./components/Switch2ConsoleReplica";
import { NintendoNewsApp } from "./components/NintendoNewsApp";
import { DockedTvView } from "./components/DockedTvView";
import { useGamepad } from "./utils/gamepad";
import { soundEngine } from "./utils/audio";
import { 
  Tv, 
  Tablet, 
  Gamepad2, 
  Box, 
  Smartphone, 
  Monitor, 
  RotateCw, 
  Sparkles,
  Layers,
  Radio
} from "lucide-react";

export default function App() {
  const [mode, setMode] = useState<ConsoleMode>("handheld");
  const [theme, setTheme] = useState<JoyconTheme>("neon");
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    crtScanlines: true,
    oledBloom: true,
    holographicVfx: true,
    audioEnabled: true,
    musicPlaying: false,
    meshWireframe: false,
    aspectRatio: "auto",
    rotation: 0,
  });

  const [interactiveAngle, setInteractiveAngle] = useState({ x: 0, y: 0 });
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [show3dMeshView, setShow3dMeshView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Gamepad & Joy-Con 1 support
  const gamepad = useGamepad((action) => {
    setLastAction(action);
    setTimeout(() => setLastAction(null), 150);
  });

  // Check window aspect ratio & mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Subtle 3D tilt tracking from mouse or touch movement
  const handleMouseMove = (e: React.MouseEvent) => {
    if (mode === "docked") return;
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    setInteractiveAngle({ x: -y * 10, y: x * 12 });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (mode === "docked" || e.touches.length === 0) return;
    const touch = e.touches[0];
    const { innerWidth, innerHeight } = window;
    const x = (touch.clientX / innerWidth - 0.5) * 2;
    const y = (touch.clientY / innerHeight - 0.5) * 2;
    setInteractiveAngle({ x: -y * 8, y: x * 10 });
  };

  const handleJoyconAction = (action: string) => {
    setLastAction(action);
    setTimeout(() => setLastAction(null), 150);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative w-screen h-screen bg-[#07080b] text-neutral-100 overflow-x-hidden overflow-y-auto flex flex-col items-center justify-between select-none font-sans"
    >
      {/* Dynamic Animated Cosmic Aurora Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 mix-blend-screen transition-all duration-1000"
        style={{
          background: mode === "docked"
            ? "radial-gradient(circle at 50% 30%, #1e1b4b 0%, #030712 70%)"
            : "radial-gradient(circle at 20% 40%, rgba(255, 59, 48, 0.22) 0%, transparent 50%), radial-gradient(circle at 80% 60%, rgba(0, 199, 255, 0.22) 0%, transparent 50%)"
        }}
      />

      {/* Floating Holographic Star Dust & Particles */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

      {/* TOP HARDWARE CONTROL DECK */}
      <header className="relative z-30 w-full max-w-7xl flex items-center justify-between px-3 sm:px-6 py-2 text-xs border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md">
        
        {/* Left: Console Hardware Replica Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-['Chakra_Petch'] font-black tracking-wider text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm sm:text-base">NINTENDO SWITCH 2</span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300">
              EXACT CONSOLE REPLICA
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-neutral-400">
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-cyan-400 font-bold">
              {mode.toUpperCase()} MODE
            </span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-200">
              BLACK JOY-CON • RED/BLUE STICKS
            </span>
          </div>
        </div>

        {/* Center: Real Gamepad / Joy-Con 1 Connection Status */}
        <div className="flex items-center gap-2">
          {gamepad.connected ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-mono animate-pulse">
              <Radio className="w-3 h-3" />
              <span>{gamepad.isJoycon1 ? "Joy-Con 1 Connected" : "Gamepad Active"}</span>
            </span>
          ) : (
            <span className="hidden md:inline-block text-[11px] font-mono text-neutral-400">
              Press any button on Joy-Con 1 or Gamepad
            </span>
          )}
        </div>

        {/* Right: Console Mode & 3D Mesh Inspector */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-neutral-900 p-0.5 rounded-lg border border-neutral-800">
            <button
              onClick={() => {
                soundEngine.playSwitchSnap();
                setMode("handheld");
              }}
              className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                mode === "handheld" ? "bg-red-500 text-white shadow-sm" : "text-neutral-400 hover:text-white"
              }`}
              title="Handheld Mode (Joy-Cons Attached)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Handheld</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playDetachSound();
                setMode("tabletop");
              }}
              className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                mode === "tabletop" ? "bg-cyan-500 text-white shadow-sm" : "text-neutral-400 hover:text-white"
              }`}
              title="Tabletop Mode (Removed Joy-Cons)"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Detached Joy-Con</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playDockPower();
                setMode("docked");
              }}
              className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                mode === "docked" ? "bg-emerald-500 text-white shadow-sm" : "text-neutral-400 hover:text-white"
              }`}
              title="Docked 4K Mode"
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Docked 4K</span>
            </button>
          </div>

          {/* 3D Polygon Mesh Inspector Toggle */}
          <button
            onClick={() => {
              soundEngine.playMenuBlip(90);
              setShow3dMeshView(!show3dMeshView);
            }}
            className={`p-1.5 rounded-lg border transition-all ${
              show3dMeshView 
                ? "bg-cyan-500/20 border-cyan-500 text-cyan-300" 
                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
            }`}
            title="Toggle 3D Polygon Mesh Wireframe Inspector"
          >
            <Box className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main className="relative flex-1 w-full max-w-7xl flex flex-col items-center justify-center p-2 sm:p-4 my-auto">
        
        {/* 1. DOCKED MODE: 4K Living Room TV View */}
        {mode === "docked" ? (
          <DockedTvView onUndock={() => setMode("handheld")}>
            <NintendoNewsApp
              mode={mode}
              onSetMode={setMode}
              theme={theme}
              onSetTheme={setTheme}
              displaySettings={displaySettings}
              onUpdateDisplaySettings={(patch) => setDisplaySettings(prev => ({ ...prev, ...patch }))}
              gamepadAction={lastAction}
            />
          </DockedTvView>
        ) : show3dMeshView ? (
          /* 2. OPTIONAL 3D THREE.JS POLYGON MESH INSPECTION VIEW */
          <div className="relative w-full h-[75vh] flex flex-col items-center justify-center">
            <div className="absolute top-2 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-700 text-xs text-neutral-300">
              <Box className="w-3.5 h-3.5 text-cyan-400" />
              <span>3D Switch 2 Console Mesh with Matte Black Joy-Cons & Red/Blue Sticks</span>
            </div>
            <Switch2Mesh
              mode={mode}
              theme={theme}
              wireframe={displaySettings.meshWireframe}
              docked={false}
              interactiveAngle={interactiveAngle}
            />
          </div>
        ) : (
          /* 3. EXACT REPLICA NINTENDO SWITCH 2 HANDHELD CONSOLE */
          /* Joy-Cons (Matte Black with Red & Blue Thumbstick theme) attached directly to the Screen */
          <Switch2ConsoleReplica
            mode={mode}
            onSetMode={setMode}
            theme={theme}
            onSetTheme={setTheme}
            displaySettings={displaySettings}
            onUpdateDisplaySettings={(patch) => setDisplaySettings(prev => ({ ...prev, ...patch }))}
            gamepad={gamepad}
            gamepadAction={lastAction}
            onJoyconAction={handleJoyconAction}
            tiltAngle={interactiveAngle}
          />
        )}
      </main>

      {/* CONSOLE STATUS FOOTER */}
      <footer className="relative z-30 w-full max-w-7xl px-4 py-2 border-t border-neutral-800/80 bg-neutral-950/60 backdrop-blur text-[11px] text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-neutral-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Left Joy-Con: Neon Red Thumbstick
          </span>
          <span className="flex items-center gap-1.5 text-neutral-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Right Joy-Con: Neon Blue Thumbstick
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span>8-Inch 120Hz OLED Screen</span>
          <span>•</span>
          <span>Magnetic Rail Attachment</span>
          <span>•</span>
          <span className="text-emerald-400">HDMI 2.1 4K Ready</span>
        </div>
      </footer>
    </div>
  );
}
