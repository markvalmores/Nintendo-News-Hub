import React, { useState, useEffect, useMemo } from "react";
import { NewsArticle, ConsoleMode, JoyconTheme, DisplaySettings } from "../types";
import { soundEngine } from "../utils/audio";
import { CrtOverlay } from "./CrtOverlay";
import { NewsReaderModal } from "./NewsReaderModal";
import { CommunityWall } from "./CommunityWall";
import { NintendoThreadsFeed } from "./NintendoThreadsFeed";
import { INITIAL_NINTENDO_NEWS, INITIAL_BREAKING_TICKER } from "../data/nintendoNewsData";
import { 
  Wifi, 
  Battery, 
  Search, 
  Volume2, 
  VolumeX, 
  Music, 
  Tv, 
  Tablet, 
  Maximize2, 
  Sparkles, 
  Flame, 
  Layers, 
  Grid, 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2, 
  Compass, 
  RotateCw, 
  Gamepad2, 
  Sliders,
  RefreshCw,
  Link2
} from "lucide-react";
import confetti from "canvas-confetti";

interface NintendoNewsAppProps {
  mode: ConsoleMode;
  onSetMode: (mode: ConsoleMode) => void;
  theme: JoyconTheme;
  onSetTheme: (theme: JoyconTheme) => void;
  displaySettings: DisplaySettings;
  onUpdateDisplaySettings: (settings: Partial<DisplaySettings>) => void;
  gamepadAction?: string | null;
}

export const NintendoNewsApp: React.FC<NintendoNewsAppProps> = ({
  mode,
  onSetMode,
  theme,
  onSetTheme,
  displaySettings,
  onUpdateDisplaySettings,
  gamepadAction,
}) => {
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_NINTENDO_NEWS);
  const [categories, setCategories] = useState<string[]>([
    "All", 
    "Hardware", 
    "First Party", 
    "Direct Highlights", 
    "eShop Deals", 
    "System & Retro", 
    "Threads (Vercel)", 
    "Miiverse"
  ]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [tickerItems, setTickerItems] = useState<string[]>(INITIAL_BREAKING_TICKER);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🍄");
  const [focusedCardIndex, setFocusedCardIndex] = useState(0);

  // Fetch News and Ticker from backend API with robust fallback
  const fetchNews = async () => {
    try {
      const res = await fetch("/api/nintendo/news");
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        }
        if (data.categories) {
          const uniqueCats = Array.from(new Set([
            ...data.categories, 
            "Threads (Vercel)", 
            "Miiverse"
          ]));
          setCategories(uniqueCats);
        }
      }
    } catch (e) {
      console.warn("Using active Nintendo news dataset", e);
    }
  };

  const fetchTicker = async () => {
    try {
      const res = await fetch("/api/nintendo/ticker");
      if (res.ok) {
        const data = await res.json();
        if (data.breaking && data.breaking.length > 0) {
          setTickerItems(data.breaking);
        }
      }
    } catch {
      // keep INITIAL_BREAKING_TICKER fallback
    }
  };

  useEffect(() => {
    fetchNews();
    fetchTicker();

    // Clock
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);

    // Ticker cycle
    const tickerTimer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % Math.max(1, tickerItems.length));
    }, 5500);

    return () => {
      clearInterval(timer);
      clearInterval(tickerTimer);
    };
  }, [tickerItems.length]);

  // Gamepad action listener
  useEffect(() => {
    if (!gamepadAction) return;

    if (gamepadAction === "NAV_RIGHT") {
      setFocusedCardIndex(prev => Math.min(filteredArticles.length - 1, prev + 1));
      soundEngine.playMenuBlip(20);
    } else if (gamepadAction === "NAV_LEFT") {
      setFocusedCardIndex(prev => Math.max(0, prev - 1));
      soundEngine.playMenuBlip(-20);
    } else if (gamepadAction === "SELECT_A") {
      if (filteredArticles[focusedCardIndex]) {
        soundEngine.playConfirmDing();
        setActiveArticle(filteredArticles[focusedCardIndex]);
      }
    } else if (gamepadAction === "BACK_B") {
      if (activeArticle) {
        soundEngine.playCancelSwoosh();
        setActiveArticle(null);
      }
    } else if (gamepadAction === "PREV_TAB") {
      const curIdx = categories.indexOf(selectedCategory);
      const nextIdx = (curIdx - 1 + categories.length) % categories.length;
      setSelectedCategory(categories[nextIdx]);
      soundEngine.playMenuBlip();
    } else if (gamepadAction === "NEXT_TAB") {
      const curIdx = categories.indexOf(selectedCategory);
      const nextIdx = (curIdx + 1) % categories.length;
      setSelectedCategory(categories[nextIdx]);
      soundEngine.playMenuBlip();
    } else if (gamepadAction === "TOGGLE_MODE_NEXT") {
      const modes: ConsoleMode[] = ["handheld", "tabletop", "docked"];
      const nextMode = modes[(modes.indexOf(mode) + 1) % modes.length];
      onSetMode(nextMode);
      if (nextMode === "docked") soundEngine.playDockPower();
      else if (nextMode === "tabletop") soundEngine.playDetachSound();
      else soundEngine.playSwitchSnap();
    } else if (gamepadAction === "TOGGLE_MODE_PREV") {
      const modes: ConsoleMode[] = ["handheld", "tabletop", "docked"];
      const prevMode = modes[(modes.indexOf(mode) - 1 + modes.length) % modes.length];
      onSetMode(prevMode);
      soundEngine.playSwitchSnap();
    }
  }, [gamepadAction]);

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    if (selectedCategory === "Miiverse" || selectedCategory === "Threads (Vercel)") return [];
    return articles.filter(article => {
      const matchCat = selectedCategory === "All" || article.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch = !searchQuery || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const featuredArticle = useMemo(() => {
    return articles.find(a => a.featured) || articles[0];
  }, [articles]);

  const handleLike = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playYeahSound();
    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.7 },
      colors: ["#ff3b30", "#00c7ff", "#ffd700"]
    });

    setArticles(prev => prev.map(a => a.id === id ? { ...a, likes: a.likes + 1 } : a));
    try {
      await fetch(`/api/nintendo/news/${id}/like`, { method: "POST" });
    } catch {
      // ignore
    }
  };

  return (
    <div 
      className="relative w-full h-full flex flex-col bg-neutral-950 text-neutral-100 select-none overflow-hidden font-sans"
      style={{
        transform: `rotate(${displaySettings.rotation}deg)`,
        transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}
    >
      {/* Visual Graphics Shaders & Micro-OLED Overlays */}
      <CrtOverlay 
        scanlines={displaySettings.crtScanlines}
        bloom={displaySettings.oledBloom}
        holographic={displaySettings.holographicVfx}
      />

      {/* 1. TOP STATUS BAR (Authentic Nintendo Switch 2 OS Interface) */}
      <header className="relative z-20 flex items-center justify-between px-3 sm:px-5 py-2 bg-neutral-900/90 border-b border-neutral-800/90 backdrop-blur-md">
        
        {/* User Profile & Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const avatars = ["🍄", "🗡️", "🚀", "⭐", "👑", "🦊"];
              const nextAv = avatars[(avatars.indexOf(selectedAvatar) + 1) % avatars.length];
              setSelectedAvatar(nextAv);
              soundEngine.playMenuBlip(60);
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-red-600 to-cyan-500 p-0.5 shadow-md flex items-center justify-center text-sm sm:text-base hover:scale-105 active:scale-95 transition-transform"
            title="Switch User Profile Avatar"
          >
            <span className="w-full h-full bg-neutral-950 rounded-full flex items-center justify-center">
              {selectedAvatar}
            </span>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-red-500 font-extrabold text-sm sm:text-base tracking-tighter font-['Chakra_Petch']">
              Nintendo
            </span>
            <span className="bg-gradient-to-r from-red-500 to-cyan-400 bg-clip-text text-transparent font-extrabold text-xs sm:text-sm tracking-wider font-['Chakra_Petch']">
              SWITCH 2
            </span>
            <span className="hidden md:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
              NEWS CHANNEL
            </span>
          </div>
        </div>

        {/* Quick Mode & Display Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mode Switcher Pill */}
          <div className="flex items-center bg-neutral-950 p-0.5 rounded-lg border border-neutral-800 text-xs">
            <button
              onClick={() => {
                soundEngine.playSwitchSnap();
                onSetMode("handheld");
              }}
              className={`px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                mode === "handheld" ? "bg-red-500 text-white shadow-sm" : "text-neutral-400 hover:text-white"
              }`}
              title="Switch 2 Handheld Mode"
            >
              <Tablet className="w-3 h-3" />
              <span className="hidden sm:inline">Handheld</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playDetachSound();
                onSetMode("tabletop");
              }}
              className={`px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                mode === "tabletop" ? "bg-cyan-500 text-white shadow-sm" : "text-neutral-400 hover:text-white"
              }`}
              title="Removed Joy-Con Tabletop Mode"
            >
              <Gamepad2 className="w-3 h-3" />
              <span className="hidden sm:inline">Detached</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playDockPower();
                onSetMode("docked");
              }}
              className={`px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                mode === "docked" ? "bg-emerald-500 text-white shadow-sm" : "text-neutral-400 hover:text-white"
              }`}
              title="Switch 2 4K Docked Mode"
            >
              <Tv className="w-3 h-3" />
              <span className="hidden sm:inline">Docked 4K</span>
            </button>
          </div>

          {/* Threads & Vercel Quick Pill */}
          <button
            onClick={() => {
              soundEngine.playMenuBlip(50);
              setSelectedCategory("Threads (Vercel)");
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all border ${
              selectedCategory === "Threads (Vercel)"
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm"
                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
            }`}
            title="Nintendo Threads Feed (Connected to Vercel App)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono">Threads</span>
          </button>

          {/* Audio & Music Buttons */}
          <button
            onClick={() => {
              const next = !displaySettings.audioEnabled;
              onUpdateDisplaySettings({ audioEnabled: next });
              soundEngine.setEnabled(next);
            }}
            className={`p-1.5 rounded-lg border transition-all ${
              displaySettings.audioEnabled 
                ? "bg-neutral-800 border-neutral-700 text-cyan-400" 
                : "bg-neutral-900 border-neutral-800 text-neutral-500"
            }`}
            title="Toggle SFX"
          >
            {displaySettings.audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              const isPlaying = soundEngine.toggleAmbientMusic();
              onUpdateDisplaySettings({ musicPlaying: isPlaying });
            }}
            className={`p-1.5 rounded-lg border transition-all ${
              displaySettings.musicPlaying 
                ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse" 
                : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300"
            }`}
            title="Nintendo eShop Ambient Music"
          >
            <Music className="w-3.5 h-3.5" />
          </button>

          {/* Graphics Settings Toggle (Scanlines / Bloom / 3D Wireframe) */}
          <button
            onClick={() => {
              soundEngine.playMenuBlip(80);
              onUpdateDisplaySettings({
                crtScanlines: !displaySettings.crtScanlines,
              });
            }}
            className={`p-1.5 rounded-lg border transition-all ${
              displaySettings.crtScanlines
                ? "bg-purple-600/30 border-purple-500 text-purple-300"
                : "bg-neutral-900 border-neutral-800 text-neutral-500"
            }`}
            title="Toggle CRT / OLED Scanline FX"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Screen Rotation Button */}
          <button
            onClick={() => {
              soundEngine.playSwitchSnap();
              const nextRot = (displaySettings.rotation + 90) % 360;
              onUpdateDisplaySettings({ rotation: nextRot });
            }}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-all active:rotate-90"
            title="Rotate Screen Aspect"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* System Battery & Time */}
          <div className="flex items-center gap-2 pl-2 border-l border-neutral-800 text-xs font-mono text-neutral-300">
            <span className="hidden sm:flex items-center gap-1 text-emerald-400">
              <Wifi className="w-3.5 h-3.5" />
              <span className="text-[10px]">Wi-Fi 7</span>
            </span>
            <span className="flex items-center gap-1 text-neutral-200">
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-bold">100%</span>
            </span>
            <span className="text-white font-bold">{currentTime}</span>
          </div>
        </div>
      </header>

      {/* 2. REAL-TIME TICKER TAPE (Glowing Nintendo Direct Breaking News Ribbon) */}
      <div className="relative z-10 flex items-center px-3 py-1 bg-gradient-to-r from-red-700/80 via-neutral-900 to-cyan-900/80 border-b border-neutral-800 text-xs text-white overflow-hidden shadow-inner">
        <div className="flex items-center gap-1.5 font-extrabold uppercase tracking-wider text-[11px] text-white bg-red-600 px-2 py-0.5 rounded shadow-sm mr-2.5 flex-shrink-0 animate-pulse">
          <Flame className="w-3 h-3 text-amber-300" />
          <span>BREAKING</span>
        </div>
        <div className="flex-1 truncate font-medium text-xs text-neutral-200">
          {tickerItems[tickerIndex] || "Nintendo Switch 2 Global Announcement Broadcast Live!"}
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-cyan-400 flex-shrink-0 ml-2">
          <span>REAL-TIME API</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>
      </div>

      {/* 3. CATEGORY SELECTOR & SEARCH BAR */}
      <div className="relative z-10 px-3 sm:px-5 py-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-neutral-950/90 border-b border-neutral-800/80 backdrop-blur">
        
        {/* Category Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundEngine.playMenuBlip(40);
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30 scale-105"
                  : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800"
              }`}
            >
              {cat === "Threads (Vercel)" ? (
                <>
                  <svg viewBox="0 0 1155 1000" className="w-2.5 h-2.5 fill-current">
                    <path d="m577.3 0 577.4 1000H0z" />
                  </svg>
                  <span>Threads (Vercel)</span>
                </>
              ) : cat === "Miiverse" ? (
                <span>🌐 Miiverse Plaza</span>
              ) : (
                cat
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        {selectedCategory !== "Miiverse" && selectedCategory !== "Threads (Vercel)" && (
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news, games, leaks..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        )}
      </div>

      {/* 4. MAIN SCREEN CONTENT AREA */}
      <main className="relative z-10 flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
        {selectedCategory === "Threads (Vercel)" ? (
          <NintendoThreadsFeed />
        ) : selectedCategory === "Miiverse" ? (
          <CommunityWall />
        ) : (
          <>
            {/* HERO SPOTLIGHT (Featured Nintendo Direct Story) */}
            {featuredArticle && !searchQuery && (
              <div 
                onClick={() => {
                  soundEngine.playConfirmDing();
                  setActiveArticle(featuredArticle);
                }}
                className="group relative rounded-2xl overflow-hidden border border-neutral-700/80 bg-neutral-900 cursor-pointer shadow-xl transition-all duration-300 hover:border-red-500/80 hover:shadow-2xl hover:shadow-red-500/10"
              >
                <div className="relative aspect-[16/7] sm:aspect-[21/8] w-full overflow-hidden">
                  <img 
                    src={featuredArticle.image} 
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${featuredArticle.bannerGradient} mix-blend-multiply opacity-50`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

                  {/* Badges on hero */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-red-600 text-white shadow-lg flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> FEATURED DIRECT SPOTLIGHT
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-black/60 backdrop-blur text-cyan-300 border border-cyan-500/40 font-mono">
                      4K 120FPS VERIFIED
                    </span>
                  </div>

                  {/* Hero Headline Details */}
                  <div className="absolute bottom-4 left-4 right-4 text-left space-y-1.5">
                    <h2 className="text-base sm:text-xl md:text-2xl font-black text-white leading-tight font-['Plus_Jakarta_Sans'] tracking-tight group-hover:text-red-400 transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 max-w-3xl font-medium leading-relaxed">
                      {featuredArticle.summary}
                    </p>
                    <div className="flex items-center gap-4 pt-1 text-[11px] text-neutral-400 font-mono">
                      <span>By {featuredArticle.author}</span>
                      <span>• {featuredArticle.readTime}</span>
                      <span className="flex items-center gap-1 text-red-400 font-bold">
                        <Heart className="w-3.5 h-3.5 fill-current" /> {featuredArticle.likes} Yeahs
                      </span>
                      <span className="flex items-center gap-1 text-cyan-400">
                        <MessageSquare className="w-3.5 h-3.5" /> {featuredArticle.commentsCount} Comments
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NEWS GRID (Layered Cards with Gradient Glow) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredArticles.map((article, index) => (
                <div
                  key={article.id}
                  onClick={() => {
                    soundEngine.playConfirmDing();
                    setActiveArticle(article);
                  }}
                  className={`group relative flex flex-col justify-between bg-neutral-900/90 hover:bg-neutral-850 rounded-xl border p-3.5 transition-all duration-300 cursor-pointer shadow-md hover:-translate-y-1 hover:shadow-xl ${
                    focusedCardIndex === index
                      ? "border-cyan-400 ring-2 ring-cyan-400/30 shadow-cyan-500/20"
                      : "border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  {/* Card Banner Image */}
                  <div className="relative rounded-lg overflow-hidden aspect-[16/9] mb-3">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${article.bannerGradient} mix-blend-multiply opacity-40`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />

                    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider text-white ${article.badgeColor}`}>
                      {article.category}
                    </span>

                    <span className="absolute bottom-2 right-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/70 backdrop-blur text-neutral-300">
                      {article.readTime}
                    </span>
                  </div>

                  {/* Card Text Info */}
                  <div className="flex-1 space-y-1.5">
                    <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors leading-snug line-clamp-2 font-['Plus_Jakarta_Sans']">
                      {article.title}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  {/* Card Bottom Meta Bar */}
                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400 font-mono">
                    <span className="truncate max-w-[120px]">{article.author}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleLike(article.id, e)}
                        className="flex items-center gap-1 hover:text-red-400 transition-colors"
                        title="Give a Yeah! (X)"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>{article.likes}</span>
                      </button>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{article.commentsCount}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="py-12 text-center text-neutral-400 space-y-3">
                <p className="text-sm">No Nintendo news found matching your filter criteria.</p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      soundEngine.playMenuBlip(40);
                      setSelectedCategory("All");
                      setSearchQuery("");
                      setArticles(INITIAL_NINTENDO_NEWS);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg text-xs font-bold shadow-lg transition-all flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Filter & Load All Nintendo News</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* 5. ARTICLE DETAIL READER MODAL */}
      {activeArticle && (
        <NewsReaderModal
          article={activeArticle}
          onClose={() => setActiveArticle(null)}
          onLike={(id) => handleLike(id)}
        />
      )}
    </div>
  );
};
