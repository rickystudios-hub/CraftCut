import React from 'react';
import { X, Type, Bold, Italic } from 'lucide-react';
import type { MediaClip, TextStyleSettings } from '../types/editor';

interface TextEditModalProps {
  clip: MediaClip;
  isOpen: boolean;
  onClose: () => void;
  onUpdateText: (settings: TextStyleSettings) => void;
}

export const TextEditModal: React.FC<TextEditModalProps> = ({
  clip,
  isOpen,
  onClose,
  onUpdateText,
}) => {
  if (!isOpen || !clip.textSettings) return null;

  const ts = clip.textSettings;

  const handleChange = (key: keyof TextStyleSettings, value: any) => {
    onUpdateText({
      ...ts,
      [key]: value,
    });
  };

  const presetColors = [
    '#ffffff',
    '#00f2fe',
    '#eab308',
    '#ec4899',
    '#10b981',
    '#f97316',
    '#000000',
  ];

  const presetBgColors = [
    'transparent',
    'rgba(0, 0, 0, 0.7)',
    'rgba(124, 77, 255, 0.7)',
    'rgba(236, 72, 153, 0.7)',
    'rgba(16, 185, 129, 0.7)',
  ];

  return (
    <div className="modal-backdrop">
      <div className="modal-content modal-text">
        <div className="modal-header">
          <div className="modal-title-group">
            <Type className="modal-icon text-yellow" size={20} />
            <div>
              <h3 className="modal-title">Editar Camada de Texto</h3>
              <span className="modal-subtitle">Personalize legendas e títulos</span>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} title="Fechar">
            <X size={18} />
          </button>
        </div>

        {/* Text Input */}
        <div className="form-group">
          <label className="form-label">Texto da Legenda</label>
          <input
            type="text"
            className="text-edit-input"
            value={ts.text}
            onChange={(e) => handleChange('text', e.target.value)}
            placeholder="Digite o texto do vídeo..."
          />
        </div>

        {/* Font Style Controls */}
        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Tamanho da Fonte ({ts.fontSize}px)</label>
            <input
              type="range"
              min="16"
              max="72"
              value={ts.fontSize}
              onChange={(e) => handleChange('fontSize', Number(e.target.value))}
            />
          </div>

          <div className="style-toggles">
            <button
              className={`toggle-btn ${ts.isBold ? 'active' : ''}`}
              onClick={() => handleChange('isBold', !ts.isBold)}
              title="Negrito"
            >
              <Bold size={16} />
            </button>
            <button
              className={`toggle-btn ${ts.isItalic ? 'active' : ''}`}
              onClick={() => handleChange('isItalic', !ts.isItalic)}
              title="Itálico"
            >
              <Italic size={16} />
            </button>
          </div>
        </div>

        {/* Text Color Selection */}
        <div className="form-group">
          <label className="form-label">Cor do Texto</label>
          <div className="color-palette">
            {presetColors.map((color) => (
              <button
                key={color}
                className={`color-swatch ${ts.color === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleChange('color', color)}
              />
            ))}
          </div>
        </div>

        {/* Background Color Selection */}
        <div className="form-group">
          <label className="form-label">Fundo / Tarja</label>
          <div className="color-palette">
            {presetBgColors.map((bg, idx) => (
              <button
                key={idx}
                className={`color-swatch ${ts.backgroundColor === bg ? 'active' : ''}`}
                style={{ backgroundColor: bg === 'transparent' ? '#262a38' : bg }}
                onClick={() => handleChange('backgroundColor', bg)}
                title={bg === 'transparent' ? 'Transparente' : 'Cor com opacidade'}
              >
                {bg === 'transparent' && <span className="trans-mark">Ø</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Position Controls */}
        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Posição Vertical ({ts.y}%)</label>
            <input
              type="range"
              min="10"
              max="90"
              value={ts.y}
              onChange={(e) => handleChange('y', Number(e.target.value))}
            />
          </div>
          <div className="form-group flex-1">
            <label className="form-label">Posição Horizontal ({ts.x}%)</label>
            <input
              type="range"
              min="10"
              max="90"
              value={ts.x}
              onChange={(e) => handleChange('x', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Salvar Legenda
          </button>
        </div>
      </div>
    </div>
  );
};
