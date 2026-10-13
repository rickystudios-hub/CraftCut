import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  CheckCircle2, 
  Loader2, 
  Film
} from 'lucide-react';
import type { ProjectState } from '../types/editor';

interface ExportModalProps {
  project: ProjectState;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const [resolution, setResolution] = useState<'1080p' | '720p' | '4k'>('1080p');
  const [fps, setFps] = useState<30 | 60>(30);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartExport = async () => {
    setIsExporting(true);
    setProgress(0);
    setExportedUrl(null);

    // Create an offscreen export canvas
    const canvas = document.createElement('canvas');
    let width = 1080;
    let height = 1920;
    if (project.aspectRatio === '16:9') {
      width = 1920;
      height = 1080;
    } else if (project.aspectRatio === '1:1') {
      width = 1080;
      height = 1080;
    }

    if (resolution === '720p') {
      width = Math.round(width * 0.666);
      height = Math.round(height * 0.666);
    } else if (resolution === '4k') {
      width = Math.round(width * 2);
      height = Math.round(height * 2);
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsExporting(false);
      return;
    }

    const stream = canvas.captureStream(fps);
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    } catch {
      try {
        recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      } catch {
        recorder = new MediaRecorder(stream);
      }
    }

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setExportedUrl(url);
      setIsExporting(false);
      setProgress(100);
    };

    recorder.start();

    const totalSeconds = project.duration;
    const totalFrames = Math.max(30, Math.round(totalSeconds * fps));
    let frame = 0;

    const renderInterval = setInterval(() => {
      if (frame >= totalFrames) {
        clearInterval(renderInterval);
        recorder.stop();
        return;
      }

      const currentTime = (frame / fps);
      setProgress(Math.round((frame / totalFrames) * 100));

      // Draw background
      ctx.fillStyle = '#08090c';
      ctx.fillRect(0, 0, width, height);

      // Find active video clip
      const activeVideo = project.tracks
        .find((t) => t.type === 'video' && !t.isMuted)
        ?.clips.find((c) => currentTime >= c.start && currentTime < c.start + c.duration);

      if (activeVideo) {
        const clipProgress = (currentTime - activeVideo.start) / activeVideo.duration;

        ctx.save();
        const f = activeVideo.filters;
        ctx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) blur(${f.blur}px) grayscale(${f.grayscale}%) sepia(${f.sepia}%) hue-rotate(${f.hueRotate}deg)`;

        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        if (activeVideo.id === 'clip-1') {
          bgGrad.addColorStop(0, '#0f172a');
          bgGrad.addColorStop(0.5, '#1e1b4b');
          bgGrad.addColorStop(1, '#0284c7');
        } else {
          bgGrad.addColorStop(0, '#311042');
          bgGrad.addColorStop(0.5, '#701a75');
          bgGrad.addColorStop(1, '#db2777');
        }
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Motion design element
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        const r = 200 + Math.sin(clipProgress * Math.PI * 4) * 40;
        ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(width * 0.05)}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(activeVideo.name, width / 2, height / 2);

        ctx.restore();
      }

      // Render active texts
      const activeTexts = project.tracks
        .filter((t) => t.type === 'text' && !t.isMuted)
        .flatMap((t) => t.clips)
        .filter((c) => currentTime >= c.start && currentTime < c.start + c.duration);

      activeTexts.forEach((tc) => {
        if (!tc.textSettings) return;
        const ts = tc.textSettings;
        ctx.save();
        const tx = (ts.x * width) / 100;
        const ty = (ts.y * height) / 100;
        ctx.font = `${ts.isItalic ? 'italic ' : ''}${ts.isBold ? 'bold ' : ''}${Math.round(ts.fontSize * (width / 720))}px ${ts.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.fillStyle = ts.color;
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 10;
        ctx.fillText(ts.text, tx, ty);
        ctx.restore();
      });

      frame++;
    }, 1000 / (fps * 2)); // faster rendering
  };

  // Android Web Share API
  const handleShare = async () => {
    if (navigator.share && exportedUrl) {
      try {
        const response = await fetch(exportedUrl);
        const blob = await response.blob();
        const file = new File([blob], `${project.name}.mp4`, { type: 'video/mp4' });
        await navigator.share({
          title: project.name,
          text: 'Vídeo editado com CraftCut Studio',
          files: [file],
        });
      } catch (err) {
        console.log('Share canceled or not supported', err);
      }
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content modal-export">
        <div className="modal-header">
          <div className="modal-title-group">
            <Film className="modal-icon text-cyan" size={20} />
            <div>
              <h3 className="modal-title">Exportar Vídeo</h3>
              <span className="modal-subtitle">Gere o arquivo final otimizado</span>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} disabled={isExporting}>
            <X size={18} />
          </button>
        </div>

        {/* Export Settings */}
        {!isExporting && !exportedUrl && (
          <div className="export-options">
            <div className="form-group">
              <label className="form-label">Resolução</label>
              <div className="chip-selector">
                <button
                  className={`chip-btn ${resolution === '720p' ? 'active' : ''}`}
                  onClick={() => setResolution('720p')}
                >
                  720p HD
                </button>
                <button
                  className={`chip-btn ${resolution === '1080p' ? 'active' : ''}`}
                  onClick={() => setResolution('1080p')}
                >
                  1080p Full HD
                </button>
                <button
                  className={`chip-btn ${resolution === '4k' ? 'active' : ''}`}
                  onClick={() => setResolution('4k')}
                >
                  4K Ultra HD
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Taxa de Quadros (FPS)</label>
              <div className="chip-selector">
                <button
                  className={`chip-btn ${fps === 30 ? 'active' : ''}`}
                  onClick={() => setFps(30)}
                >
                  30 FPS (Padrão)
                </button>
                <button
                  className={`chip-btn ${fps === 60 ? 'active' : ''}`}
                  onClick={() => setFps(60)}
                >
                  60 FPS (Ultra Suave)
                </button>
              </div>
            </div>

            <div className="export-summary-box">
              <div className="summary-item">
                <span>Duração Total:</span>
                <strong>{project.duration.toFixed(1)} segundos</strong>
              </div>
              <div className="summary-item">
                <span>Formato:</span>
                <strong>MP4 / WebM</strong>
              </div>
              <div className="summary-item">
                <span>Proporção:</span>
                <strong>{project.aspectRatio}</strong>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleStartExport}>
                <Download size={16} />
                <span>Iniciar Exportação</span>
              </button>
            </div>
          </div>
        )}

        {/* Exporting Progress */}
        {isExporting && (
          <div className="export-progress-view">
            <Loader2 className="spinner-icon text-cyan" size={48} />
            <h4>Renderizando Vídeo...</h4>
            <p>Compilando faixas, aplicando shaders e codificando quadros</p>

            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-num">{progress}%</span>
          </div>
        )}

        {/* Export Success */}
        {exportedUrl && (
          <div className="export-success-view">
            <CheckCircle2 className="success-icon text-green" size={54} />
            <h4>Vídeo Renderizado com Sucesso!</h4>
            <p>Seu vídeo está pronto para download e compartilhamento.</p>

            <div className="export-actions-row">
              <a
                href={exportedUrl}
                download={`${project.name.toLowerCase().replace(/\s+/g, '_')}.mp4`}
                className="btn-primary"
              >
                <Download size={16} />
                <span>Baixar Arquivo MP4</span>
              </a>

              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button className="btn-secondary" onClick={handleShare}>
                  <Share2 size={16} />
                  <span>Compartilhar (Android)</span>
                </button>
              )}
            </div>

            <div className="modal-footer" style={{ marginTop: '1.5rem' }}>
              <button className="btn-secondary" onClick={onClose}>
                Voltar ao Editor
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
