import React, { useState } from 'react';
import { X, Sparkles, Flame, Video, Zap, Check } from 'lucide-react';
import type { MediaClip } from '../types/editor';

interface EffectsModalProps {
  clip: MediaClip | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyEffect: (effectName: string) => void;
}

export const EffectsModal: React.FC<EffectsModalProps> = ({
  isOpen,
  onClose,
  onApplyEffect,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'body' | 'photo'>('video');
  const [selectedEffect, setSelectedEffect] = useState<string>('glitch');

  if (!isOpen) return null;

  const videoEffects = [
    { id: 'glitch', name: 'Glitch RGB', icon: '⚡', desc: 'Deslocamento cromático e distorção' },
    { id: 'flash', name: 'Flash Branco', icon: '💥', desc: 'Pulso de luz para batidas musicais' },
    { id: 'halo', name: 'Desfoque Halo', icon: '✨', desc: 'Brilho etéreo e suave' },
    { id: 'shake', name: 'Vibração da Câmera', icon: '📳', desc: 'Tremor dinâmico de ação' },
    { id: 'vhs', name: 'Fita VHS 90s', icon: '📼', desc: 'Linhas analógicas e granulação retrô' },
    { id: 'neon', name: 'Luz Neon Cyberpunk', icon: '🌟', desc: 'Realce de contornos fluorescentes' },
    { id: 'zoom', name: 'Zoom Lento Cinemático', icon: '🔍', desc: 'Aproximação suave da câmera' },
    { id: 'sparks', name: 'Chuva de Partículas', icon: '🎆', desc: 'Partículas douradas flutuantes' },
  ];

  const bodyEffects = [
    { id: 'aura', name: 'Aura de Fogo', icon: '🔥', desc: 'Chamas dinâmicas ao redor do corpo' },
    { id: 'lightning', name: 'Raios Elétricos', icon: '⚡', desc: 'Descargas de energia nos membros' },
    { id: 'eyes', name: 'Olhos Laser / Brilho', icon: '👀', desc: 'Foco brilhante no olhar' },
    { id: 'outline', name: 'Contorno Neon IA', icon: '🧬', desc: 'Linha colorida seguindo o movimento' },
  ];

  const photoEffects = [
    { id: '3d-zoom', name: 'Zoom 3D IA', icon: '🖼️', desc: 'Efeito de profundidade e parallax' },
    { id: 'anime', name: 'Transformação Anime', icon: '🎨', desc: 'Estilização em desenho japonês' },
    { id: 'manga', name: 'Esboço Mangá P&B', icon: '✏️', desc: 'Traços de quadrinhos clássicos' },
  ];

  const currentList = activeTab === 'video' ? videoEffects : activeTab === 'body' ? bodyEffects : photoEffects;

  const handleSelect = (id: string, name: string) => {
    setSelectedEffect(id);
    onApplyEffect(name);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content capcut-effects-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="pro-title-line">
            <Sparkles size={22} className="icon-gold" />
            <h3 style={{ fontSize: '1.15rem' }}>Efeitos de Vídeo & Corpo</h3>
            <span className="unlocked-badge">PRO GRÁTIS</span>
          </div>
          <button className="capcut-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* CapCut Sub-Tabs */}
        <div className="capcut-effects-tabs">
          <button
            className={`effects-tab ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
          >
            <Video size={15} />
            <span>Efeitos de Vídeo</span>
          </button>
          <button
            className={`effects-tab ${activeTab === 'body' ? 'active' : ''}`}
            onClick={() => setActiveTab('body')}
          >
            <Flame size={15} />
            <span>Efeitos Corporais</span>
          </button>
          <button
            className={`effects-tab ${activeTab === 'photo' ? 'active' : ''}`}
            onClick={() => setActiveTab('photo')}
          >
            <Zap size={15} />
            <span>Efeitos de Fotos</span>
          </button>
        </div>

        {/* Effects Grid */}
        <div className="effects-grid-container">
          {currentList.map((eff) => (
            <div
              key={eff.id}
              className={`effect-card-item ${selectedEffect === eff.id ? 'selected' : ''}`}
              onClick={() => handleSelect(eff.id, eff.name)}
            >
              <div className="effect-icon-circle">
                <span className="effect-emoji">{eff.icon}</span>
                <span className="pro-corner-badge">PRO</span>
                {selectedEffect === eff.id && (
                  <div className="check-corner">
                    <Check size={12} color="#000" />
                  </div>
                )}
              </div>
              <span className="effect-name-label">{eff.name}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pro-modal-footer">
          <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
            Toque em um efeito para aplicar instantaneamente na timeline
          </span>
          <button className="capcut-primary-btn" onClick={onClose}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
