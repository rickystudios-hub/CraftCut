export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5' | '2:1';

export interface FilterSettings {
  brightness: number; // 0 to 200, default 100
  contrast: number;   // 0 to 200, default 100
  saturation: number; // 0 to 200, default 100
  blur: number;       // 0 to 20, default 0
  grayscale: number;  // 0 to 100, default 0
  sepia: number;      // 0 to 100, default 0
  hueRotate: number;  // 0 to 360, default 0
  vignette: number;   // 0 to 100, default 0 (PRO)
  temperature: number;// -50 to 50, default 0
  sharpness: number;  // 0 to 100, default 0 (PRO)
}

export interface TransformSettings {
  scale: number;      // 0.2 to 3, default 1
  rotation: number;   // 0, 90, 180, 270 degrees
  flipHorizontal: boolean;
  x: number;          // offset x in %
  y: number;          // offset y in %
}

export interface TextStyleSettings {
  text: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  backgroundColor: string;
  isBold: boolean;
  isItalic: boolean;
  x: number; // % 0-100
  y: number; // % 0-100
  strokeColor?: string;
  strokeWidth?: number;
  animation?: 'none' | 'typewriter' | 'glow' | 'bounce' | 'slide-up';
}

export interface ProSettings {
  backgroundRemoved: boolean; // Auto Cutout IA
  chromaKeyEnabled: boolean;  // Tela Verde
  chromaColor: string;
  vocalIsolation: boolean;    // Isolar Voz IA
  noiseReduction: boolean;    // Denoise de Áudio
  stabilization: boolean;     // Estabilizador IA
  smoothSlowMotion: boolean;  // Câmera Lenta Suave (Optical Flow)
  antiFlicker: boolean;       // Removedor de Cintilação
  aiUpscaling: boolean;       // Super Resolução 4K IA
  faceRetouch: boolean;       // Retoque Facial IA
}

export type MaskType = 'none' | 'split' | 'film' | 'circle' | 'rectangle' | 'heart' | 'star';

export interface MediaClip {
  id: string;
  type: 'video' | 'audio' | 'image' | 'text';
  name: string;
  start: number;       // Timeline position in seconds
  duration: number;    // Length of clip in seconds
  offset: number;      // Trim start offset in original file in seconds
  sourceDuration: number; // Total length of original file
  sourceUrl: string;   // Blob or URL
  volume: number;      // 0 to 1 (or up to 5x with boost)
  speed: number;       // 0.1x to 100x
  isMuted: boolean;
  filters: FilterSettings;
  transform: TransformSettings;
  pro: ProSettings;
  mask: MaskType;
  animation: 'none' | 'fade' | 'zoom' | 'slide' | 'glitch';
  textSettings?: TextStyleSettings;
  thumbnailUrl?: string;
  color?: string;      // Color badge for timeline
}

export interface Track {
  id: string;
  type: 'video' | 'audio' | 'text' | 'overlay';
  name: string;
  isMuted: boolean;
  isLocked: boolean;
  clips: MediaClip[];
}

export interface ProjectState {
  id: string;
  name: string;
  aspectRatio: AspectRatio;
  duration: number; // total duration
  currentTime: number;
  isPlaying: boolean;
  zoom: number; // pixels per second (e.g. 30 to 150)
  selectedClipId: string | null;
  tracks: Track[];
}
