export type ConsoleMode = 'handheld' | 'docked' | 'tabletop';

export type JoyconTheme = 'neon' | 'titanium' | 'retro' | 'atomic';

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  likes: number;
  franchise: string;
  tags: string[];
  image: string;
  bannerGradient: string;
  badgeColor: string;
  featured: boolean;
  commentsCount: number;
}

export interface CommunityPost {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  timeAgo: string;
  content: string;
  likes: number;
  userLiked: boolean;
  stamp: string;
  gameTag: string;
}

export interface GamepadButtonState {
  a: boolean;
  b: boolean;
  x: boolean;
  y: boolean;
  dpadUp: boolean;
  dpadDown: boolean;
  dpadLeft: boolean;
  dpadRight: boolean;
  l: boolean;
  r: boolean;
  zl: boolean;
  zr: boolean;
  plus: boolean;
  minus: boolean;
  home: boolean;
  capture: boolean;
  leftStickPress: boolean;
  rightStickPress: boolean;
}

export interface GamepadStatus {
  connected: boolean;
  id: string;
  isJoycon: boolean;
  isJoycon1: boolean;
  isJoycon2: boolean;
  buttons: GamepadButtonState;
  axes: [number, number, number, number]; // lx, ly, rx, ry
}

export interface DisplaySettings {
  crtScanlines: boolean;
  oledBloom: boolean;
  holographicVfx: boolean;
  audioEnabled: boolean;
  musicPlaying: boolean;
  meshWireframe: boolean;
  aspectRatio: 'auto' | 'widescreen' | 'phone' | 'ultra';
  rotation: number; // 0, 90, 180, 270 degrees
}
