import React, { useRef, useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Image as ImageIcon, 
  Plus, 
  Music, 
  Type, 
  Film,
  Shuffle,
  Layers
} from 'lucide-react';
import type { ProjectState, MediaClip } from '../types/editor';

interface TimelineProps {
  project: ProjectState;
  onSeek: (time: number) => void;
  onSelectClip: (clipId: string | null) => void;
  onUpdateClip: (clip: MediaClip) => void;
  onOpenMediaDrawer: () => void;
  onAddTextClip: () => void;
  onOpenTransitions?: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  project,
  onSeek,
  onSelectClip,
  onUpdateClip,
  onOpenMediaDrawer,
  onAddTextClip,
  onOpenTransitions,
}) => {
  const rulerRef = useRef<HTMLDivElement | null>(null);
  const lanesContainerRef = useRef<HTMLDivElement | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isMainMuted, setIsMainMuted] = useState(false);

  const [trimmingClip, setTrimmingClip] = useState<{
    clip: MediaClip;
    handle: 'start' | 'end';
    startX: number;
    initialStart: number;
    initialDuration: number;
  } | null>(null);

  const zoom = project.zoom;
  const timelineWidth = Math.max(project.duration * zoom + 500, 1600);

  // Time ticks for ruler (00:00, 00:01, 00:02...)
  const ticks = [];
  const tickStep = zoom < 40 ? 2 : zoom < 80 ? 1 : 0.5;
  for (let t = 0; t <= project.duration + 5; t += tickStep) {
    ticks.push(t);
  }

  // Handle Scrubbing on Ruler
  const handleRulerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = Math.max(0, Math.min(project.duration, clickX / zoom));
    onSeek(newTime);
    setIsScrubbing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isScrubbing && rulerRef.current) {
        const rect = rulerRef.current.getBoundingClientRect();
        const scrubX = e.clientX - rect.left;
        const newTime = Math.max(0, Math.min(project.duration, scrubX / zoom));
        onSeek(newTime);
      }

      if (trimmingClip) {
        const deltaX = e.clientX - trimmingClip.startX;
        const deltaSeconds = deltaX / zoom;
        
        if (trimmingClip.handle === 'end') {
          const newDuration = Math.max(0.3, trimmingClip.initialDuration + deltaSeconds);
          onUpdateClip({
            ...trimmingClip.clip,
            duration: Number(newDuration.toFixed(2)),
          });
        } else if (trimmingClip.handle === 'start') {
          const maxShift = trimmingClip.initialDuration - 0.3;
          const shift = Math.min(maxShift, Math.max(-trimmingClip.initialStart, deltaSeconds));
          onUpdateClip({
            ...trimmingClip.clip,
            start: Number((trimmingClip.initialStart + shift).toFixed(2)),
            duration: Number((trimmingClip.initialDuration - shift).toFixed(2)),
          });
        }
      }
    };

    const handleMouseUp = () => {
      if (isScrubbing) setIsScrubbing(false);
      if (trimmingClip) setTrimmingClip(null);
    };

    if (isScrubbing || trimmingClip) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isScrubbing, trimmingClip, zoom, project.duration, onSeek, onUpdateClip]);

  return (
    <div className="capcut-timeline-container">
      {/* Left Static Panel (CapCut Cover & Mute Clip Sound) */}
      <div className="capcut-left-panel">
        {/* Cover / Capa Button */}
        <div className="capcut-cover-box" title="Definir capa do vídeo">
          <div className="cover-thumb">
            <ImageIcon size={18} className="cover-icon" />
          </div>
          <span className="cover-label">Capa</span>
        </div>

        {/* Mute Audio of clip */}
        <button
          className={`capcut-mute-box ${isMainMuted ? 'muted' : ''}`}
          onClick={() => setIsMainMuted(!isMainMuted)}
          title="Silenciar áudio original do clipe"
        >
          {isMainMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span className="mute-label">Silenciar áudio do clipe</span>
        </button>
      </div>

      {/* Right Scrollable Tracks Area */}
      <div 
        className="capcut-timeline-scrollable" 
        ref={lanesContainerRef}
        onClick={() => onSelectClip(null)}
      >
        <div className="capcut-tracks-board" style={{ width: `${timelineWidth}px` }}>
          {/* Top Time Ruler */}
          <div
            className="capcut-ruler"
            ref={rulerRef}
            onMouseDown={handleRulerMouseDown}
          >
            {ticks.map((time) => (
              <div
                key={time}
                className="capcut-tick"
                style={{ left: `${time * zoom}px` }}
              >
                <div className="tick-notch" />
                {time % 1 === 0 && (
                  <span className="tick-num">
                    00:{String(Math.floor(time)).padStart(2, '0')}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* CapCut Signature Center White Playhead */}
          <div
            className="capcut-playhead"
            style={{ left: `${project.currentTime * zoom}px` }}
          >
            <div className="capcut-playhead-handle">
              <div className="handle-inner" />
            </div>
            <div className="capcut-playhead-line" />
          </div>

          {/* Main Video Track (Primary Track with Filmstrip) */}
          {project.tracks
            .filter((t) => t.type === 'video')
            .map((track) => (
              <div key={track.id} className="capcut-track capcut-track-video">
                {track.clips.map((clip) => {
                  const isSelected = project.selectedClipId === clip.id;
                  const clipLeft = clip.start * zoom;
                  const clipWidth = Math.max(40, clip.duration * zoom);

                  return (
                    <div
                      key={clip.id}
                      className={`capcut-clip-video ${isSelected ? 'selected' : ''}`}
                      style={{
                        left: `${clipLeft}px`,
                        width: `${clipWidth}px`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectClip(clip.id);
                      }}
                    >
                      {/* Left CapCut Signature Trim Handle (White bar with double pill dots) */}
                      {isSelected && (
                        <div
                          className="capcut-trim-handle handle-left"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setTrimmingClip({
                              clip,
                              handle: 'start',
                              startX: e.clientX,
                              initialStart: clip.start,
                              initialDuration: clip.duration,
                            });
                          }}
                        >
                          <div className="handle-pill-dot" />
                          <div className="handle-pill-dot" />
                        </div>
                      )}

                      {/* Transition Pill Badge */}
                      {clip.transition && clip.transition.type !== 'none' && (
                        <button
                          className="capcut-transition-pill"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenTransitions?.();
                          }}
                          style={{
                            position: 'absolute',
                            left: '-12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 15,
                            background: '#161920',
                            border: '1.5px solid #00f2fe',
                            borderRadius: '6px',
                            color: '#00f2fe',
                            padding: '3px 4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            cursor: 'pointer',
                            fontSize: '9px',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                          }}
                          title={`Transição: ${clip.transition.type}`}
                        >
                          <Shuffle size={10} />
                        </button>
                      )}

                      {/* Filmstrip Thumbnails Content */}
                      <div className="video-clip-content">
                        <div className="clip-name-badge">
                          <Film size={12} />
                          <span>{clip.name}</span>
                          {clip.pro.smoothSlowMotion && <span className="pro-tag">PRO</span>}
                          {clip.transition && clip.transition.type !== 'none' && (
                            <span style={{ fontSize: '0.62rem', background: '#00f2fe', color: '#000', padding: '1px 4px', borderRadius: '3px', fontWeight: 'bold', marginLeft: '4px' }}>
                              {clip.transition.type.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="clip-time-badge">{clip.duration.toFixed(1)}s</div>
                      </div>

                      {/* Right CapCut Signature Trim Handle */}
                      {isSelected && (
                        <div
                          className="capcut-trim-handle handle-right"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setTrimmingClip({
                              clip,
                              handle: 'end',
                              startX: e.clientX,
                              initialStart: clip.start,
                              initialDuration: clip.duration,
                            });
                          }}
                        >
                          <div className="handle-pill-dot" />
                          <div className="handle-pill-dot" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Plus (+) Button at the end of the video track to add new media */}
                <button
                  className="capcut-add-clip-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenMediaDrawer();
                  }}
                  title="Adicionar mais vídeos ou fotos"
                >
                  <Plus size={18} />
                </button>
              </div>
            ))}

          {/* Overlay / PIP Tracks */}
          {project.tracks
            .filter((t) => t.type === 'overlay')
            .map((track) => (
              <div key={track.id} className="capcut-track capcut-track-overlay">
                {track.clips.map((clip) => {
                  const isSelected = project.selectedClipId === clip.id;
                  const clipLeft = clip.start * zoom;
                  const clipWidth = Math.max(35, clip.duration * zoom);

                  return (
                    <div
                      key={clip.id}
                      className={`capcut-clip-video capcut-clip-overlay ${isSelected ? 'selected' : ''}`}
                      style={{
                        left: `${clipLeft}px`,
                        width: `${clipWidth}px`,
                        borderColor: '#00f2fe',
                        background: 'linear-gradient(135deg, #092c3e, #134e6f)',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectClip(clip.id);
                      }}
                    >
                      <div className="video-clip-content">
                        <div className="clip-name-badge">
                          <Layers size={12} color="#00f2fe" />
                          <span>{clip.name} (PIP)</span>
                        </div>
                        <div className="clip-time-badge">{clip.duration.toFixed(1)}s</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

          {/* Text / Subtitle Tracks */}
          {project.tracks
            .filter((t) => t.type === 'text')
            .map((track) => (
              <div key={track.id} className="capcut-track capcut-track-text">
                {track.clips.map((clip) => {
                  const isSelected = project.selectedClipId === clip.id;
                  const clipLeft = clip.start * zoom;
                  const clipWidth = Math.max(35, clip.duration * zoom);

                  return (
                    <div
                      key={clip.id}
                      className={`capcut-clip-text ${isSelected ? 'selected' : ''}`}
                      style={{
                        left: `${clipLeft}px`,
                        width: `${clipWidth}px`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectClip(clip.id);
                      }}
                    >
                      <div className="text-clip-inner">
                        <Type size={12} className="text-icon" />
                        <span className="text-title">{clip.textSettings?.text || clip.name}</span>
                      </div>
                    </div>
                  );
                })}

                {/* Add text quick prompt */}
                <button
                  className="capcut-add-track-lane-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddTextClip();
                  }}
                >
                  <Plus size={12} />
                  <span>Adicionar texto</span>
                </button>
              </div>
            ))}

          {/* Audio Tracks */}
          {project.tracks
            .filter((t) => t.type === 'audio')
            .map((track) => (
              <div key={track.id} className="capcut-track capcut-track-audio">
                {track.clips.map((clip) => {
                  const isSelected = project.selectedClipId === clip.id;
                  const clipLeft = clip.start * zoom;
                  const clipWidth = Math.max(35, clip.duration * zoom);

                  return (
                    <div
                      key={clip.id}
                      className={`capcut-clip-audio ${isSelected ? 'selected' : ''}`}
                      style={{
                        left: `${clipLeft}px`,
                        width: `${clipWidth}px`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectClip(clip.id);
                      }}
                    >
                      <div className="audio-clip-inner">
                        <Music size={12} className="music-icon" />
                        <span className="audio-title">{clip.name}</span>
                        <div className="audio-mini-wave" style={{ display: 'flex', gap: '2px', alignItems: 'center', height: '18px', flex: 1, padding: '0 8px', overflow: 'hidden' }}>
                          {Array.from({ length: 24 }).map((_, i) => {
                            const h = 25 + Math.sin(i * 0.9 + clip.duration) * 35 + ((i % 4) * 10);
                            return (
                              <span
                                key={i}
                                className="bar"
                                style={{
                                  width: '2px',
                                  height: `${Math.max(15, Math.min(100, h))}%`,
                                  backgroundColor: '#34d399',
                                  borderRadius: '1px',
                                  flexShrink: 0
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add audio prompt */}
                <button
                  className="capcut-add-track-lane-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenMediaDrawer();
                  }}
                >
                  <Plus size={12} />
                  <span>Adicionar áudio</span>
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
