import React from 'react';
import { X, Gauge } from 'lucide-react';
import type { MediaClip } from '../types/editor';

interface SpeedModalProps {
  clip: MediaClip;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSpeed: (speed: number) => void;
}

export const SpeedModal: React.FC<SpeedModalProps> = ({
  clip,
  isOpen,
  onClose,
  onUpdateSpeed,
}) => {
  if (!isOpen) return null;

  const presetSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 4];

  return (
    <div className="modal-backdrop">
      <div className="modal-content modal-speed">
        <div className="modal-header">
          <div className="modal-title-group">
            <Gauge className="modal-icon text-cyan" size={20} />
            <div>
              <h3 className="modal-title">Velocidade do Clipe</h3>
              <span className="modal-subtitle">Ajuste o tempo de reprodução de {clip.name}</span>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} title="Fechar">
            <X size={18} />
          </button>
        </div>

        {/* Current Speed Display */}
        <div className="speed-display">
          <span className="current-speed-val">{clip.speed}x</span>
          <span className="speed-effect-desc">
            {clip.speed < 1 ? 'Câmera Lenta (Slow Motion)' : clip.speed > 1 ? 'Aceleração (Time-lapse)' : 'Velocidade Normal'}
          </span>
        </div>

        {/* Speed Preset Chips */}
        <div className="speed-preset-grid">
          {presetSpeeds.map((s) => (
            <button
              key={s}
              className={`speed-chip ${clip.speed === s ? 'active' : ''}`}
              onClick={() => onUpdateSpeed(s)}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Speed Slider */}
        <div className="slider-item" style={{ marginTop: '1.25rem' }}>
          <div className="slider-label">
            <span>Ajuste Fino de Velocidade</span>
            <span className="slider-val">{clip.speed}x</span>
          </div>
          <input
            type="range"
            min="0.25"
            max="4"
            step="0.05"
            value={clip.speed}
            onChange={(e) => onUpdateSpeed(Number(e.target.value))}
          />
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
