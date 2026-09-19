import React, { useState, useEffect } from "react";
import { CommunityPost } from "../types";
import { soundEngine } from "../utils/audio";
import { Send, ThumbsUp, MessageSquare, Sparkles, PlusCircle } from "lucide-react";
import confetti from "canvas-confetti";

export const CommunityWall: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newContent, setNewContent] = useState("");
  const [selectedStamp, setSelectedStamp] = useState("Mario");
  const [gameTag, setGameTag] = useState("Switch 2 Hardware");
  const [isPosting, setIsPosting] = useState(false);
  const [activeUsers, setActiveUsers] = useState(14820);

  const stamps = [
    { id: "Mario", icon: "🍄", label: "Super Mario" },
    { id: "Triforce", icon: "🗡️", label: "Zelda" },
    { id: "Star", icon: "⭐", label: "Power Star" },
    { id: "Kart", icon: "🏎️", label: "Mario Kart" },
    { id: "Metroid", icon: "🚀", label: "Metroid" },
  ];

  const fetchCommunity = async () => {
    try {
      const res = await fetch("/api/nintendo/community");
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
      if (data.activeUsersCount) {
        setActiveUsers(data.activeUsersCount);
      }
    } catch (e) {
      console.error("Failed to fetch community posts", e);
    }
  };

  useEffect(() => {
    fetchCommunity();
    const interval = setInterval(fetchCommunity, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || isPosting) return;

    setIsPosting(true);
    soundEngine.playSwitchSnap();

    try {
      const res = await fetch("/api/nintendo/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "Switch2Explorer",
          content: newContent.trim(),
          stamp: selectedStamp,
          gameTag: gameTag,
        }),
      });
      const data = await res.json();
      if (data.success && data.post) {
        setPosts(prev => [data.post, ...prev]);
        setNewContent("");
        soundEngine.playConfirmDing();
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.7 },
          colors: ["#ff3b30", "#00c7ff", "#ffd700"]
        });
      }
    } catch {
      soundEngine.playCancelSwoosh();
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikePost = async (id: string) => {
    soundEngine.playYeahSound();
    confetti({
      particleCount: 15,
      spread: 35,
      origin: { y: 0.6 },
      colors: ["#ffd700", "#ff3b30"]
    });

    // Optimistic update
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            userLiked: !p.userLiked,
            likes: p.userLiked ? p.likes - 1 : p.likes + 1,
          };
        }
        return p;
      })
    );

    try {
      await fetch(`/api/nintendo/community/${id}/like`, { method: "POST" });
    } catch {
      // ignore
    }
  };

  return (
    <div className="h-full flex flex-col p-3 sm:p-4 space-y-4 overflow-y-auto">
      {/* Header Banner */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-red-600/30 via-purple-600/20 to-cyan-600/30 border border-neutral-700/60 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl animate-bounce">🌐</span>
          <div>
            <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
              Nintendo Switch 2 Miiverse & StreetPass Plaza
            </h2>
            <p className="text-[11px] text-neutral-400">
              Share impressions, launch theories, and stamp reactions with global players
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-neutral-400 font-mono uppercase">Online Players</div>
          <div className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {activeUsers.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Post Composer */}
      <form onSubmit={handleCreatePost} className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="font-bold text-neutral-200 flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-red-500" /> Post a Message to the Plaza
          </span>
          <select 
            value={gameTag}
            onChange={(e) => setGameTag(e.target.value)}
            className="bg-neutral-950 text-neutral-300 text-[11px] px-2 py-1 rounded border border-neutral-700 focus:outline-none"
          >
            <option value="Switch 2 Hardware">Switch 2 Hardware</option>
            <option value="Super Mario Cosmos">Super Mario Cosmos</option>
            <option value="Zelda TotK 4K">Zelda TotK 4K</option>
            <option value="Metroid Prime 4">Metroid Prime 4</option>
            <option value="NSO Classics">NSO Classics</option>
          </select>
        </div>

        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="What are your thoughts on Nintendo Switch 2? Share your launch hype or game wishes..."
          rows={2}
          maxLength={240}
          className="w-full bg-neutral-950 border border-neutral-700/70 rounded-lg p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
        />

        <div className="flex items-center justify-between pt-1">
          {/* Stamps selection */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-neutral-400 mr-1 hidden sm:inline">Stamp:</span>
            {stamps.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  soundEngine.playMenuBlip(50);
                  setSelectedStamp(s.id);
                }}
                className={`text-base p-1 rounded-md transition-all ${
                  selectedStamp === s.id 
                    ? "bg-red-500/30 border border-red-500 scale-110 shadow-sm" 
                    : "hover:bg-neutral-800 opacity-70 hover:opacity-100"
                }`}
                title={s.label}
              >
                {s.icon}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={!newContent.trim() || isPosting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-all shadow-md"
          >
            <Send className="w-3 h-3" />
            <span>Send (A)</span>
          </button>
        </div>
      </form>

      {/* Community Messages List */}
      <div className="space-y-2.5">
        {posts.map((post) => (
          <div 
            key={post.id}
            className="p-3 bg-neutral-900/60 hover:bg-neutral-800/60 border border-neutral-800/80 hover:border-neutral-700 rounded-xl transition-all shadow-sm flex gap-3"
          >
            {/* Avatar & Stamp */}
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 border border-neutral-600 flex items-center justify-center text-lg shadow-inner">
                {post.avatar}
              </div>
              <span className="text-[10px] font-mono text-neutral-400 mt-1">{post.stamp}</span>
            </div>

            {/* Post Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{post.username}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">{post.handle}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-cyan-400 font-mono">
                    {post.gameTag}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">{post.timeAgo}</span>
              </div>

              <p className="text-xs text-neutral-200 mt-1.5 leading-relaxed">
                {post.content}
              </p>

              {/* Action Bar */}
              <div className="mt-2.5 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleLikePost(post.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    post.userLiked 
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" 
                      : "bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white"
                  }`}
                >
                  <span>⭐ Yeah!</span>
                  <span>{post.likes}</span>
                </button>

                <span className="text-[10px] text-neutral-400">
                  StreetPass ID #{post.id.slice(-4)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
