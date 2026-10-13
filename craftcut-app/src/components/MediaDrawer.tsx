import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Film, 
  Music, 
  Sparkles, 
  Plus
} from 'lucide-react';
import type { MediaClip } from '../types/editor';
import { createProceduralVideo } from '../utils/sampleMedia';

interface MediaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClip: (clip: MediaClip) => void;
}

export const MediaDrawer: React.FC<MediaDrawerProps> = ({
  isOpen,
  onClose,
  onAddClip,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'samples' | 'audio'>('samples');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      const isAudio = file.type.startsWith('audio/');

      const newClip: MediaClip = {
        id: `clip-upload-${Date.now()}-${i}`,
        type: isAudio ? 'audio' : 'video',
        name: file.name.replace(/\.[^/.]+$/, ''),
        start: 0,
        duration: 5.0,
        offset: 0,
        sourceDuration: 5.0,
        sourceUrl: url,
        volume: 1,
        speed: 1,
        isMuted: false,
        color: isAudio ? '#10b981' : '#3b82f6',
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

    onClose();
  };

  // Add sample procedural clip
  const handleAddSample = async (title: string, startCol: string, endCol: string) => {
    setIsGenerating(true);
    const videoUrl = await createProceduralVideo(title, startCol, endCol, 4.0);
    setIsGenerating(false);

    const newClip: MediaClip = {
      id: `clip-sample-${Date.now()}`,
      type: 'video',
      name: title,
      start: 0,
      duration: 4.0,
      offset: 0,
      sourceDuration: 4.0,
      sourceUrl: videoUrl,
      volume: 1,
      speed: 1,
      isMuted: false,
      color: '#8b5cf6',
      mask: 'none',
      animation: 'zoom',
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
    onClose();
  };

  // Add sample audio clip
  const handleAddSampleAudio = (title: string) => {
    const newClip: MediaClip = {
      id: `clip-audio-${Date.now()}`,
      type: 'audio',
      name: title,
      start: 0,
      duration: 6.0,
      offset: 0,
      sourceDuration: 6.0,
      sourceUrl: '',
      volume: 0.8,
      speed: 1,
      isMuted: false,
      color: '#10b981',
      mask: 'none',
      animation: 'none',
      pro: {
        backgroundRemoved: false,
        chromaKeyEnabled: false,
        chromaColor: '#00ff00',
        vocalIsolation: true,
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
      transform: {
        scale: 1,
        rotation: 0,
        flipHorizontal: false,
        x: 0,
        y: 0,
      },
    };

    onAddClip(newClip);
    onClose();
  };

  return (
    <div className="drawer-backdrop">
      <div className="media-drawer">
        <div className="drawer-header">
          <div className="modal-title-group">
            <Film className="modal-icon text-cyan" size={20} />
            <div>
              <h3 className="modal-title">Biblioteca de Mídia</h3>
              <span className="modal-subtitle">Adicione clipes ao seu projeto CraftCut</span>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Drawer Tabs */}
        <div className="drawer-tabs">
          <button
            className={`drawer-tab ${activeTab === 'samples' ? 'active' : ''}`}
            onClick={() => setActiveTab('samples')}
          >
            <Sparkles size={16} />
            <span>Amostras Prontas</span>
          </button>
          <button
            className={`drawer-tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <Upload size={16} />
            <span>Do Dispositivo</span>
          </button>
          <button
            className={`drawer-tab ${activeTab === 'audio' ? 'active' : ''}`}
            onClick={() => setActiveTab('audio')}
          >
            <Music size={16} />
            <span>Áudios</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {activeTab === 'upload' && (
            <div className="upload-dropzone">
              <Upload className="dropzone-icon text-cyan" size={40} />
              <h4>Selecione vídeos ou fotos</h4>
              <p>Compatível com MP4, WebM, MOV, JPG, PNG e MP3</p>
              <label className="btn-primary file-input-label">
                <span>Escolher Arquivos</span>
                <input
                  type="file"
                  multiple
                  accept="video/*,audio/*,image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          )}

          {activeTab === 'samples' && (
            <div className="samples-grid">
              <div
                className="sample-card card-gradient-1"
                onClick={() => handleAddSample('Cyber Matrix', '#0f172a', '#06b6d4')}
              >
                <div className="sample-card-content">
                  <span className="sample-tag">Neon Wave</span>
                  <h4>Cyber Matrix</h4>
                  <span>Gradiente ciberpunk animado</span>
                </div>
                <button className="sample-add-btn" disabled={isGenerating}>
                  <Plus size={16} />
                </button>
              </div>

              <div
                className="sample-card card-gradient-2"
                onClick={() => handleAddSample('Sunset Vibe', '#831843', '#f43f5e')}
              >
                <div className="sample-card-content">
                  <span className="sample-tag">Warm</span>
                  <h4>Sunset Vibe</h4>
                  <span>Paleta quente cinematográfica</span>
                </div>
                <button className="sample-add-btn" disabled={isGenerating}>
                  <Plus size={16} />
                </button>
              </div>

              <div
                className="sample-card card-gradient-3"
                onClick={() => handleAddSample('Emerald Drift', '#064e3b', '#10b981')}
              >
                <div className="sample-card-content">
                  <span className="sample-tag">Fresh</span>
                  <h4>Emerald Drift</h4>
                  <span>Esmeralda brilhante fluido</span>
                </div>
                <button className="sample-add-btn" disabled={isGenerating}>
                  <Plus size={16} />
                </button>
              </div>

              <div
                className="sample-card card-gradient-4"
                onClick={() => handleAddSample('Deep Violet', '#3b0764', '#a855f7')}
              >
                <div className="sample-card-content">
                  <span className="sample-tag">Cosmic</span>
                  <h4>Deep Violet</h4>
                  <span>Efeito cósmico ultravioleta</span>
                </div>
                <button className="sample-add-btn" disabled={isGenerating}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="audio-list">
              <div className="audio-item" onClick={() => handleAddSampleAudio('Synthwave Beats')}>
                <div className="audio-icon-wrap">
                  <Music size={18} className="text-green" />
                </div>
                <div className="audio-details">
                  <h4>Synthwave Beats</h4>
                  <span>Eletrônica retrô enérgica • 120 BPM</span>
                </div>
                <button className="btn-secondary btn-sm">
                  <Plus size={14} /> Adicionar
                </button>
              </div>

              <div className="audio-item" onClick={() => handleAddSampleAudio('Lo-Fi Study Groove')}>
                <div className="audio-icon-wrap">
                  <Music size={18} className="text-green" />
                </div>
                <div className="audio-details">
                  <h4>Lo-Fi Study Groove</h4>
                  <span>Relaxante e suave para vlogs • 85 BPM</span>
                </div>
                <button className="btn-secondary btn-sm">
                  <Plus size={14} /> Adicionar
                </button>
              </div>

              <div className="audio-item" onClick={() => handleAddSampleAudio('Trap Energetic Drop')}>
                <div className="audio-icon-wrap">
                  <Music size={18} className="text-green" />
                </div>
                <div className="audio-details">
                  <h4>Trap Energetic Drop</h4>
                  <span>Grave potente para transições e cortes rápidos</span>
                </div>
                <button className="btn-secondary btn-sm">
                  <Plus size={14} /> Adicionar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
