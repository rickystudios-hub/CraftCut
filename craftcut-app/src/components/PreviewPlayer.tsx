import React, { useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw,
  Maximize2
} from 'lucide-react';
import type { AspectRatio, ProjectState } from '../types/editor';

interface PreviewPlayerProps {
  project: ProjectState;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  aspectRatio: AspectRatio;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const PreviewPlayer: React.FC<PreviewPlayerProps> = ({
  project,
  onTogglePlay,
  aspectRatio,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Find active video and text clips at currentTime
  const activeVideoClip = project.tracks
    .find((t) => t.type === 'video' && !t.isMuted)
    ?.clips.find(
      (c) => project.currentTime >= c.start && project.currentTime < c.start + c.duration
    );

  const activeTextClips = project.tracks
    .filter((t) => t.type === 'text' && !t.isMuted)
    .flatMap((t) => t.clips)
    .filter(
      (c) => project.currentTime >= c.start && project.currentTime < c.start + c.duration
    );

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

    if (activeVideoClip) {
      const clipElapsed = project.currentTime - activeVideoClip.start;
      const progress = clipElapsed / activeVideoClip.duration;

      ctx.save();

      // Apply Filters
      const f = activeVideoClip.filters;
      ctx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) blur(${f.blur}px) grayscale(${f.grayscale}%) sepia(${f.sepia}%) hue-rotate(${f.hueRotate}deg)`;

      // Apply Transforms
      ctx.translate(
        width / 2 + (activeVideoClip.transform.x * width) / 100,
        height / 2 + (activeVideoClip.transform.y * height) / 100
      );
      ctx.rotate((activeVideoClip.transform.rotation * Math.PI) / 180);
      ctx.scale(
        activeVideoClip.transform.flipHorizontal
          ? -activeVideoClip.transform.scale
          : activeVideoClip.transform.scale,
        activeVideoClip.transform.scale
      );
      ctx.translate(-width / 2, -height / 2);

      // Render clip background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      if (activeVideoClip.id === 'clip-1') {
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

      // Render video animation lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      for (let x = 0; x < width; x += 25) {
        const y = height / 2 + Math.sin(x * 0.008 + progress * Math.PI * 4) * 90;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Glowing Badge in preview
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(width * 0.048)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 18;
      ctx.fillText(activeVideoClip.name, width / 2, height / 2 - 30);

      // CapCut Pro Unlocked active badge
      if (activeVideoClip.pro.aiUpscaling || activeVideoClip.pro.smoothSlowMotion) {
        ctx.fillStyle = '#ffd700';
        ctx.font = `bold ${Math.round(width * 0.026)}px system-ui, sans-serif`;
        ctx.fillText('👑 PRO GRÁTIS ATIVO (4K HDR)', width / 2, height / 2 + 25);
      }

      ctx.restore();
    } else {
      // Empty timeline frame
      ctx.fillStyle = '#1e222d';
      ctx.font = `bold ${Math.round(width * 0.035)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('Nenhum clipe selecionado', width / 2, height / 2);
    }

    // Render Text Overlays
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
        const padding = 16;
        ctx.fillRect(
          tx - textWidth / 2 - padding,
          ty - textHeight / 2 - padding / 2,
          textWidth + padding * 2,
          textHeight + padding
        );
      }

      ctx.fillStyle = ts.color;
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 14;
      ctx.fillText(ts.text, tx, ty);

      ctx.restore();
    });
  }, [project.currentTime, activeVideoClip, activeTextClips, aspectRatio]);

  // Format time (00:00 / 00:15)
  const formatTime = (timeInSec: number) => {
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="capcut-player-section" ref={containerRef}>
      {/* Video Stage Frame */}
      <div className="capcut-stage-area">
        <div className={`capcut-canvas-box aspect-${aspectRatio.replace(':', '-')}`}>
          <canvas ref={canvasRef} className="capcut-canvas" />
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
