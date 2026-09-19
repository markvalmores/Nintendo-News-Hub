import React, { useState } from "react";
import { NewsArticle } from "../types";
import { soundEngine } from "../utils/audio";
import { 
  X, 
  Heart, 
  Share2, 
  Sparkles, 
  Send, 
  Clock, 
  User, 
  Tag, 
  Flame,
  Gamepad2,
  Cpu,
  Tv,
  HelpCircle,
  MessageSquare
} from "lucide-react";
import confetti from "canvas-confetti";

interface NewsReaderModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  onLike: (id: string) => void;
}

export const NewsReaderModal: React.FC<NewsReaderModalProps> = ({
  article,
  onClose,
  onLike,
}) => {
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [liked, setLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(article?.likes || 0);

  if (!article) return null;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playYeahSound();
    setLiked(!liked);
    setCurrentLikes(prev => liked ? prev - 1 : prev + 1);
    onLike(article.id);

    // Particle burst
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#ff3b30", "#00c7ff", "#ffd700", "#10b981"]
    });
  };

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoadingAi) return;

    soundEngine.playMenuBlip(100);
    setIsLoadingAi(true);
    setAiAnswer(null);

    try {
      const res = await fetch("/api/gemini/nintendo-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          articleContext: `${article.title}: ${article.summary}\n${article.content}`
        }),
      });
      const data = await res.json();
      setAiAnswer(data.answer);
      soundEngine.playConfirmDing();
    } catch {
      setAiAnswer("Unable to reach Nintendo Central Broadcast. System is operational in offline mode.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[92%] flex flex-col bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden text-neutral-100"
        style={{
          boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(255,60,0,0.15)"
        }}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-950/60 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider text-white ${article.badgeColor}`}>
              {article.category}
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              ID: {article.id.replace("news-", "").toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://threads.net/intent/post?text=${encodeURIComponent(`Check out this Nintendo Switch 2 update: "${article.title}" - Read on Nintendo News Hub!`)}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => soundEngine.playMenuBlip(40)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-cyan-300 border border-neutral-700 transition-all hover:scale-105"
              title="Share to Threads & Vercel App"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Threads</span>
            </a>

            <button
              id="reader-like-button"
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                liked 
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/30" 
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} />
              <span>{currentLikes}</span>
            </button>

            <button
              id="reader-close-button"
              onClick={() => {
                soundEngine.playCancelSwoosh();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              title="Press (B) or Click to Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Banner Graphic with Multi-layer Gradient */}
          <div className="relative rounded-xl overflow-hidden aspect-[16/8] border border-neutral-800 shadow-inner">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${article.bannerGradient} mix-blend-multiply opacity-50`} />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
            
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
              <span className="flex items-center gap-1 bg-black/60 backdrop-blur px-2.5 py-1 rounded-md">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {article.readTime} read
              </span>
              <span className="flex items-center gap-1 bg-black/60 backdrop-blur px-2.5 py-1 rounded-md">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                {article.author}
              </span>
            </div>
          </div>

          {/* Title and Summary */}
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-tight font-['Plus_Jakarta_Sans']">
              {article.title}
            </h1>
            <p className="mt-2 text-sm text-neutral-300 font-medium leading-relaxed bg-neutral-800/40 p-3 rounded-lg border-l-2 border-red-500">
              {article.summary}
            </p>
          </div>

          {/* Hardware & Spec Badges */}
          {article.category === "Hardware" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2">
              <div className="bg-neutral-800/60 p-2.5 rounded-lg border border-neutral-700/40">
                <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold">
                  <Cpu className="w-3.5 h-3.5" /> Silicon
                </div>
                <div className="text-xs font-bold text-white mt-1">NVIDIA T239 (DLSS 3.5)</div>
              </div>
              <div className="bg-neutral-800/60 p-2.5 rounded-lg border border-neutral-700/40">
                <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold">
                  <Tv className="w-3.5 h-3.5" /> Output
                </div>
                <div className="text-xs font-bold text-white mt-1">4K 120Hz HDR Docked</div>
              </div>
              <div className="bg-neutral-800/60 p-2.5 rounded-lg border border-neutral-700/40 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <Gamepad2 className="w-3.5 h-3.5" /> Controls
                </div>
                <div className="text-xs font-bold text-white mt-1">Magnetic Joy-Con 2 (Hall)</div>
              </div>
            </div>
          )}

          {/* Article Full Body */}
          <div className="text-sm text-neutral-300 space-y-3 leading-relaxed whitespace-pre-line font-sans">
            {article.content}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-neutral-800">
            {article.tags.map((tag) => (
              <span 
                key={tag}
                className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700/50 font-mono"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>

          {/* Gemini-Powered "Ask Nintendo Intelligence" AI Assistant */}
          <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-br from-neutral-800/80 via-neutral-900 to-indigo-950/40 border border-indigo-500/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-red-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide">
                Nintendo Direct AI Assistant
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                Gemini 3.8 Flash
              </span>
            </div>

            <p className="text-[11px] text-neutral-400 mb-2">
              Have questions about this announcement, tech specs, or franchise lore? Ask below!
            </p>

            <form onSubmit={handleAskAi} className="flex gap-2">
              <input 
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about backwards compatibility, release dates, specs..."
                className="flex-1 bg-neutral-950 border border-neutral-700/70 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={isLoadingAi || !question.trim()}
                className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-cyan-600 hover:from-red-500 hover:to-cyan-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-md"
              >
                {isLoadingAi ? (
                  <span className="animate-spin text-xs">🌀</span>
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    <span>Ask</span>
                  </>
                )}
              </button>
            </form>

            {aiAnswer && (
              <div className="mt-3 p-2.5 rounded-lg bg-neutral-950/80 border border-cyan-500/30 text-xs text-neutral-200 leading-relaxed animate-in fade-in">
                <div className="text-[10px] font-bold text-cyan-400 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Official Nintendo Intel Response:
                </div>
                {aiAnswer}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-950 border-t border-neutral-800 text-[11px] text-neutral-500 font-mono">
          <span>Press (B) or click [X] to exit</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Verified Nintendo Broadcast Feed
          </span>
        </div>
      </div>
    </div>
  );
};
