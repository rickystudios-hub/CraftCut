import React, { useState } from 'react';
import { X, Wand2, Pipette, Sparkles, Check } from 'lucide-react';
import type { MediaClip } from '../types/editor';

interface CutoutModalProps {
  clip: MediaClip | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateCutout: (proUpdates: Partial<MediaClip['pro']>) => void;
}

export const CutoutModal: React.FC<CutoutModalProps> = ({
  clip,
  isOpen,
  onClose,
  onUpdateCutout,
}) => {
  const [activeTab, setActiveTab] = useState<'auto' | 'chroma' | 'stroke'>('auto');
  const [chromaIntensity, setChromaIntensity] = useState(50);
  const [chromaShadow, setChromaShadow] = useState(30);
  const [selectedColor, setSelectedColor] = useState('#00ff00');

  if (!isOpen || !clip) return null;

  const pro = clip.pro;

  return (
    <div className="modal-backdrop">
      <div className="modal-content capcut-cutout-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="pro-title-line">
            <Wand2 size={22} className="icon-gold" />
            <h3 style={{ fontSize: '1.15rem' }}>Recorte & Remover Fundo</h3>
            <span className="unlocked-badge">PRO DESBLOQUEADO</span>
          </div>
          <button className="capcut-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Sub-Tabs */}
        <div className="capcut-effects-tabs">
          <button
            className={`effects-tab ${activeTab === 'auto' ? 'active' : ''}`}
            onClick={() => setActiveTab('auto')}
          >
            <Wand2 size={15} />
            <span>Remoção Automática</span>
          </button>
          <button
            className={`effects-tab ${activeTab === 'chroma' ? 'active' : ''}`}
            onClick={() => setActiveTab('chroma')}
          >
            <Pipette size={15} />
            <span>Chroma Key</span>
          </button>
          <button
            className={`effects-tab ${activeTab === 'stroke' ? 'active' : ''}`}
            onClick={() => setActiveTab('stroke')}
          >
            <Sparkles size={15} />
            <span>Traço / Contorno</span>
          </button>
        </div>

        {/* Tab 1: Remoção Automática */}
        {activeTab === 'auto' && (
          <div className="audio-tab-content">
            <div className="cutout-hero-card">
              <div className="hero-badge">
                <Wand2 size={24} className="icon-gold" />
              </div>
              <h4>Isolamento Inteligente de Pessoas</h4>
              <p>O algoritmo de IA identifica a silhueta em movimento e remove o plano de fundo em tempo real sem necessidade de tela verde.</p>
              
              <button
                className={`cutout-main-toggle ${pro.backgroundRemoved ? 'active' : ''}`}
                onClick={() => onUpdateCutout({ backgroundRemoved: !pro.backgroundRemoved })}
              >
                {pro.backgroundRemoved ? '✓ Fundo Removido por IA' : 'Ativar Remoção Automática'}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Chroma Key */}
        {activeTab === 'chroma' && (
          <div className="audio-tab-content">
            <p style={{ fontSize: '0.75rem', color: '#a1a1aa', marginBottom: '12px' }}>
              Selecione a cor de fundo para torná-la transparente:
            </p>

            <div className="chroma-colors-row">
              {['#00ff00', '#0000ff', '#ff00ff', '#000000', '#ffffff'].map((c) => (
                <button
                  key={c}
                  className={`color-swatch-circle ${selectedColor === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => {
                    setSelectedColor(c);
                    onUpdateCutout({ chromaKeyEnabled: true, chromaColor: c });
                  }}
                >
                  {selectedColor === c && <Check size={14} color={c === '#ffffff' ? '#000' : '#fff'} />}
                </button>
              ))}
            </div>

            <div className="slider-item" style={{ marginTop: '1rem' }}>
              <div className="slider-label">
                <span>Intensidade do Recorte</span>
                <span className="slider-val">{chromaIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={chromaIntensity}
                onChange={(e) => setChromaIntensity(Number(e.target.value))}
              />
            </div>

            <div className="slider-item" style={{ marginTop: '0.75rem' }}>
              <div className="slider-label">
                <span>Sombra / Suavização de Borda</span>
                <span className="slider-val">{chromaShadow}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={chromaShadow}
                onChange={(e) => setChromaShadow(Number(e.target.value))}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Traço / Contorno */}
        {activeTab === 'stroke' && (
          <div className="audio-tab-content">
            <p style={{ fontSize: '0.75rem', color: '#a1a1aa', marginBottom: '12px' }}>
              Adicione uma linha de contorno neon ao redor do recorte da pessoa:
            </p>
            <div className="effects-grid-container">
              {[
                { name: 'Nenhum', color: 'transparent' },
                { name: 'Branco Puro', color: '#ffffff' },
                { name: 'Ciano Neon', color: '#00f2fe' },
                { name: 'Ouro PRO', color: '#ffd700' },
                { name: 'Rosa Vívido', color: '#ec4899' },
                { name: 'Verde Matrix', color: '#10b981' },
              ].map((s) => (
                <div
                  key={s.name}
                  className="effect-card-item"
                  onClick={() => {}}
                >
                  <div
                    className="effect-icon-circle"
                    style={{ borderColor: s.color !== 'transparent' ? s.color : '#333' }}
                  >
                    <span className="effect-emoji">✨</span>
                  </div>
                  <span className="effect-name-label">{s.name}</span>
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
