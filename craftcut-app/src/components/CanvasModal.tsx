import React, { useState } from 'react';
import { X, Palette, Check } from 'lucide-react';

interface CanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBackground: (type: 'color' | 'blur' | 'pattern', value: string) => void;
}

export const CanvasModal: React.FC<CanvasModalProps> = ({
  isOpen,
  onClose,
  onApplyBackground,
}) => {
  const [activeTab, setActiveTab] = useState<'color' | 'blur' | 'pattern'>('color');
  const [selectedItem, setSelectedItem] = useState<string>('#000000');

  if (!isOpen) return null;

  const colors = [
    '#000000', '#ffffff', '#18181b', '#ef4444', '#f97316', '#eab308', 
    '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
  ];

  const blurLevels = [
    { id: 'none', name: 'Nenhum', desc: '0px' },
    { id: 'low', name: 'Leve', desc: '10px' },
    { id: 'med', name: 'Médio', desc: '25px' },
    { id: 'high', name: 'Intenso', desc: '50px' },
  ];

  const patterns = [
    { id: 'grad-1', name: 'Ciberpunk', val: 'linear-gradient(135deg, #0f172a, #06b6d4)' },
    { id: 'grad-2', name: 'Pôr do Sol', val: 'linear-gradient(135deg, #831843, #f43f5e)' },
    { id: 'grad-3', name: 'Ultra Roxo', val: 'linear-gradient(135deg, #3b0764, #a855f7)' },
    { id: 'grad-4', name: 'Esmeralda', val: 'linear-gradient(135deg, #064e3b, #10b981)' },
  ];

  return (
    <div className="modal-backdrop">
      <div className="modal-content capcut-canvas-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="pro-title-line">
            <Palette size={22} className="icon-cyan" />
            <h3 style={{ fontSize: '1.15rem' }}>Plano de Fundo / Tela</h3>
          </div>
          <button className="capcut-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Sub-Tabs: Cor, Desfoque, Plano de fundo */}
        <div className="capcut-effects-tabs">
          <button
            className={`effects-tab ${activeTab === 'color' ? 'active' : ''}`}
            onClick={() => setActiveTab('color')}
          >
            <span>Cor</span>
          </button>
          <button
            className={`effects-tab ${activeTab === 'blur' ? 'active' : ''}`}
            onClick={() => setActiveTab('blur')}
          >
            <span>Desfoque</span>
          </button>
          <button
            className={`effects-tab ${activeTab === 'pattern' ? 'active' : ''}`}
            onClick={() => setActiveTab('pattern')}
          >
            <span>Padrões & Gradientes</span>
          </button>
        </div>

        {/* Tab 1: Colors */}
        {activeTab === 'color' && (
          <div className="audio-tab-content">
            <div className="chroma-colors-row" style={{ flexWrap: 'wrap', gap: '10px' }}>
              {colors.map((c) => (
                <button
                  key={c}
                  className={`color-swatch-circle ${selectedItem === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c, width: '38px', height: '38px' }}
                  onClick={() => {
                    setSelectedItem(c);
                    onApplyBackground('color', c);
                  }}
                >
                  {selectedItem === c && <Check size={16} color={c === '#ffffff' ? '#000' : '#fff'} />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Blur */}
        {activeTab === 'blur' && (
          <div className="audio-tab-content">
            <p style={{ fontSize: '0.75rem', color: '#a1a1aa', marginBottom: '12px' }}>
              Aplica o desfoque do próprio vídeo preenchendo as bordas do formato:
            </p>
            <div className="effects-grid-container" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {blurLevels.map((b) => (
                <div
                  key={b.id}
                  className={`effect-card-item ${selectedItem === b.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedItem(b.id);
                    onApplyBackground('blur', b.desc);
                  }}
                >
                  <div className="effect-icon-circle">
                    <span className="effect-emoji">🌫️</span>
                  </div>
                  <span className="effect-name-label">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Patterns */}
        {activeTab === 'pattern' && (
          <div className="audio-tab-content">
            <div className="effects-grid-container" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {patterns.map((p) => (
                <div
                  key={p.id}
                  className={`sample-card ${selectedItem === p.id ? 'selected' : ''}`}
                  style={{ background: p.val, height: '60px', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedItem(p.id);
                    onApplyBackground('pattern', p.val);
                  }}
                >
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>{p.name}</span>
                </div>
              ))}
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
