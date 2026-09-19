import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// CORS headers to support Vercel app connections and cross-origin embedding
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Initial Comprehensive Nintendo News Database
const NINTENDO_NEWS_DATA = [
  {
    id: "news-sw2-reveal",
    title: "Nintendo Switch 2 Officially Detailed: Custom Tegra T239, DLSS 3.5 & Magnetic Joy-Cons",
    category: "Hardware",
    summary: "Nintendo reveals next-generation hybrid console featuring 8-inch 120Hz HDR OLED, 4K TV output in dock, and backward compatibility with the entire Nintendo Switch library.",
    content: `Kyoto, Japan — Nintendo has officially unveiled full architectural specifications for the next-generation Nintendo Switch 2 console.
    
Powered by a custom silicon co-engineered with NVIDIA, the system features Ampere architecture with dedicated RT Cores and Tensor Cores supporting Deep Learning Super Sampling (DLSS 3.5). The handheld mode boasts a vibrant 7.9-inch 1080p 120Hz VRR OLED display with up to 1000 nits peak HDR brightness.

When placed into the newly redesigned metallic dock with integrated auxiliary cooling and HDMI 2.1, the system seamlessly outputs native upscaled 4K at up to 120 frames per second.

Key Innovations:
• Magnetic Joy-Con 2 attachments with hall-effect zero-drift joysticks and dual optical micro-sensors
• Backwards compatible with both physical cartridges and digital Nintendo Switch titles with enhanced performance patches
• Ultra-fast 256GB / 512GB UFS 3.1 internal storage expandable via MicroSD Express up to 2TB
• Dual USB-C ports (top and bottom) for simultaneous charging and specialized camera/VR accessories.`,
    author: "Nintendo Global PR",
    date: "Today, 10:00 AM",
    readTime: "4 min",
    likes: 3842,
    franchise: "Hardware",
    tags: ["Switch 2", "Hardware", "NVIDIA", "DLSS", "OLED"],
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1200&q=80",
    bannerGradient: "from-red-600 via-rose-500 to-amber-500",
    badgeColor: "bg-red-500",
    featured: true,
    commentsCount: 428,
  },
  {
    id: "news-mario-odyssey-2",
    title: "Super Mario Odyssey: Cosmos Announced as Switch 2 Launch Title",
    category: "First Party",
    summary: "Mario and Cappy journey beyond the stratosphere across gravity-defying celestial kingdoms with real-time planetary deformation.",
    content: `Nintendo EPD Tokyo has revealed the long-anticipated successor to Super Mario Odyssey: 'Super Mario Odyssey: Cosmos'.
    
Players will pilot the Odyssey Cruiser through 18 distinct star systems, utilizing brand-new gravitational capture mechanics. Thanks to the Switch 2's high-speed memory bandwidth, seamless planetary transitions happen in sub-second load times.

Co-op play returns with full Joy-Con split control, allowing Player 2 to control the cosmic star-sprites with precision gyroscope aiming.`,
    author: "Yoshiaki Koizumi",
    date: "Today, 08:30 AM",
    readTime: "3 min",
    likes: 5120,
    franchise: "Super Mario",
    tags: ["Mario", "Launch Title", "3D Platformer", "EPD Tokyo"],
    image: "https://images.unsplash.com/photo-1612287232230-0329437199c0?auto=format&fit=crop&w=1200&q=80",
    bannerGradient: "from-amber-500 via-red-500 to-indigo-600",
    badgeColor: "bg-amber-500",
    featured: true,
    commentsCount: 651,
  },
  {
    id: "news-zelda-chronicles",
    title: "The Legend of Zelda: Echoes of the Past Enhanced Edition & Next Epic Teased",
    category: "Direct Highlights",
    summary: "Eiji Aonuma reveals 60fps 4K enhancements for Tears of the Kingdom alongside an enigmatic teaser for the next Hyrule chapter.",
    content: `Producer Eiji Aonuma took the virtual stage to unveil free performance enhancements for both Breath of the Wild and Tears of the Kingdom on Nintendo Switch 2.
    
Both games will receive ultra-high-definition texture packs, rock-solid 60 FPS in handheld mode and dynamic 4K 60 FPS in docked mode, with improved draw distances and Ray-Traced ambient occlusion.

Furthermore, a 45-second cinematic teaser hinted at an all-new seafaring and subterranean adventure currently in active development.`,
    author: "Eiji Aonuma",
    date: "Yesterday",
    readTime: "5 min",
    likes: 4219,
    franchise: "Zelda",
    tags: ["Zelda", "Tears of the Kingdom", "4K 60FPS", "Aonuma"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    bannerGradient: "from-emerald-600 via-teal-500 to-cyan-500",
    badgeColor: "bg-emerald-500",
    featured: false,
    commentsCount: 312,
  },
  {
    id: "news-metroid-prime-4",
    title: "Metroid Prime 4: Beyond Full Gameplay Walkthrough & Dual-Trigger Gunplay",
    category: "Direct Highlights",
    summary: "Retro Studios shows 15 minutes of exhilarating bounty hunter action powered by Switch 2 analog triggers and spatial audio.",
    content: `Samus Aran returns in full force. Retro Studios detailed Metroid Prime 4: Beyond running natively on Switch 2 hardware.
    
The game utilizes the new analog trigger micro-sensors in the Joy-Con 2 for variable beam charging, hyper-jump altitude throttling, and tactile morph ball maneuvering. 3D Spatial Audio allows bounty hunters to pinpoint cloaked space pirate ambushes with pinpoint acoustic accuracy.`,
    author: "Retro Studios",
    date: "2 days ago",
    readTime: "4 min",
    likes: 2980,
    franchise: "Metroid",
    tags: ["Metroid Prime 4", "Samus Aran", "Retro Studios", "FPS"],
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    bannerGradient: "from-purple-600 via-pink-600 to-blue-500",
    badgeColor: "bg-purple-500",
    featured: false,
    commentsCount: 189,
  },
  {
    id: "news-mario-kart-x",
    title: "Mario Kart X: 24-Player Cross-Dimension Racing & Dynamic Weather Tracks",
    category: "First Party",
    summary: "The ultimate racing title introduces anti-gravity morphing karts, 24 racers per lobby, and custom track builder with community sharing.",
    content: `The successor to the best-selling Mario Kart 8 Deluxe is here: Mario Kart X!
    
Featuring 48 initial tracks that dynamically change laps according to shifting weather, volcanic eruptions, and zero-G dimensional warps. 24 players can now race simultaneously with dedicated rollback netcode and 120 FPS high-refresh rate support.`,
    author: "Kosuke Yabuki",
    date: "3 days ago",
    readTime: "3 min",
    likes: 3740,
    franchise: "Mario Kart",
    tags: ["Mario Kart X", "Racing", "120FPS", "Online"],
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
    bannerGradient: "from-blue-600 via-cyan-500 to-emerald-400",
    badgeColor: "bg-blue-500",
    featured: false,
    commentsCount: 277,
  },
  {
    id: "news-eshop-spring",
    title: "Nintendo eShop Golden Festival Sale: Up to 75% Off Over 1,500 Titles",
    category: "eShop Deals",
    summary: "Massive savings on Smash Bros Ultimate DLC, Kirby and the Forgotten Land, Xenoblade Chronicles 3, and acclaimed indie gems.",
    content: `The Nintendo eShop Golden Festival has officially commenced worldwide!
    
Take advantage of steep discounts on essential first-party masterpieces and indie darlings. All purchases earn 2x My Nintendo Gold Points towards future purchases or Nintendo Switch Online renewals.`,
    author: "eShop Team",
    date: "4 days ago",
    readTime: "2 min",
    likes: 1890,
    franchise: "eShop",
    tags: ["Deals", "eShop", "Sale", "Gold Points"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    bannerGradient: "from-amber-400 via-orange-500 to-red-500",
    badgeColor: "bg-amber-400",
    featured: false,
    commentsCount: 94,
  },
  {
    id: "news-nso-gamecube",
    title: "Nintendo Switch Online Expands: Nintendo GameCube Classics Join the Classics Catalog",
    category: "System & Retro",
    summary: "Wind Waker, Super Smash Bros. Melee, and F-Zero GX arrive with widescreen rendering and online matchmaking.",
    content: `Nintendo Switch Online + Expansion Pack members will receive an unforgettable addition to the retro vault: the Nintendo GameCube Classics app!
    
Enjoy classics like Super Smash Bros. Melee, The Legend of Zelda: The Wind Waker, Luigi's Mansion, and F-Zero GX with optional 16:9 widescreen enhancement, CRT scanline filters, rewinds, and 4-player online matches.`,
    author: "Nintendo Classics",
    date: "5 days ago",
    readTime: "3 min",
    likes: 4610,
    franchise: "Retro",
    tags: ["NSO", "GameCube", "Melee", "Wind Waker", "Retro"],
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1200&q=80",
    bannerGradient: "from-violet-600 via-indigo-600 to-purple-800",
    badgeColor: "bg-violet-500",
    featured: false,
    commentsCount: 520,
  }
];

// Community Miiverse / StreetPass Feed
let communityPosts = [
  {
    id: "comm-1",
    username: "MarioMaster99",
    handle: "@red_cap_plumber",
    avatar: "🍄",
    timeAgo: "12m ago",
    content: "The magnetic Joy-Con snaps on the Switch 2 feel SO satisfying! And playing Metroid in 120Hz is mind-blowing!",
    likes: 184,
    userLiked: false,
    stamp: "Mario",
    gameTag: "Switch 2 Hardware"
  },
  {
    id: "comm-2",
    username: "ZeldaExplorer",
    handle: "@triforce_seeker",
    avatar: "🗡️",
    timeAgo: "34m ago",
    content: "Tears of the Kingdom in 60fps on OLED handheld mode feels like playing a completely remastered dream!",
    likes: 342,
    userLiked: true,
    stamp: "Triforce",
    gameTag: "Zelda TotK"
  },
  {
    id: "comm-3",
    username: "RetroRacer",
    handle: "@fzero_pilot",
    avatar: "🏎️",
    timeAgo: "1h ago",
    content: "GameCube app on NSO with online Melee?! My childhood is back! Let's schedule a tournament in the community hub!",
    likes: 219,
    userLiked: false,
    stamp: "Star",
    gameTag: "NSO GameCube"
  }
];

// API Routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    console: "Nintendo Switch 2",
    osVersion: "20.4.1-NX2",
    dockedReady: true,
    geminiReady: !!process.env.GEMINI_API_KEY
  });
});

// All Nintendo News Feed API
app.get("/api/nintendo/news", (req, res) => {
  const category = req.query.category as string;
  const search = (req.query.search as string || "").toLowerCase();

  let filtered = [...NINTENDO_NEWS_DATA];

  if (category && category !== "All") {
    filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(search) ||
      item.summary.toLowerCase().includes(search) ||
      item.tags.some(t => t.toLowerCase().includes(search))
    );
  }

  res.json({
    timestamp: new Date().toISOString(),
    total: filtered.length,
    articles: filtered,
    categories: ["All", "Hardware", "First Party", "Direct Highlights", "eShop Deals", "System & Retro"]
  });
});

// Real-time Breaking Ticker API
app.get("/api/nintendo/ticker", (req, res) => {
  res.json({
    breaking: [
      "🔥 SWITCH 2 GLOBAL REVEAL: 8-inch 120Hz OLED, DLSS 3.5 & Magnetic Joy-Cons",
      "⭐ SUPER MARIO ODYSSEY COSMOS announced as launch title for holiday window",
      "🎮 FULL BACKWARD COMPATIBILITY confirmed for physical & digital Switch 1 titles",
      "⚡ NINTENDO DIRECT MARCH scheduled for this Thursday 2:00 PM PT",
      "💎 GAMECUBE CLASSICS arriving to Nintendo Switch Online Expansion Pack"
    ]
  });
});

// Community Miiverse Feed API
let nintendoThreads = [
  {
    id: "thread-1",
    title: "Nintendo Switch 2 Magnetic Joy-Cons: Hands-on Impressions & Zero Drift Hype",
    author: "Nintendo Official",
    handle: "@NintendoAmerica",
    avatar: "🍄",
    verified: true,
    content: "The magnetic attachment mechanism on Nintendo Switch 2 feels rock solid! The hall effect sticks completely eliminate drift, and the dual optical sensors introduce precision pointer controls. What games are you most excited to try first? 🎮✨ #NintendoSwitch2 #DirectUpdate",
    timeAgo: "12m ago",
    repliesCount: 384,
    repostsCount: 1240,
    likesCount: 5820,
    userLiked: true,
    gameTag: "Hardware",
    tags: ["Switch2", "JoyCon", "Hardware", "HallEffect"],
    pinned: true,
    vercelSynced: true,
    sourceUrl: "https://threads.net/@NintendoAmerica"
  },
  {
    id: "thread-2",
    title: "Tears of the Kingdom in 60 FPS 4K on Switch 2 Docked Mode is Mindblowing",
    author: "Hyrule Digest",
    handle: "@hyrule_chronicles",
    avatar: "🗡️",
    verified: true,
    content: "We just saw the Breath of the Wild & Tears of the Kingdom 4K 60FPS patches running on the new Switch 2 dock. Ultrahand building has zero hitching, physics simulations run smooth as butter, and draw distances stretch across the entire sky islands! ☁️🏰",
    timeAgo: "45m ago",
    repliesCount: 198,
    repostsCount: 512,
    likesCount: 2940,
    userLiked: false,
    gameTag: "Zelda TotK",
    tags: ["Zelda", "TearsOfTheKingdom", "4K60FPS", "Switch2Patch"],
    vercelSynced: true,
    sourceUrl: "https://threads.net/@hyrule_chronicles"
  },
  {
    id: "thread-3",
    title: "Mario Kart X 24-player netcode with dynamic track transformations",
    author: "Kosuke Yabuki Updates",
    handle: "@kart_central",
    avatar: "🏎️",
    verified: false,
    content: "24 racers in one lobby with instant rewind spectating and dynamic weather! Imagine Rainbow Road morphing through cosmic black holes in 120 FPS. The custom track creator is going to keep this game alive for the next decade.",
    timeAgo: "2h ago",
    repliesCount: 142,
    repostsCount: 320,
    likesCount: 1870,
    userLiked: true,
    gameTag: "Mario Kart X",
    tags: ["MarioKartX", "24Racers", "RollbackNetcode", "120FPS"],
    vercelSynced: true,
    sourceUrl: "https://threads.net/@kart_central"
  }
];

let vercelAppConfig = {
  appUrl: "https://nintendo-news-threads.vercel.app",
  connected: true,
  lastSynced: new Date().toLocaleTimeString(),
  status: "connected"
};

// Nintendo Threads API (Connected to Vercel App)
app.get("/api/nintendo/threads", (req, res) => {
  res.json({
    threads: nintendoThreads,
    vercelConfig: vercelAppConfig,
    totalCount: nintendoThreads.length
  });
});

app.post("/api/nintendo/threads", (req, res) => {
  const newThread = req.body;
  if (!newThread || !newThread.content) {
    return res.status(400).json({ error: "Content is required" });
  }
  nintendoThreads = [newThread, ...nintendoThreads];
  res.json({ success: true, thread: newThread });
});

app.post("/api/nintendo/threads/sync-vercel", (req, res) => {
  const { appUrl } = req.body;
  if (appUrl) {
    vercelAppConfig.appUrl = appUrl;
  }
  vercelAppConfig.lastSynced = new Date().toLocaleTimeString();
  vercelAppConfig.connected = true;

  res.json({
    success: true,
    vercelConfig: vercelAppConfig,
    syncedThreadsCount: nintendoThreads.length,
    threads: nintendoThreads
  });
});

// Community Miiverse Feed API
app.get("/api/nintendo/community", (req, res) => {
  res.json({
    posts: communityPosts,
    activeUsersCount: 14820,
    totalYeahs: communityPosts.reduce((acc, p) => acc + p.likes, 0)
  });
});

// Post to Community Feed
app.post("/api/nintendo/community", (req, res) => {
  const { username, content, stamp, gameTag } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Content is required" });
  }

  const newPost = {
    id: `comm-${Date.now()}`,
    username: username || "Guest Player",
    handle: `@player_${Math.floor(1000 + Math.random() * 9000)}`,
    avatar: stamp === "Mario" ? "🍄" : stamp === "Triforce" ? "🗡️" : stamp === "Star" ? "⭐" : "🎮",
    timeAgo: "Just now",
    content: content.trim(),
    likes: 1,
    userLiked: true,
    stamp: stamp || "Star",
    gameTag: gameTag || "General Nintendo"
  };

  communityPosts = [newPost, ...communityPosts];
  res.json({ post: newPost, success: true });
});

// Like / "Yeah!" a community post
app.post("/api/nintendo/community/:id/like", (req, res) => {
  const postId = req.params.id;
  const post = communityPosts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  if (post.userLiked) {
    post.likes = Math.max(0, post.likes - 1);
    post.userLiked = false;
  } else {
    post.likes += 1;
    post.userLiked = true;
  }

  res.json({ id: post.id, likes: post.likes, userLiked: post.userLiked });
});

// Like an article
app.post("/api/nintendo/news/:id/like", (req, res) => {
  const article = NINTENDO_NEWS_DATA.find(a => a.id === req.params.id);
  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }
  article.likes += 1;
  res.json({ id: article.id, likes: article.likes });
});

// Gemini-Powered Nintendo Intelligence AI Assistant Endpoint
app.post("/api/gemini/nintendo-assistant", async (req, res) => {
  const { question, articleContext } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  const ai = getAI();
  if (!ai) {
    // Intelligent fallback if no key is configured in dev
    return res.json({
      answer: `[Nintendo Central AI Offline Mode]: Regarding "${question}": Nintendo Switch 2 features full backwards compatibility with all Nintendo Switch software. Hardware features custom NVIDIA silicon with DLSS 3.5, 120Hz OLED screen, magnetic Joy-Con attachments, and 4K output in the docked cradle.`
    });
  }

  try {
    const prompt = `You are the official Nintendo Switch 2 News AI Guide, speaking with enthusiasm, charm, and encyclopedic knowledge of Nintendo history, game franchises, hardware specifications, and upcoming releases.
Context regarding current news: ${articleContext || "Nintendo Switch 2 launch, Super Mario Odyssey Cosmos, Zelda enhancements, Metroid Prime 4, Mario Kart X."}

User query: ${question}

Provide an authentic, helpful, and concise response (under 120 words) in characteristic Nintendo Direct charm.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    res.json({ answer: response.text || "Direct feed interrupted. Please check back shortly!" });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    res.json({
      answer: `According to Nintendo Network records: Switch 2 introduces next-gen DLSS upscaling, magnetic Joy-Cons with zero-drift hall effect sensors, and backwards compatibility!`
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nintendo Switch 2 Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
