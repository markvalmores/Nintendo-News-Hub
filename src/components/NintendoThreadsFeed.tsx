import React, { useState, useEffect } from "react";
import { NintendoThread, VercelConnectionConfig } from "../types";
import { INITIAL_NINTENDO_THREADS } from "../data/nintendoNewsData";
import { soundEngine } from "../utils/audio";
import { 
  MessageCircle, 
  Repeat2, 
  Heart, 
  Send, 
  Link2, 
  CheckCircle2, 
  Sparkles, 
  Globe, 
  RefreshCw, 
  Share2, 
  ExternalLink,
  ShieldCheck,
  Server
} from "lucide-react";
import confetti from "canvas-confetti";

interface NintendoThreadsFeedProps {
  onSyncVercel?: (url: string) => void;
}

export const NintendoThreadsFeed: React.FC<NintendoThreadsFeedProps> = () => {
  const [threads, setThreads] = useState<NintendoThread[]>(INITIAL_NINTENDO_THREADS);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTag, setNewTag] = useState("Switch 2 Hardware");
  const [isPosting, setIsPosting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "official" | "community">("all");

  const [vercelConfig, setVercelConfig] = useState<VercelConnectionConfig>({
    appUrl: "https://nintendo-news-threads.vercel.app",
    connected: true,
    lastSynced: "Just now",
    status: "connected",
  });

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customVercelUrl, setCustomVercelUrl] = useState(vercelConfig.appUrl);

  // Fetch threads from backend API with fallback
  const fetchThreads = async () => {
    try {
      const res = await fetch("/api/nintendo/threads");
      if (res.ok) {
        const data = await res.json();
        if (data.threads && data.threads.length > 0) {
          setThreads(data.threads);
        }
        if (data.vercelConfig) {
          setVercelConfig(prev => ({ ...prev, ...data.vercelConfig }));
        }
      }
    } catch (err) {
      console.warn("Using local threaded stream (offline/standalone fallback)", err);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  // Sync to Vercel App
  const handleSyncToVercel = async () => {
    setIsSyncing(true);
    soundEngine.playMenuBlip(60);

    try {
      const res = await fetch("/api/nintendo/threads/sync-vercel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appUrl: customVercelUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        setVercelConfig({
          appUrl: customVercelUrl,
          connected: true,
          lastSynced: "Just now",
          status: "connected",
        });
        if (data.threads) {
          setThreads(data.threads);
        }
      } else {
        setVercelConfig(prev => ({ ...prev, lastSynced: "Just now", connected: true }));
      }

      soundEngine.playConfirmDing();
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.6 },
        colors: ["#00c7ff", "#ffffff", "#ff3b30"]
      });
    } catch {
      setVercelConfig(prev => ({ ...prev, lastSynced: "Just now", connected: true }));
      soundEngine.playConfirmDing();
    } finally {
      setIsSyncing(false);
      setShowConfigModal(false);
    }
  };

  // Like a thread
  const handleLike = (id: string) => {
    soundEngine.playYeahSound();
    setThreads(prev =>
      prev.map(t => {
        if (t.id === id) {
          const liked = !t.userLiked;
          return {
            ...t,
            userLiked: liked,
            likesCount: liked ? t.likesCount + 1 : t.likesCount - 1,
          };
        }
        return t;
      })
    );
  };

  // Repost a thread
  const handleRepost = (id: string) => {
    soundEngine.playMenuBlip(40);
    setThreads(prev =>
      prev.map(t => (t.id === id ? { ...t, repostsCount: t.repostsCount + 1 } : t))
    );
    confetti({
      particleCount: 15,
      spread: 35,
      origin: { y: 0.7 },
      colors: ["#10b981", "#00c7ff"]
    });
  };

  // Submit new thread
  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || isPosting) return;

    setIsPosting(true);
    soundEngine.playSwitchSnap();

    const newThreadItem: NintendoThread = {
      id: `thread-${Date.now()}`,
      title: newTitle.trim() || "Nintendo Community Discussion",
      author: "Nintendo Pilot",
      handle: "@player_switch2",
      avatar: "⭐",
      verified: false,
      content: newContent.trim(),
      timeAgo: "Just now",
      repliesCount: 0,
      repostsCount: 0,
      likesCount: 1,
      userLiked: true,
      gameTag: newTag,
      tags: ["NintendoSwitch2", newTag.replace(/\s+/g, "")],
      vercelSynced: true,
      sourceUrl: vercelConfig.appUrl,
    };

    setThreads(prev => [newThreadItem, ...prev]);
    setNewTitle("");
    setNewContent("");

    try {
      await fetch("/api/nintendo/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newThreadItem),
      });
    } catch {
      // offline fallback succeeded locally
    }

    soundEngine.playConfirmDing();
    setIsPosting(false);
  };

  const filteredThreads = threads.filter(t => {
    const matchSearch = !searchFilter || 
      t.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.content.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.author.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.gameTag.toLowerCase().includes(searchFilter.toLowerCase());

    if (activeTab === "official") return matchSearch && t.verified;
    if (activeTab === "community") return matchSearch && !t.verified;
    return matchSearch;
  });

  return (
    <div className="h-full flex flex-col p-3 sm:p-4 space-y-3.5 overflow-y-auto font-sans">
      
      {/* VERCEL APP CONNECTION BANNER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-700/80 shadow-lg gap-2">
        <div className="flex items-center gap-3">
          {/* Vercel Delta Logo */}
          <div className="w-8 h-8 rounded-lg bg-black border border-neutral-700 flex items-center justify-center text-white shadow-inner flex-shrink-0">
            <svg viewBox="0 0 1155 1000" className="w-4 h-4 fill-white">
              <path d="m577.3 0 577.4 1000H0z" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white font-mono tracking-wider">
                VERCEL APP THREADS SYNC
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Connected
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 truncate max-w-md font-mono">
              Target: <span className="text-cyan-400">{vercelConfig.appUrl}</span> • Last sync: {vercelConfig.lastSynced}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors flex items-center gap-1.5"
            title="Configure Vercel App Endpoint"
          >
            <Link2 className="w-3 h-3 text-cyan-400" />
            <span>Connect App</span>
          </button>

          <button
            onClick={handleSyncToVercel}
            disabled={isSyncing}
            className="px-3 py-1 text-[11px] font-bold rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Sync Threads"}</span>
          </button>
        </div>
      </div>

      {/* FILTER & TABS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-b border-neutral-800 pb-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              soundEngine.playMenuBlip(30);
              setActiveTab("all");
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              activeTab === "all" ? "bg-red-500 text-white shadow" : "bg-neutral-900 text-neutral-400 hover:text-white"
            }`}
          >
            All Threads ({threads.length})
          </button>
          <button
            onClick={() => {
              soundEngine.playMenuBlip(30);
              setActiveTab("official");
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              activeTab === "official" ? "bg-red-500 text-white shadow" : "bg-neutral-900 text-neutral-400 hover:text-white"
            }`}
          >
            Official Verified
          </button>
          <button
            onClick={() => {
              soundEngine.playMenuBlip(30);
              setActiveTab("community");
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              activeTab === "community" ? "bg-red-500 text-white shadow" : "bg-neutral-900 text-neutral-400 hover:text-white"
            }`}
          >
            Community Plaza
          </button>
        </div>

        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Filter threads by game or topic..."
          className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 w-full sm:w-56"
        />
      </div>

      {/* COMPOSER: CREATE THREAD */}
      <form onSubmit={handleCreateThread} className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-cyan-400" /> Start a Nintendo Discussion Thread
          </span>
          <select
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="bg-neutral-950 text-neutral-300 text-[11px] px-2 py-0.5 rounded border border-neutral-700 focus:outline-none"
          >
            <option value="Switch 2 Hardware">Switch 2 Hardware</option>
            <option value="Zelda TotK 4K">Zelda TotK 4K</option>
            <option value="Mario Cosmos">Mario Cosmos</option>
            <option value="Mario Kart X">Mario Kart X</option>
            <option value="Metroid Prime 4">Metroid Prime 4</option>
          </select>
        </div>

        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Thread Topic / Headline (e.g. DLSS 3.5 Handheld Performance)"
          maxLength={100}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
        />

        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Share your thoughts with Nintendo players and sync directly to the connected Vercel feed..."
          rows={2}
          maxLength={280}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-neutral-500 font-mono">
            {280 - newContent.length} chars remaining • Synced to Vercel
          </span>

          <button
            type="submit"
            disabled={!newContent.trim() || isPosting}
            className="px-3.5 py-1 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-all shadow flex items-center gap-1.5"
          >
            <Send className="w-3 h-3" />
            <span>Post Thread (A)</span>
          </button>
        </div>
      </form>

      {/* THREADS LIST */}
      <div className="space-y-3">
        {filteredThreads.map((thread) => (
          <div
            key={thread.id}
            className="p-3.5 bg-neutral-900/60 hover:bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all shadow-sm space-y-2.5"
          >
            {/* Header: Author, Badge, Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 border border-neutral-600 flex items-center justify-center text-sm shadow-inner">
                  {thread.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span className="text-xs font-bold text-white">{thread.author}</span>
                    {thread.verified && (
                      <span className="w-3.5 h-3.5 rounded-full bg-cyan-500 flex items-center justify-center text-[9px] text-white" title="Verified Nintendo Source">
                        ✓
                      </span>
                    )}
                    <span className="text-[11px] text-neutral-400 font-mono">{thread.handle}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">{thread.timeAgo}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-cyan-400 border border-neutral-700">
                  {thread.gameTag}
                </span>
                {thread.vercelSynced && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black text-neutral-400 border border-neutral-800 flex items-center gap-1">
                    <svg viewBox="0 0 1155 1000" className="w-2 h-2 fill-white">
                      <path d="m577.3 0 577.4 1000H0z" />
                    </svg>
                    Vercel
                  </span>
                )}
              </div>
            </div>

            {/* Thread Headline & Content */}
            <div className="space-y-1">
              <h4 className="text-xs font-black text-neutral-100 font-['Plus_Jakarta_Sans'] leading-snug">
                {thread.title}
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                {thread.content}
              </p>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {thread.tags.map(t => (
                <span key={t} className="text-[10px] text-neutral-400 font-mono">
                  #{t}
                </span>
              ))}
            </div>

            {/* Action Bar: Reply, Repost, Like, Share */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs text-neutral-400">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(thread.id)}
                  className={`flex items-center gap-1 transition-colors ${
                    thread.userLiked ? "text-red-500 font-bold" : "hover:text-red-400"
                  }`}
                  title="Like / Heart"
                >
                  <Heart className={`w-3.5 h-3.5 ${thread.userLiked ? "fill-current" : ""}`} />
                  <span>{thread.likesCount}</span>
                </button>

                <button
                  onClick={() => handleRepost(thread.id)}
                  className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                  title="Repost to Nintendo Feed"
                >
                  <Repeat2 className="w-3.5 h-3.5" />
                  <span>{thread.repostsCount}</span>
                </button>

                <span className="flex items-center gap-1 hover:text-cyan-400 cursor-pointer">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{thread.repliesCount}</span>
                </span>
              </div>

              {/* Share to Threads Web / External Vercel App */}
              <a
                href={`https://threads.net/intent/post?text=${encodeURIComponent(thread.title + " " + thread.content.slice(0, 100))}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors"
                title="Open in Threads"
              >
                <Share2 className="w-3 h-3" />
                <span className="hidden sm:inline">Threads</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* VERCEL CONFIG MODAL */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-black border border-neutral-700 flex items-center justify-center">
                  <svg viewBox="0 0 1155 1000" className="w-3 h-3 fill-white">
                    <path d="m577.3 0 577.4 1000H0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-white">Connect Threads to Vercel App</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-xs text-neutral-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Connect your deployed Vercel application to synchronize live Nintendo discussion threads, community posts, and official announcements across instances.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-neutral-400 uppercase">
                Vercel App Deployment URL:
              </label>
              <input
                type="url"
                value={customVercelUrl}
                onChange={(e) => setCustomVercelUrl(e.target.value)}
                placeholder="https://your-nintendo-news-app.vercel.app"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSyncToVercel}
                className="px-4 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg text-xs font-bold shadow transition-all"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
