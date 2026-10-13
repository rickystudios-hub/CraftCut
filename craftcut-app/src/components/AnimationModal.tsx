import React, { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import type { MediaClip } from '../types/editor';

interface AnimationModalProps {
  clip: MediaClip | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateAnimation: (anim: MediaClip['animation']) => void;
}

export const AnimationModal: React.FC<AnimationModalProps> = ({
  clip,
  isOpen,
  onClose,
  onUpdateAnimation,
}) => {
  const [activeTab, setActiveTab] = useState<'in' | 'out' | 'combo'>('in');
  const [animDuration, setAnimDuration] = useState(0.8);
  const [selectedAnim, setSelectedAnim] = useState<MediaClip['animation']>(clip?.animation || 'fade');

  if (!isOpen || !clip) return null;

  const inAnimations: { id: MediaClip['animation']; name: string; icon: string }[] = [
    { id: 'none', name: 'Nenhuma', icon: '🚫' },
    { id: 'fade', name: 'Surgir (Fade In)', icon: '🌫️' },
    { id: 'zoom', name: 'Zoom 1', icon: '🔍' },
    { id: 'slide', name: 'Deslizar Direita', icon: '➡️' },
    { id: 'glitch', name: 'Falha / Glitch', icon: '⚡' },
  ];

  const comboAnimations: { id: MediaClip['animation']; name: string; icon: string }[] = [
    { id: 'zoom', name: 'Giro 3D Dinâmico', icon: '🔄' },
    { id: 'glitch', name: 'Pêndulo Cósmico', icon: '⏱️' },
    { id: 'fade', name: 'Flash Strobe', icon: '💥' },
  ];

  const currentList = activeTab === 'combo' ? comboAnimations : inAnimations;

  const handleSelect = (animId: MediaClip['animation']) => {
    setSelectedAnim(animId);
    onUpdateAnimation(animId);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content capcut-animation-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="pro-title-line">
            <Sparkles size={22} className="icon-gold" />
            <h3 style={{ fontSize: '1.15rem' }}>Animação do Clipe</h3>
            <span className="unlocked-badge">PRO DESBLOQUEADO</span>
          </div>
          <button className="capcut-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Sub-Tabs: Entrada, Saída, Combinação */}
        <div className="capcut-effects-tabs">
          <button
            className={`effects-tab ${activeTab === 'in' ? 'active' : ''}`}
            onClick={() => setActiveTab('in')}
          >
            <span>Entrada</span>
          </button>
          <button
            className={`effects-tab ${activeTab === 'out' ? 'active' : ''}`}
            onClick={() => setActiveTab('out')}
          >
            <span>Saída</span>
          </button>
          <button
            className={`effects-tab ${activeTab === 'combo' ? 'active' : ''}`}
            onClick={() => setActiveTab('combo')}
          >
            <span>Combinação</span>
            <span className="pro-tag-sm" style={{ marginLeft: '4px' }}>PRO</span>
          </button>
        </div>

        {/* Animations Grid */}
        <div className="effects-grid-container" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {currentList.map((item) => (
            <div
              key={item.id + item.name}
              className={`effect-card-item ${selectedAnim === item.id ? 'selected' : ''}`}
              onClick={() => handleSelect(item.id)}
            >
              <div className="effect-icon-circle">
                <span className="effect-emoji">{item.icon}</span>
                {selectedAnim === item.id && (
                  <div className="check-corner">
                    <Check size={12} color="#000" />
                  </div>
                )}
              </div>
              <span className="effect-name-label">{item.name}</span>
            </div>
          ))}
        </div>

        {/* Animation Duration Slider */}
        <div className="slider-item" style={{ marginTop: '1.25rem' }}>
          <div className="slider-label">
            <span>Duração da Animação</span>
            <span className="slider-val">{animDuration.toFixed(1)}s</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={animDuration}
            onChange={(e) => setAnimDuration(Number(e.target.value))}
          />
        </div>

        {/* Footer */}
        <div className="pro-modal-footer">
          <button className="capcut-primary-btn" onClick={onClose}>
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
