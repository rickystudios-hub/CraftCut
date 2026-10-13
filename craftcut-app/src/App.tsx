import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { PreviewPlayer } from './components/PreviewPlayer';
import { Toolbar } from './components/Toolbar';
import { Timeline } from './components/Timeline';
import { FiltersModal } from './components/FiltersModal';
import { SpeedModal } from './components/SpeedModal';
import { TextEditModal } from './components/TextEditModal';
import { ExportModal } from './components/ExportModal';
import { MediaDrawer } from './components/MediaDrawer';
import { ProFeaturesModal } from './components/ProFeaturesModal';
import { EffectsModal } from './components/EffectsModal';
import { AudioModal } from './components/AudioModal';
import { CutoutModal } from './components/CutoutModal';
import { MaskModal } from './components/MaskModal';
import { AnimationModal } from './components/AnimationModal';
import { CanvasModal } from './components/CanvasModal';
import { StickersModal } from './components/StickersModal';
import type { 
  ProjectState, 
  MediaClip, 
  AspectRatio, 
  FilterSettings, 
  TextStyleSettings,
  MaskType
} from './types/editor';
import { createDefaultTracks } from './utils/sampleMedia';

export const App: React.FC = () => {
  const initialTracks = createDefaultTracks();

  // Project State
  const [project, setProject] = useState<ProjectState>({
    id: 'proj-1',
    name: 'Projeto CapCut #1',
    aspectRatio: '9:16',
    duration: 10.0,
    currentTime: 0,
    isPlaying: false,
    zoom: 70,
    selectedClipId: null,
    tracks: initialTracks,
  });

  // Undo / Redo History
  const [history, setHistory] = useState<ProjectState[]>([project]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Modals state
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSpeedOpen, setIsSpeedOpen] = useState(false);
  const [isTextOpen, setIsTextOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isMediaDrawerOpen, setIsMediaDrawerOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isEffectsModalOpen, setIsEffectsModalOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isCutoutModalOpen, setIsCutoutModalOpen] = useState(false);
  const [isMaskModalOpen, setIsMaskModalOpen] = useState(false);
  const [isAnimationModalOpen, setIsAnimationModalOpen] = useState(false);
  const [isCanvasModalOpen, setIsCanvasModalOpen] = useState(false);
  const [isStickersModalOpen, setIsStickersModalOpen] = useState(false);

  const [activeProFeatureName, setActiveProFeatureName] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show celebratory toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Find currently selected clip
  const selectedClip = project.tracks
    .flatMap((t) => t.clips)
    .find((c) => c.id === project.selectedClipId) || null;

  // Push to history
  const pushState = (newState: ProjectState) => {
    setProject(newState);
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newState);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setProject(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setProject(history[historyIndex + 1]);
    }
  };

  // Playback Loop
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (project.isPlaying) {
      lastTimeRef.current = performance.now();

      const loop = (time: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = time;
        const deltaSec = (time - lastTimeRef.current) / 1000;
        lastTimeRef.current = time;

        setProject((prev) => {
          const nextTime = prev.currentTime + deltaSec;
          if (nextTime >= prev.duration) {
            return { ...prev, currentTime: 0, isPlaying: false };
          }
          return { ...prev, currentTime: nextTime };
        });

        animFrameRef.current = requestAnimationFrame(loop);
      };

      animFrameRef.current = requestAnimationFrame(loop);
    } else {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      lastTimeRef.current = null;
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [project.isPlaying]);

  // Recalculate duration when tracks change
  useEffect(() => {
    let maxDur = 5;
    project.tracks.forEach((track) => {
      track.clips.forEach((clip) => {
        if (clip.start + clip.duration > maxDur) {
          maxDur = clip.start + clip.duration;
        }
      });
    });
    if (Math.abs(maxDur - project.duration) > 0.05) {
      setProject((prev) => ({ ...prev, duration: Math.max(10, Number(maxDur.toFixed(2))) }));
    }
  }, [project.tracks]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setProject((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleSplitClip();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleDeleteClip();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project.selectedClipId, project.currentTime, historyIndex, history]);

  // Split Clip Action
  const handleSplitClip = () => {
    if (!project.selectedClipId) return;

    for (let t = 0; t < project.tracks.length; t++) {
      const track = project.tracks[t];
      const clipIndex = track.clips.findIndex((c) => c.id === project.selectedClipId);

      if (clipIndex !== -1) {
        const clip = track.clips[clipIndex];
        const splitPoint = project.currentTime;

        if (splitPoint > clip.start + 0.2 && splitPoint < clip.start + clip.duration - 0.2) {
          const firstDuration = Number((splitPoint - clip.start).toFixed(2));
          const secondDuration = Number((clip.duration - firstDuration).toFixed(2));

          const firstClip: MediaClip = {
            ...clip,
            duration: firstDuration,
          };

          const secondClip: MediaClip = {
            ...clip,
            id: `clip-${Date.now()}`,
            name: `${clip.name} (Parte 2)`,
            start: splitPoint,
            duration: secondDuration,
            offset: clip.offset + firstDuration,
          };

          const newClips = [...track.clips];
          newClips.splice(clipIndex, 1, firstClip, secondClip);

          const updatedTracks = [...project.tracks];
          updatedTracks[t] = { ...track, clips: newClips };

          pushState({
            ...project,
            tracks: updatedTracks,
            selectedClipId: secondClip.id,
          });

          showToast('✂️ Clipe dividido com sucesso!');
        }
        break;
      }
    }
  };

  // Delete Clip Action
  const handleDeleteClip = () => {
    if (!project.selectedClipId) return;

    const updatedTracks = project.tracks.map((track) => ({
      ...track,
      clips: track.clips.filter((c) => c.id !== project.selectedClipId),
    }));

    pushState({
      ...project,
      tracks: updatedTracks,
      selectedClipId: null,
    });
    showToast('🗑️ Clipe excluído.');
  };

  // Duplicate Clip Action
  const handleDuplicateClip = () => {
    if (!selectedClip) return;

    const dupClip: MediaClip = {
      ...selectedClip,
      id: `clip-dup-${Date.now()}`,
      name: `${selectedClip.name} (Cópia)`,
      start: selectedClip.start + selectedClip.duration + 0.1,
    };

    const updatedTracks = project.tracks.map((track) => {
      if (track.clips.some((c) => c.id === selectedClip.id)) {
        return {
          ...track,
          clips: [...track.clips, dupClip],
        };
      }
      return track;
    });

    pushState({
      ...project,
      tracks: updatedTracks,
      selectedClipId: dupClip.id,
    });
    showToast('📄 Clipe duplicado!');
  };

  // Rotate Clip Action
  const handleRotateClip = () => {
    if (!selectedClip) return;
    const currentRot = selectedClip.transform.rotation;
    const nextRot = (currentRot + 90) % 360;

    handleUpdateClip({
      ...selectedClip,
      transform: {
        ...selectedClip.transform,
        rotation: nextRot,
      },
    });
  };

  // Flip Clip Action
  const handleFlipClip = () => {
    if (!selectedClip) return;

    handleUpdateClip({
      ...selectedClip,
      transform: {
        ...selectedClip.transform,
        flipHorizontal: !selectedClip.transform.flipHorizontal,
      },
    });
  };

  // Freeze Frame Action (CapCut Congelar)
  const handleToggleFreeze = () => {
    if (!selectedClip) return;

    const frozenClip: MediaClip = {
      ...selectedClip,
      id: `clip-frozen-${Date.now()}`,
      name: `Quadro Congelado (${selectedClip.name})`,
      start: project.currentTime,
      duration: 2.0,
      speed: 0,
    };

    const updatedTracks = project.tracks.map((t) => {
      if (t.type === 'video') {
        return { ...t, clips: [...t.clips, frozenClip] };
      }
      return t;
    });

    pushState({
      ...project,
      tracks: updatedTracks,
      selectedClipId: frozenClip.id,
    });

    showToast('❄️ Quadro congelado inserido (2.0s)!');
  };

  // Auto Generate Captions (CapCut Legendas Automáticas PRO Grátis)
  const handleAutoGenerateCaptions = () => {
    const generatedCaptions: MediaClip[] = [
      {
        id: `auto-cap-1-${Date.now()}`,
        type: 'text',
        name: 'Legenda IA #1',
        start: 0.5,
        duration: 2.5,
        offset: 0,
        sourceDuration: 2.5,
        sourceUrl: '',
        volume: 1,
        speed: 1,
        isMuted: false,
        mask: 'none',
        animation: 'slide',
        color: '#eab308',
        pro: {
          backgroundRemoved: false,
          chromaKeyEnabled: false,
          chromaColor: '#00ff00',
          vocalIsolation: false,
          noiseReduction: false,
          stabilization: false,
          smoothSlowMotion: false,
          antiFlicker: false,
          aiUpscaling: false,
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
        transform: { scale: 1, rotation: 0, flipHorizontal: false, x: 0, y: 0 },
        textSettings: {
          text: 'BEM-VINDO AO CRAFTCUT!',
          color: '#00f2fe',
          fontSize: 36,
          fontFamily: 'Inter, system-ui, sans-serif',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          isBold: true,
          isItalic: false,
          x: 50,
          y: 75,
        },
      },
      {
        id: `auto-cap-2-${Date.now()}`,
        type: 'text',
        name: 'Legenda IA #2',
        start: 3.2,
        duration: 3.0,
        offset: 0,
        sourceDuration: 3.0,
        sourceUrl: '',
        volume: 1,
        speed: 1,
        isMuted: false,
        mask: 'none',
        animation: 'glitch',
        color: '#eab308',
        pro: {
          backgroundRemoved: false,
          chromaKeyEnabled: false,
          chromaColor: '#00ff00',
          vocalIsolation: false,
          noiseReduction: false,
          stabilization: false,
          smoothSlowMotion: false,
          antiFlicker: false,
          aiUpscaling: false,
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
        transform: { scale: 1, rotation: 0, flipHorizontal: false, x: 0, y: 0 },
        textSettings: {
          text: 'RECURSOS PRO 100% GRÁTIS 🔥',
          color: '#ffffff',
          fontSize: 34,
          fontFamily: 'Inter, system-ui, sans-serif',
          backgroundColor: 'rgba(124, 77, 255, 0.8)',
          isBold: true,
          isItalic: false,
          x: 50,
          y: 80,
        },
      },
    ];

    let textTrack = project.tracks.find((t) => t.type === 'text');
    let updatedTracks = [...project.tracks];

    if (textTrack) {
      updatedTracks = updatedTracks.map((t) =>
        t.id === textTrack.id ? { ...t, clips: [...t.clips, ...generatedCaptions] } : t
      );
    } else {
      updatedTracks.push({
        id: `track-text-auto-${Date.now()}`,
        type: 'text',
        name: 'Legendas IA',
        isMuted: false,
        isLocked: false,
        clips: generatedCaptions,
      });
    }

    pushState({
      ...project,
      tracks: updatedTracks,
    });

    showToast('✨ Legendas Automáticas por IA geradas com sucesso!');
  };

  // Add live microphone recording
  const handleAddRecordedAudio = (url: string, dur: number) => {
    const newAudioClip: MediaClip = {
      id: `clip-rec-${Date.now()}`,
      type: 'audio',
      name: 'Gravação de Voz',
      start: project.currentTime,
      duration: dur,
      offset: 0,
      sourceDuration: dur,
      sourceUrl: url,
      volume: 1,
      speed: 1,
      isMuted: false,
      mask: 'none',
      animation: 'none',
      color: '#10b981',
      pro: {
        backgroundRemoved: false,
        chromaKeyEnabled: false,
        chromaColor: '#00ff00',
        vocalIsolation: false,
        noiseReduction: true,
        stabilization: false,
        smoothSlowMotion: false,
        antiFlicker: false,
        aiUpscaling: false,
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
      transform: { scale: 1, rotation: 0, flipHorizontal: false, x: 0, y: 0 },
    };

    let audioTrack = project.tracks.find((t) => t.type === 'audio');
    let updatedTracks = [...project.tracks];

    if (audioTrack) {
      updatedTracks = updatedTracks.map((t) =>
        t.id === audioTrack.id ? { ...t, clips: [...t.clips, newAudioClip] } : t
      );
    } else {
      updatedTracks.push({
        id: `track-audio-${Date.now()}`,
        type: 'audio',
        name: 'Áudio Gravado',
        isMuted: false,
        isLocked: false,
        clips: [newAudioClip],
      });
    }

    pushState({
      ...project,
      tracks: updatedTracks,
      selectedClipId: newAudioClip.id,
    });
    showToast('🎙️ Voz gravada adicionada à linha do tempo!');
  };

  // Add Sticker to timeline
  const handleAddSticker = (text: string) => {
    const newStickerClip: MediaClip = {
      id: `clip-sticker-${Date.now()}`,
      type: 'text',
      name: `Sticker (${text})`,
      start: project.currentTime,
      duration: 3.0,
      offset: 0,
      sourceDuration: 3.0,
      sourceUrl: '',
      volume: 1,
      speed: 1,
      isMuted: false,
      mask: 'none',
      animation: 'zoom',
      color: '#ec4899',
      pro: {
        backgroundRemoved: false,
        chromaKeyEnabled: false,
        chromaColor: '#00ff00',
        vocalIsolation: false,
        noiseReduction: false,
        stabilization: false,
        smoothSlowMotion: false,
        antiFlicker: false,
        aiUpscaling: false,
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
      transform: { scale: 1.2, rotation: 0, flipHorizontal: false, x: 0, y: 0 },
      textSettings: {
        text: text,
        color: '#ffffff',
        fontSize: text.length > 2 ? 30 : 64,
        fontFamily: 'Inter, system-ui, sans-serif',
        backgroundColor: text.length > 2 ? 'rgba(0, 0, 0, 0.7)' : 'transparent',
        isBold: true,
        isItalic: false,
        x: 50,
        y: 50,
      },
    };

    let textTrack = project.tracks.find((t) => t.type === 'text');
    let updatedTracks = [...project.tracks];

    if (textTrack) {
      updatedTracks = updatedTracks.map((t) =>
        t.id === textTrack.id ? { ...t, clips: [...t.clips, newStickerClip] } : t
      );
    } else {
      updatedTracks.push({
        id: `track-stickers-${Date.now()}`,
        type: 'text',
        name: 'Stickers',
        isMuted: false,
        isLocked: false,
        clips: [newStickerClip],
      });
    }

    pushState({
      ...project,
      tracks: updatedTracks,
      selectedClipId: newStickerClip.id,
    });
    showToast('✨ Sticker adicionado!');
  };

  // Update Clip
  const handleUpdateClip = (updatedClip: MediaClip) => {
    const updatedTracks = project.tracks.map((track) => ({
      ...track,
      clips: track.clips.map((c) => (c.id === updatedClip.id ? updatedClip : c)),
    }));

    setProject((prev) => ({
      ...prev,
      tracks: updatedTracks,
    }));
  };

  // Add New Text Clip
  const handleAddTextClip = () => {
    const newTextClip: MediaClip = {
      id: `clip-text-${Date.now()}`,
      type: 'text',
      name: 'Novo Texto',
      start: project.currentTime,
      duration: 3.5,
      offset: 0,
      sourceDuration: 3.5,
      sourceUrl: '',
      volume: 1,
      speed: 1,
      isMuted: false,
      color: '#eab308',
      mask: 'none',
      animation: 'fade',
      pro: {
        backgroundRemoved: false,
        chromaKeyEnabled: false,
        chromaColor: '#00ff00',
        vocalIsolation: false,
        noiseReduction: false,
        stabilization: false,
        smoothSlowMotion: false,
        antiFlicker: false,
        aiUpscaling: false,
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
      textSettings: {
        text: 'DIGITE SEU TEXTO AQUI',
        color: '#ffffff',
        fontSize: 36,
        fontFamily: 'Inter, system-ui, sans-serif',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        isBold: true,
        isItalic: false,
        x: 50,
        y: 50,
      },
    };

    const textTrack = project.tracks.find((t) => t.type === 'text');
    let updatedTracks = [...project.tracks];

    if (textTrack) {
      updatedTracks = updatedTracks.map((t) =>
        t.id === textTrack.id ? { ...t, clips: [...t.clips, newTextClip] } : t
      );
    } else {
      updatedTracks.push({
        id: `track-text-${Date.now()}`,
        type: 'text',
        name: 'Legendas',
        isMuted: false,
        isLocked: false,
        clips: [newTextClip],
      });
    }

    pushState({
      ...project,
      tracks: updatedTracks,
      selectedClipId: newTextClip.id,
    });

    setIsTextOpen(true);
  };

  // Add clip from Media Drawer
  const handleAddClipFromDrawer = (clip: MediaClip) => {
    const track = project.tracks.find((t) => t.type === clip.type);
    let updatedTracks = [...project.tracks];

    const targetStart = project.currentTime;
    const positionedClip = { ...clip, start: targetStart };

    if (track) {
      updatedTracks = updatedTracks.map((t) =>
        t.id === track.id ? { ...t, clips: [...t.clips, positionedClip] } : t
      );
    } else {
      updatedTracks.push({
        id: `track-${clip.type}-${Date.now()}`,
        type: clip.type === 'video' ? 'video' : clip.type === 'audio' ? 'audio' : 'text',
        name: clip.type === 'video' ? 'Vídeo' : 'Áudio',
        isMuted: false,
        isLocked: false,
        clips: [positionedClip],
      });
    }

    pushState({
      ...project,
      tracks: updatedTracks,
      selectedClipId: positionedClip.id,
    });
    showToast('🎬 Novo clipe adicionado à timeline!');
  };

  return (
    <div className="capcut-app-root">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="capcut-toast">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CapCut Top Bar */}
      <Header
        projectName={project.name}
        onProjectNameChange={(name) => setProject((prev) => ({ ...prev, name }))}
        aspectRatio={project.aspectRatio}
        onAspectRatioChange={(aspectRatio: AspectRatio) =>
          setProject((prev) => ({ ...prev, aspectRatio }))
        }
        onOpenExport={() => setIsExportOpen(true)}
        onOpenProModal={() => {
          setActiveProFeatureName('');
          setIsProModalOpen(true);
        }}
      />

      {/* Main Video Workspace */}
      <main className="capcut-workspace">
        {/* Mobile Video Stage */}
        <section className="capcut-stage-wrapper">
          <PreviewPlayer
            project={project}
            onTogglePlay={() => setProject((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))}
            onSeek={(time) => setProject((prev) => ({ ...prev, currentTime: time }))}
            aspectRatio={project.aspectRatio}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
          />
        </section>

        {/* CapCut Multi-Track Timeline */}
        <section className="capcut-timeline-section">
          <Timeline
            project={project}
            onSeek={(time) => setProject((prev) => ({ ...prev, currentTime: time }))}
            onSelectClip={(clipId) => setProject((prev) => ({ ...prev, selectedClipId: clipId }))}
            onUpdateClip={handleUpdateClip}
            onOpenMediaDrawer={() => setIsMediaDrawerOpen(true)}
            onAddTextClip={handleAddTextClip}
          />
        </section>

        {/* CapCut Bottom Toolbar (Level 1 / Level 2 Sub-Menu) */}
        <section className="capcut-bottom-bar-wrapper">
          <Toolbar
            selectedClip={selectedClip}
            onClearSelection={() => setProject((prev) => ({ ...prev, selectedClipId: null }))}
            onSplit={handleSplitClip}
            onOpenSpeedModal={() => setIsSpeedOpen(true)}
            onOpenFiltersModal={() => setIsFiltersOpen(true)}
            onOpenTextModal={() => setIsTextOpen(true)}
            onOpenProModal={(feature) => {
              setActiveProFeatureName(feature);
              setIsProModalOpen(true);
            }}
            onOpenEffectsModal={() => setIsEffectsModalOpen(true)}
            onOpenAudioModal={() => setIsAudioModalOpen(true)}
            onOpenCutoutModal={() => setIsCutoutModalOpen(true)}
            onOpenMaskModal={() => setIsMaskModalOpen(true)}
            onOpenAnimationModal={() => setIsAnimationModalOpen(true)}
            onOpenCanvasModal={() => setIsCanvasModalOpen(true)}
            onOpenStickersModal={() => setIsStickersModalOpen(true)}
            onRotateClip={handleRotateClip}
            onFlipClip={handleFlipClip}
            onDuplicateClip={handleDuplicateClip}
            onDeleteClip={handleDeleteClip}
            onAddTextClip={handleAddTextClip}
            onOpenMediaDrawer={() => setIsMediaDrawerOpen(true)}
            onToggleFreeze={handleToggleFreeze}
          />
        </section>
      </main>

      {/* Interactive Modals */}
      {selectedClip && (
        <>
          <FiltersModal
            clip={selectedClip}
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
            onUpdateFilters={(filters: FilterSettings) =>
              handleUpdateClip({ ...selectedClip, filters })
            }
          />

          <SpeedModal
            clip={selectedClip}
            isOpen={isSpeedOpen}
            onClose={() => setIsSpeedOpen(false)}
            onUpdateSpeed={(speed: number) =>
              handleUpdateClip({ ...selectedClip, speed })
            }
          />

          <TextEditModal
            clip={selectedClip}
            isOpen={isTextOpen}
            onClose={() => setIsTextOpen(false)}
            onUpdateText={(textSettings: TextStyleSettings) =>
              handleUpdateClip({ ...selectedClip, textSettings })
            }
          />

          <CutoutModal
            clip={selectedClip}
            isOpen={isCutoutModalOpen}
            onClose={() => setIsCutoutModalOpen(false)}
            onUpdateCutout={(proUpdates) => {
              handleUpdateClip({
                ...selectedClip,
                pro: { ...selectedClip.pro, ...proUpdates },
              });
              showToast('🪄 Recorte / Fundo atualizado com sucesso!');
            }}
          />

          <MaskModal
            clip={selectedClip}
            isOpen={isMaskModalOpen}
            onClose={() => setIsMaskModalOpen(false)}
            onUpdateMask={(mask: MaskType) => {
              handleUpdateClip({ ...selectedClip, mask });
              showToast('🎭 Máscara aplicada!');
            }}
          />

          <AnimationModal
            clip={selectedClip}
            isOpen={isAnimationModalOpen}
            onClose={() => setIsAnimationModalOpen(false)}
            onUpdateAnimation={(animation) => {
              handleUpdateClip({ ...selectedClip, animation });
              showToast('✨ Animação aplicada!');
            }}
          />
        </>
      )}

      {/* Global Modals */}
      <AudioModal
        clip={selectedClip}
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        onUpdateClipVolume={(vol) => {
          if (selectedClip) {
            handleUpdateClip({ ...selectedClip, volume: vol });
          }
        }}
        onToggleVocalIsolation={() => {
          if (selectedClip) {
            handleUpdateClip({
              ...selectedClip,
              pro: { ...selectedClip.pro, vocalIsolation: !selectedClip.pro.vocalIsolation },
            });
            showToast('🎙️ Isolamento Vocal alternado!');
          }
        }}
        onToggleNoiseReduction={() => {
          if (selectedClip) {
            handleUpdateClip({
              ...selectedClip,
              pro: { ...selectedClip.pro, noiseReduction: !selectedClip.pro.noiseReduction },
            });
            showToast('🛡️ Redução de Ruído alternada!');
          }
        }}
        onAddRecordedAudio={handleAddRecordedAudio}
      />

      <EffectsModal
        clip={selectedClip}
        isOpen={isEffectsModalOpen}
        onClose={() => setIsEffectsModalOpen(false)}
        onApplyEffect={(effName) => {
          showToast(`⚡ Efeito ${effName} aplicado!`);
        }}
      />

      <CanvasModal
        isOpen={isCanvasModalOpen}
        onClose={() => setIsCanvasModalOpen(false)}
        onApplyBackground={(type, val) => {
          showToast(`🎨 Plano de Fundo (${type}: ${val}) aplicado!`);
        }}
      />

      <StickersModal
        isOpen={isStickersModalOpen}
        onClose={() => setIsStickersModalOpen(false)}
        onAddSticker={handleAddSticker}
      />

      <ProFeaturesModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        activeFeatureName={activeProFeatureName}
        selectedClip={selectedClip}
        onUpdateClipPro={(proUpdates) => {
          if (selectedClip) {
            handleUpdateClip({
              ...selectedClip,
              pro: { ...selectedClip.pro, ...proUpdates },
            });
            showToast('👑 Ajuste PRO atualizado com sucesso!');
          }
        }}
        onAutoGenerateCaptions={handleAutoGenerateCaptions}
      />

      <ExportModal
        project={project}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <MediaDrawer
        isOpen={isMediaDrawerOpen}
        onClose={() => setIsMediaDrawerOpen(false)}
        onAddClip={handleAddClipFromDrawer}
      />
    </div>
  );
};

export default App;
