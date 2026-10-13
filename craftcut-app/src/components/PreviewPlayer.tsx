import React, { useRef, useEffect, useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw,
  Maximize2,
  Upload
} from 'lucide-react';
import type { AspectRatio, ProjectState, MediaClip } from '../types/editor';

interface PreviewPlayerProps {
  project: ProjectState;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  aspectRatio: AspectRatio;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onAddClip?: (clip: MediaClip) => void;
}

export const PreviewPlayer: React.FC<PreviewPlayerProps> = ({
  project,
  onTogglePlay,
  aspectRatio,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onAddClip,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoCacheRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Find active video clip on main video track
  const activeVideoClip = project.tracks
    .find((t) => t.type === 'video' && !t.isMuted)
    ?.clips.find(
      (c) => project.currentTime >= c.start && project.currentTime < c.start + c.duration
    );

  // Find active overlay / PIP clips (from overlay tracks or additional video tracks)
  const activeOverlayClips = project.tracks
    .filter((t) => t.type === 'overlay' && !t.isMuted)
    .flatMap((t) => t.clips)
    .filter(
      (c) => project.currentTime >= c.start && project.currentTime < c.start + c.duration
    );

  // Find active text clips
  const activeTextClips = project.tracks
    .filter((t) => t.type === 'text' && !t.isMuted)
    .flatMap((t) => t.clips)
    .filter(
      (c) => project.currentTime >= c.start && project.currentTime < c.start + c.duration
    );

  // Pre-load / sync video elements
  useEffect(() => {
    project.tracks.forEach((track) => {
      track.clips.forEach((clip) => {
        if (clip.type === 'video' && clip.sourceUrl && !videoCacheRef.current.has(clip.id)) {
          const video = document.createElement('video');
          video.src = clip.sourceUrl;
          video.crossOrigin = 'anonymous';
          video.muted = true;
          video.playsInline = true;
          video.preload = 'auto';
          videoCacheRef.current.set(clip.id, video);
        } else if (clip.type === 'image' && clip.sourceUrl && !imageCacheRef.current.has(clip.id)) {
          const img = new Image();
          img.src = clip.sourceUrl;
          img.crossOrigin = 'anonymous';
          imageCacheRef.current.set(clip.id, img);
        }
      });
    });
  }, [project.tracks]);

  // Sync video playback time with timeline
  useEffect(() => {
    if (activeVideoClip && activeVideoClip.sourceUrl) {
      const video = videoCacheRef.current.get(activeVideoClip.id);
      if (video && video.readyState >= 2) {
        const targetTime = (project.currentTime - activeVideoClip.start) * activeVideoClip.speed + activeVideoClip.offset;
        if (Math.abs(video.currentTime - targetTime) > 0.15) {
          video.currentTime = Math.max(0, targetTime);
        }
        if (project.isPlaying && video.paused) {
          video.play().catch(() => {});
        } else if (!project.isPlaying && !video.paused) {
          video.pause();
        }
      }
    }
  }, [project.currentTime, project.isPlaying, activeVideoClip]);

  // Render to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 1080;
    let height = 1920;
    if (aspectRatio === '16:9') {
      width = 1920;
      height = 1080;
    } else if (aspectRatio === '1:1') {
      width = 1080;
      height = 1080;
    } else if (aspectRatio === '4:5') {
      width = 1080;
      height = 1350;
    }

    canvas.width = width;
    canvas.height = height;

    // Pitch black background like CapCut
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Helper to draw a clip
    const renderClip = (clip: MediaClip, isPIP: boolean = false) => {
      const clipElapsed = project.currentTime - clip.start;
      const progress = clipElapsed / clip.duration;

      ctx.save();

      // Apply Transition effect if at start of clip
      if (clip.transition && clip.transition.type !== 'none' && clipElapsed < clip.transition.duration) {
        const transProg = clipElapsed / clip.transition.duration;
        if (clip.transition.type === 'dissolve') {
          ctx.globalAlpha = Math.min(1, Math.max(0, transProg));
        } else if (clip.transition.type === 'dip-black') {
          ctx.globalAlpha = Math.min(1, Math.max(0, transProg));
        } else if (clip.transition.type === 'zoom') {
          const zoomScale = 1.25 - transProg * 0.25;
          ctx.scale(zoomScale, zoomScale);
        } else if (clip.transition.type === 'wipe-left') {
          ctx.beginPath();
          ctx.rect(0, 0, width * transProg, height);
          ctx.clip();
        } else if (clip.transition.type === 'glitch') {
          ctx.translate((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8);
        }
      }

      // Apply Filters
      const f = clip.filters;
      ctx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) blur(${f.blur}px) grayscale(${f.grayscale}%) sepia(${f.sepia}%) hue-rotate(${f.hueRotate}deg)`;

      // Apply Blend Mode if PIP
      if (clip.blendMode && clip.blendMode !== 'normal') {
        ctx.globalCompositeOperation = clip.blendMode as GlobalCompositeOperation;
      }

      // Apply Transforms
      const pipScaleFactor = isPIP ? 0.45 : 1.0;
      const pipXOffset = isPIP ? (width * 0.25) : 0;
      const pipYOffset = isPIP ? (-height * 0.25) : 0;

      ctx.translate(
        width / 2 + (clip.transform.x * width) / 100 + pipXOffset,
        height / 2 + (clip.transform.y * height) / 100 + pipYOffset
      );
      ctx.rotate((clip.transform.rotation * Math.PI) / 180);
      ctx.scale(
        clip.transform.flipHorizontal
          ? -clip.transform.scale * pipScaleFactor
          : clip.transform.scale * pipScaleFactor,
        clip.transform.scale * pipScaleFactor
      );
      ctx.translate(-width / 2, -height / 2);

      // Check if real video element exists in cache
      const videoEl = videoCacheRef.current.get(clip.id);
      const imgEl = imageCacheRef.current.get(clip.id);

      if (videoEl && videoEl.readyState >= 2) {
        // Draw real HTML5 video frame
        ctx.drawImage(videoEl, 0, 0, width, height);
      } else if (imgEl && imgEl.complete) {
        // Draw real image
        ctx.drawImage(imgEl, 0, 0, width, height);
      } else {
        // Procedural background fallback
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        if (clip.id === 'clip-1') {
          bgGrad.addColorStop(0, '#0a0e17');
          bgGrad.addColorStop(0.5, '#1e293b');
          bgGrad.addColorStop(1, '#0284c7');
        } else {
          bgGrad.addColorStop(0, '#1f0d2b');
          bgGrad.addColorStop(0.5, '#581c87');
          bgGrad.addColorStop(1, '#ec4899');
        }
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Procedural motion lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        for (let x = 0; x < width; x += 25) {
          const y = height / 2 + Math.sin(x * 0.008 + progress * Math.PI * 4) * 90;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Badge in preview
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(width * 0.048)}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 18;
        ctx.fillText(clip.name, width / 2, height / 2 - 30);
      }

      // Pro features badge indicator
      if (clip.pro.aiUpscaling || clip.pro.smoothSlowMotion) {
        ctx.fillStyle = '#ffd700';
        ctx.font = `bold ${Math.round(width * 0.026)}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 8;
        ctx.fillText('👑 PRO GRÁTIS ATIVO (4K HDR)', width / 2, height / 2 + 25);
      }

      // PIP border frame if overlay
      if (isPIP) {
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, width, height);
      }

      ctx.restore();
    };

    // 1. Render Main Video Clip
    if (activeVideoClip) {
      renderClip(activeVideoClip, false);
    } else {
      ctx.fillStyle = '#1e222d';
      ctx.font = `bold ${Math.round(width * 0.035)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('Nenhum clipe na posição atual', width / 2, height / 2);
    }

    // 2. Render Overlay (PIP) clips on top
    activeOverlayClips.forEach((pipClip) => {
      renderClip(pipClip, true);
    });

    // 3. Render Text Overlays
    activeTextClips.forEach((textClip) => {
      if (!textClip.textSettings) return;
      const ts = textClip.textSettings;
      ctx.save();

      const tx = (ts.x * width) / 100;
      const ty = (ts.y * height) / 100;

      ctx.font = `${ts.isItalic ? 'italic ' : ''}${ts.isBold ? 'bold ' : ''}${Math.round(ts.fontSize * (width / 720))}px ${ts.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const metrics = ctx.measureText(ts.text);
      const textWidth = metrics.width;
      const textHeight = ts.fontSize * (width / 720) * 1.3;

      if (ts.backgroundColor && ts.backgroundColor !== 'transparent') {
        ctx.fillStyle = ts.backgroundColor;
        const padding = 14;
        ctx.beginPath();
        ctx.roundRect(
          tx - textWidth / 2 - padding,
          ty - textHeight / 2 - padding / 2,
          textWidth + padding * 2,
          textHeight + padding,
          8
        );
        ctx.fill();
      }

      if (ts.strokeColor && ts.strokeWidth) {
        ctx.strokeStyle = ts.strokeColor;
        ctx.lineWidth = ts.strokeWidth;
        ctx.strokeText(ts.text, tx, ty);
      }

      ctx.fillStyle = ts.color;
      ctx.fillText(ts.text, tx, ty);
      ctx.restore();
    });

  }, [project.currentTime, project.isPlaying, activeVideoClip, activeOverlayClips, activeTextClips, aspectRatio]);

  // Drag and drop file handling directly on player
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    if (!onAddClip) return;
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      const isAudio = file.type.startsWith('audio/');
      const isImage = file.type.startsWith('image/');

      const newClip: MediaClip = {
        id: `clip-drop-${Date.now()}-${i}`,
        type: isAudio ? 'audio' : isImage ? 'image' : 'video',
        name: file.name.replace(/\.[^/.]+$/, ''),
        start: project.currentTime,
        duration: 4.0,
        offset: 0,
        sourceDuration: 4.0,
        sourceUrl: url,
        volume: 1,
        speed: 1,
        isMuted: false,
        color: isAudio ? '#10b981' : isImage ? '#8b5cf6' : '#3b82f6',
        mask: 'none',
        animation: 'none',
        pro: {
          backgroundRemoved: false,
          chromaKeyEnabled: false,
          chromaColor: '#00ff00',
          vocalIsolation: false,
          noiseReduction: false,
          stabilization: false,
          smoothSlowMotion: false,
          antiFlicker: false,
          aiUpscaling: true,
          faceRetouch: false,
        },
        filters: {
          brightness: 100,
          contrast: 100,
          saturation: 100,
          blur: 0,
          grayscale: 0,
          sepia: 0,
          hueRotate: 0,
          vignette: 0,
          temperature: 0,
          sharpness: 0,
        },
        transform: {
          scale: 1,
          rotation: 0,
          flipHorizontal: false,
          x: 0,
          y: 0,
        },
      };

      onAddClip(newClip);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="capcut-player-section"
      ref={containerRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ position: 'relative' }}
    >
      {/* Video Stage Frame */}
      <div className="capcut-stage-area">
        <div className={`capcut-canvas-box aspect-${aspectRatio.replace(':', '-')}`} style={{ position: 'relative' }}>
          <canvas ref={canvasRef} className="capcut-canvas" />

          {/* Drag & Drop Visual Indicator */}
          {isDraggingOver && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 242, 254, 0.25)',
              border: '3px dashed #00f2fe',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              zIndex: 30,
              backdropFilter: 'blur(4px)'
            }}>
              <Upload size={42} color="#00f2fe" style={{ marginBottom: '10px' }} />
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Solte para Adicionar</span>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Vídeo, Foto ou Áudio</span>
            </div>
          )}
        </div>
      </div>

      {/* CapCut Playback Sub-Bar (Directly under the canvas) */}
      <div className="capcut-playback-bar">
        {/* Timecode */}
        <div className="capcut-timecode">
          <span className="current">{formatTime(project.currentTime)}</span>
          <span className="divider">/</span>
          <span className="total">{formatTime(project.duration)}</span>
        </div>

        {/* Play/Pause Button */}
        <div className="capcut-play-trigger">
          <button
            className={`capcut-circle-play-btn ${project.isPlaying ? 'playing' : ''}`}
            onClick={onTogglePlay}
            title={project.isPlaying ? 'Pausar (Espaço)' : 'Reproduzir (Espaço)'}
          >
            {project.isPlaying ? <Pause size={18} /> : <Play size={18} className="icon-offset" />}
          </button>
        </div>

        {/* Undo, Redo & Fullscreen */}
        <div className="capcut-history-controls">
          <button
            className="capcut-mini-btn"
            onClick={onUndo}
            disabled={!canUndo}
            title="Desfazer"
          >
            <RotateCcw size={16} />
          </button>

          <button
            className="capcut-mini-btn"
            onClick={onRedo}
            disabled={!canRedo}
            title="Refazer"
          >
            <RotateCw size={16} />
          </button>

          <button
            className="capcut-mini-btn"
            onClick={() => {
              if (containerRef.current) {
                if (!document.fullscreenElement) {
                  containerRef.current.requestFullscreen?.();
                } else {
                  document.exitFullscreen?.();
                }
              }
            }}
            title="Tela cheia"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
