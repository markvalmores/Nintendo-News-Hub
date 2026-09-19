import React from "react";

interface CrtOverlayProps {
  scanlines: boolean;
  bloom: boolean;
  holographic: boolean;
}

export const CrtOverlay: React.FC<CrtOverlayProps> = ({ scanlines, bloom, holographic }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-xl">
      {/* 1. Subtle Glass Reflection Glare */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0) 60%, rgba(255,255,255,0.06) 100%)"
        }}
      />

      {/* 2. OLED Subpixel Scanlines */}
      {scanlines && (
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.6) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.04))",
            backgroundSize: "100% 3px, 6px 100%"
          }}
        />
      )}

      {/* 3. HDR Bloom Glow Filter */}
      {bloom && (
        <div className="absolute inset-0 mix-blend-screen opacity-15 pointer-events-none bg-gradient-to-t from-red-500/10 via-transparent to-cyan-500/10" />
      )}

      {/* 4. Holographic RGB Edge Bleed */}
      {holographic && (
        <div 
          className="absolute inset-0 opacity-20 animate-pulse"
          style={{
            boxShadow: "inset 0 0 30px rgba(0, 212, 255, 0.4), inset 0 0 10px rgba(255, 60, 0, 0.4)"
          }}
        />
      )}

      {/* 5. Curved Screen Bezel Inner Shadow */}
      <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.85)] rounded-xl" />
    </div>
  );
};
