import React, { useState } from 'react';
import { X, Crop, Check, Repeat } from 'lucide-react';
import type { MediaClip, MaskType } from '../types/editor';

interface MaskModalProps {
  clip: MediaClip | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateMask: (mask: MaskType) => void;
}

export const MaskModal: React.FC<MaskModalProps> = ({
  clip,
  isOpen,
  onClose,
  onUpdateMask,
}) => {
  const [selectedMask, setSelectedMask] = useState<MaskType>(clip?.mask || 'none');
  const [feather, setFeather] = useState(10);
  const [isInverted, setIsInverted] = useState(false);

  if (!isOpen || !clip) return null;

  const maskOptions: { id: MaskType; name: string; icon: string }[] = [
    { id: 'none', name: 'Nenhuma', icon: '🚫' },
    { id: 'split', name: 'Dividir', icon: '◫' },
    { id: 'film', name: 'Película', icon: '🎞️' },
    { id: 'circle', name: 'Círculo', icon: '⭕' },
    { id: 'rectangle', name: 'Retângulo', icon: '▭' },
    { id: 'heart', name: 'Coração', icon: '❤️' },
    { id: 'star', name: 'Estrela', icon: '⭐' },
  ];

  const handleSelectMask = (m: MaskType) => {
    setSelectedMask(m);
    onUpdateMask(m);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content capcut-mask-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="pro-title-line">
            <Crop size={22} className="icon-cyan" />
            <h3 style={{ fontSize: '1.15rem' }}>Máscaras & Formas</h3>
          </div>
          <button className="capcut-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Mask Shapes Row */}
        <div className="effects-grid-container" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {maskOptions.map((opt) => (
            <div
              key={opt.id}
              className={`effect-card-item ${selectedMask === opt.id ? 'selected' : ''}`}
              onClick={() => handleSelectMask(opt.id)}
            >
              <div className="effect-icon-circle">
                <span className="effect-emoji" style={{ fontSize: '1.4rem' }}>{opt.icon}</span>
                {selectedMask === opt.id && (
                  <div className="check-corner">
                    <Check size={12} color="#000" />
                  </div>
                )}
              </div>
              <span className="effect-name-label">{opt.name}</span>
            </div>
          ))}
        </div>

        {/* Mask Adjustments */}
        {selectedMask !== 'none' && (
          <div className="mask-adjust-section" style={{ marginTop: '1.25rem' }}>
            <div className="slider-item">
              <div className="slider-label">
                <span>Pena / Suavização da Borda</span>
                <span className="slider-val">{feather}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={feather}
                onChange={(e) => setFeather(Number(e.target.value))}
              />
            </div>

            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className={`capcut-mini-btn ${isInverted ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', border: '1px solid #333' }}
                onClick={() => setIsInverted(!isInverted)}
              >
                <Repeat size={14} />
                <span style={{ fontSize: '0.75rem' }}>Inverter Máscara</span>
              </button>
            </div>
          </div>
        )}

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
