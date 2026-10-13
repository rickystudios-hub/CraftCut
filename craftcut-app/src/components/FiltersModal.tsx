import React from 'react';
import { X, RotateCcw, Sparkles } from 'lucide-react';
import type { MediaClip, FilterSettings } from '../types/editor';

interface FiltersModalProps {
  clip: MediaClip;
  isOpen: boolean;
  onClose: () => void;
  onUpdateFilters: (filters: FilterSettings) => void;
}

export const FiltersModal: React.FC<FiltersModalProps> = ({
  clip,
  isOpen,
  onClose,
  onUpdateFilters,
}) => {
  if (!isOpen) return null;

  const f = clip.filters;

  const handleSlider = (key: keyof FilterSettings, value: number) => {
    onUpdateFilters({
      ...f,
      [key]: value,
    });
  };

  const resetFilters = () => {
    onUpdateFilters({
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
    });
  };

  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'cyberpunk':
        onUpdateFilters({
          brightness: 110,
          contrast: 130,
          saturation: 160,
          blur: 0,
          grayscale: 0,
          sepia: 0,
          hueRotate: 280,
          vignette: 20,
          temperature: -10,
          sharpness: 30,
        });
        break;
      case 'vintage':
        onUpdateFilters({
          brightness: 95,
          contrast: 105,
          saturation: 80,
          blur: 0,
          grayscale: 0,
          sepia: 40,
          hueRotate: 15,
          vignette: 35,
          temperature: 15,
          sharpness: 10,
        });
        break;
      case 'bw':
        onUpdateFilters({
          brightness: 100,
          contrast: 125,
          saturation: 0,
          blur: 0,
          grayscale: 100,
          sepia: 0,
          hueRotate: 0,
          vignette: 25,
          temperature: 0,
          sharpness: 20,
        });
        break;
      case 'vivid':
        onUpdateFilters({
          brightness: 105,
          contrast: 120,
          saturation: 150,
          blur: 0,
          grayscale: 0,
          sepia: 0,
          hueRotate: 0,
          vignette: 10,
          temperature: 5,
          sharpness: 25,
        });
        break;
      default:
        resetFilters();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content modal-filters">
        <div className="modal-header">
          <div className="modal-title-group">
            <Sparkles className="modal-icon text-cyan" size={20} />
            <div>
              <h3 className="modal-title">Filtros & Ajustes de Cor</h3>
              <span className="modal-subtitle">Aplicado a: {clip.name}</span>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} title="Fechar">
            <X size={18} />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="presets-row">
          <button className="preset-chip" onClick={() => applyPreset('default')}>
            Original
          </button>
          <button className="preset-chip chip-cyan" onClick={() => applyPreset('cyberpunk')}>
            Cyberpunk Neon
          </button>
          <button className="preset-chip chip-amber" onClick={() => applyPreset('vintage')}>
            Vintage 90s
          </button>
          <button className="preset-chip chip-mono" onClick={() => applyPreset('bw')}>
            Preto & Branco
          </button>
          <button className="preset-chip chip-magenta" onClick={() => applyPreset('vivid')}>
            Vívido Pop
          </button>
        </div>

        {/* Filter Sliders */}
        <div className="sliders-grid">
          {/* Brilho */}
          <div className="slider-item">
            <div className="slider-label">
              <span>Brilho</span>
              <span className="slider-val">{f.brightness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={f.brightness}
              onChange={(e) => handleSlider('brightness', Number(e.target.value))}
            />
          </div>

          {/* Contraste */}
          <div className="slider-item">
            <div className="slider-label">
              <span>Contraste</span>
              <span className="slider-val">{f.contrast}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={f.contrast}
              onChange={(e) => handleSlider('contrast', Number(e.target.value))}
            />
          </div>

          {/* Saturação */}
          <div className="slider-item">
            <div className="slider-label">
              <span>Saturação</span>
              <span className="slider-val">{f.saturation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={f.saturation}
              onChange={(e) => handleSlider('saturation', Number(e.target.value))}
            />
          </div>

          {/* Desfoque / Blur */}
          <div className="slider-item">
            <div className="slider-label">
              <span>Desfoque</span>
              <span className="slider-val">{f.blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              value={f.blur}
              onChange={(e) => handleSlider('blur', Number(e.target.value))}
            />
          </div>

          {/* Sépia */}
          <div className="slider-item">
            <div className="slider-label">
              <span>Sépia</span>
              <span className="slider-val">{f.sepia}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={f.sepia}
              onChange={(e) => handleSlider('sepia', Number(e.target.value))}
            />
          </div>

          {/* Matiz (Hue Rotate) */}
          <div className="slider-item">
            <div className="slider-label">
              <span>Matiz de Cor</span>
              <span className="slider-val">{f.hueRotate}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={f.hueRotate}
              onChange={(e) => handleSlider('hueRotate', Number(e.target.value))}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={resetFilters}>
            <RotateCcw size={15} />
            <span>Redefinir</span>
          </button>
          <button className="btn-primary" onClick={onClose}>
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
