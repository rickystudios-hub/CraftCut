import React, { useState } from 'react';
import { X, Sparkles, Check, CheckCheck } from 'lucide-react';
import type { MediaClip, TransitionType } from '../types/editor';

interface TransitionsModalProps {
  clip: MediaClip | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyTransition: (type: TransitionType, duration: number, applyToAll?: boolean) => void;
}

export const TransitionsModal: React.FC<TransitionsModalProps> = ({
  clip,
  isOpen,
  onClose,
  onApplyTransition,
}) => {
  const [selectedType, setSelectedType] = useState<TransitionType>(clip?.transition?.type || 'dissolve');
  const [duration, setDuration] = useState<number>(clip?.transition?.duration || 0.5);

  if (!isOpen) return null;

  const transitions: { type: TransitionType; name: string; icon: string; desc: string }[] = [
    { type: 'none', name: 'Nenhuma', icon: '⛔', desc: 'Corte seco direto' },
    { type: 'dissolve', name: 'Dissolvência Cruzada', icon: '✨', desc: 'Fusão suave entre clipes' },
    { type: 'dip-black', name: 'Fade para Preto', icon: '🌑', desc: 'Mergulho clássico no escuro' },
    { type: 'wipe-left', name: 'Varredura Esquerda', icon: '◀️', desc: 'Desliza cobrindo para esquerda' },
    { type: 'wipe-right', name: 'Varredura Direita', icon: '▶️', desc: 'Desliza cobrindo para direita' },
    { type: 'zoom', name: 'Zoom Wipe', icon: '🔍', desc: 'Aproximação acelerada com desfoque' },
    { type: 'glitch', name: 'Glitch Transição', icon: '⚡', desc: 'Flash cromático digital' },
  ];

  return (
    <div className="modal-backdrop">
      <div className="modal-content capcut-transitions-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="pro-title-line">
            <Sparkles size={22} className="icon-gold" />
            <h3 style={{ fontSize: '1.15rem' }}>Transições entre Clipes</h3>
          </div>
          <button className="capcut-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Transition Selector Grid */}
        <div className="transitions-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '10px',
          padding: '16px 0',
          maxHeight: '260px',
          overflowY: 'auto'
        }}>
          {transitions.map((t) => (
            <button
              key={t.type}
              className={`transition-card ${selectedType === t.type ? 'active' : ''}`}
              onClick={() => setSelectedType(t.type)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 8px',
                borderRadius: '10px',
                border: selectedType === t.type ? '2px solid #00f2fe' : '1px solid #2a2e39',
                background: selectedType === t.type ? 'rgba(0, 242, 254, 0.12)' : '#15181e',
                color: '#fff',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.18s ease'
              }}
            >
              <span style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{t.icon}</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f0f0f0' }}>{t.name}</span>
              <span style={{ fontSize: '0.68rem', color: '#8c93a0', marginTop: '2px' }}>{t.desc}</span>
            </button>
          ))}
        </div>

        {/* Duration Slider */}
        {selectedType !== 'none' && (
          <div className="filter-slider-group" style={{ padding: '12px 0', borderTop: '1px solid #222630' }}>
            <div className="filter-slider-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Duração da Transição</span>
              <span style={{ fontSize: '0.85rem', color: '#00f2fe', fontWeight: 'bold' }}>{duration.toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.0"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              className="capcut-slider"
              style={{ width: '100%' }}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button
            className="capcut-btn-secondary"
            onClick={() => {
              onApplyTransition(selectedType, duration, true);
              onClose();
            }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              borderRadius: '8px',
              background: '#1f242d',
              border: '1px solid #333a48',
              color: '#cbd5e1',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            <CheckCheck size={16} />
            Aplicar a Todos
          </button>

          <button
            className="capcut-btn-primary"
            onClick={() => {
              onApplyTransition(selectedType, duration, false);
              onClose();
            }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
              border: 'none',
              color: '#000',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 'bold'
            }}
          >
            <Check size={16} />
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
