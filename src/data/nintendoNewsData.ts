import { NewsArticle, NintendoThread } from "../types";

export const INITIAL_NINTENDO_NEWS: NewsArticle[] = [
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
    likes: 4120,
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
    likes: 5410,
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
    likes: 4380,
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
    likes: 3120,
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
    likes: 3890,
    franchise: "Mario Kart",
    tags: ["Mario Kart X", "Racing", "120FPS", "Online"],
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
    bannerGradient: "from-blue-600 via-cyan-500 to-emerald-400",
    badgeColor: "bg-blue-500",
    featured: false,
    commentsCount: 294,
  },
  {
    id: "news-eshop-spring-sale",
    title: "Nintendo eShop Switch 2 Celebration Sale: Up to 75% Off First-Party Classics",
    category: "eShop Deals",
    summary: "Celebrate the arrival of Nintendo Switch 2 with massive discounts on Super Smash Bros. Ultimate, Animal Crossing, and Kirby and the Forgotten Land.",
    content: `Nintendo of America has launched the largest digital celebration in eShop history.
    
Over 2,500 titles are discounted, with free Switch 2 enhanced patches included for all participating digital purchases. Highlights include Super Smash Bros Ultimate Fighters Pass Bundles, Xenoblade Chronicles 3, and Luigi's Mansion 3.`,
    author: "Nintendo eShop Team",
    date: "Yesterday",
    readTime: "2 min",
    likes: 2150,
    franchise: "eShop",
    tags: ["eShop", "Deals", "Sales", "Discounts"],
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1200&q=80",
    bannerGradient: "from-rose-600 via-orange-500 to-amber-400",
    badgeColor: "bg-rose-500",
    featured: false,
    commentsCount: 98,
  },
  {
    id: "news-gamecube-nso",
    title: "GameCube Classics Arrive to Nintendo Switch Online + Expansion Pack with Netplay",
    category: "System & Retro",
    summary: "Super Smash Bros. Melee, The Legend of Zelda: The Wind Waker, and F-Zero GX join NSO with 4K upscaling, CRT scanline filter, and rollback online multiplayer.",
    content: `Nintendo Switch Online is entering the 128-bit era. Beginning next month, Nintendo GameCube will join the Expansion Pack lineup.
    
Each game includes support for original GameCube controllers via USB adapter, save states, rewind features, and low-latency rollback netplay for 4-player couch classics.`,
    author: "Nintendo Online Services",
    date: "4 days ago",
    readTime: "3 min",
    likes: 4780,
    franchise: "Retro",
    tags: ["GameCube", "NSO", "Melee", "Wind Waker", "F-Zero GX"],
    image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=1200&q=80",
    bannerGradient: "from-violet-600 via-purple-600 to-indigo-700",
    badgeColor: "bg-violet-600",
    featured: false,
    commentsCount: 512,
  },
  {
    id: "news-pokemon-legends-za",
    title: "Pokémon Legends: Z-A Nintendo Switch 2 Enhanced Edition Confirmed for Simultaneous Launch",
    category: "First Party",
    summary: "The Pokémon Company confirms Pokémon Legends: Z-A will feature an exclusive Switch 2 enhanced version with unlocked frame rates and Lumiose City ray-tracing.",
    content: `During an exclusive investor briefing, The Pokémon Company confirmed that Pokémon Legends: Z-A will launch with full day-one enhancements for Nintendo Switch 2.
    
Urban redevelopment in Lumiose City benefits from native high dynamic range, dense NPC crowd simulations, and lightning-quick fast travel across all five districts.`,
    author: "The Pokémon Company",
    date: "5 days ago",
    readTime: "4 min",
    likes: 3620,
    franchise: "Pokemon",
    tags: ["Pokemon", "Legends Z-A", "Mega Evolution", "Game Freak"],
    image: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=1200&q=80",
    bannerGradient: "from-cyan-600 via-teal-600 to-emerald-500",
    badgeColor: "bg-cyan-600",
    featured: false,
    commentsCount: 340,
  }
];

export const INITIAL_NINTENDO_THREADS: NintendoThread[] = [
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
  },
  {
    id: "thread-4",
    title: "Super Mario Odyssey: Cosmos planetary physics & co-op gameplay breakdown",
    author: "Mushroom Kingdom Wire",
    handle: "@mario_wire",
    avatar: "⭐",
    verified: true,
    content: "EPD Tokyo is taking Mario to celestial scales! Sub-second load times between planets using the Switch 2 fast storage, and player 2 using the right Joy-Con pointer to manipulate gravitational slingshots. Holiday launch can't come soon enough!",
    timeAgo: "4h ago",
    repliesCount: 89,
    repostsCount: 210,
    likesCount: 1420,
    userLiked: false,
    gameTag: "Mario Cosmos",
    tags: ["MarioCosmos", "SuperMario", "EPDTokyo", "NintendoDirect"],
    vercelSynced: true,
    sourceUrl: "https://threads.net/@mario_wire"
  },
  {
    id: "thread-5",
    title: "Metroid Prime 4 Beyond: Dual-Stage Analog Triggers for variable charge beams",
    author: "Bounty Hunter Logs",
    handle: "@samus_hq",
    avatar: "🚀",
    verified: false,
    content: "Retro Studios confirmed that the new Joy-Con analog triggers let you physically half-pull to charge elemental beams and full-pull to release super missiles. Tactile immersion is on another level on the 8-inch 120Hz OLED screen!",
    timeAgo: "6h ago",
    repliesCount: 67,
    repostsCount: 145,
    likesCount: 980,
    userLiked: false,
    gameTag: "Metroid Prime 4",
    tags: ["MetroidPrime4", "RetroStudios", "AnalogTriggers", "Samus"],
    vercelSynced: true,
    sourceUrl: "https://threads.net/@samus_hq"
  }
];

export const INITIAL_BREAKING_TICKER: string[] = [
  "🔥 SWITCH 2 GLOBAL REVEAL: 8-inch 120Hz OLED, DLSS 3.5 & Magnetic Joy-Cons",
  "⭐ SUPER MARIO ODYSSEY COSMOS announced as launch title for holiday window",
  "🎮 FULL BACKWARD COMPATIBILITY confirmed for physical & digital Switch 1 titles",
  "⚡ NINTENDO DIRECT MARCH scheduled for this Thursday 2:00 PM PT",
  "💎 GAMECUBE CLASSICS arriving to Nintendo Switch Online Expansion Pack with online netplay",
  "🌐 NINTENDO THREADS & COMMUNITY VERCEL APP SYNC LIVE FOR REAL-TIME DISCUSSIONS"
];
