import React, { useState } from 'react';
import { X, Smile, ThumbsUp, ArrowRight } from 'lucide-react';

interface StickersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSticker: (text: string) => void;
}

export const StickersModal: React.FC<StickersModalProps> = ({
  isOpen,
  onClose,
  onAddSticker,
}) => {
  const [activeTab, setActiveTab] = useState<'emoji' | 'social' | 'arrows'>('social');

  if (!isOpen) return null;

  const emojis = ['🔥', '⚡', '💖', '😂', '🚀', '👑', '✨', '💯', '🤩', '💥', '🎉', '🏆'];

  const socialBadges = [
    { text: '👍 INSCREVA-SE', desc: 'Canal YouTube' },
    { text: '❤️ DEIXE O LIKE', desc: 'Engajamento' },
    { text: '🔔 ATIVE O SINO', desc: 'Notificações' },
    { text: '🚀 COMPARTILHAR', desc: 'Viral' },
    { text: '💬 COMENTE AQUI', desc: 'Interação' },
    { text: '📌 SALVE ESTE VÍDEO', desc: 'Reels/TikTok' },
  ];

  const arrows = ['👉', '👇', '🎯', '📍', '⬇️', '➡️', '✨'];

  return (
    <div className="modal-backdrop">
      <div className="modal-content capcut-stickers-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="pro-title-line">
            <Smile size={22} className="icon-cyan" />
            <h3 style={{ fontSize: '1.15rem' }}>Figurinhas & Stickers</h3>
          </div>
          <button className="capcut-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Sub-Tabs */}
        <div className="capcut-effects-tabs">
          <button
            className={`effects-tab ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => setActiveTab('social')}
          >
            <ThumbsUp size={15} />
            <span>Redes Sociais</span>
          </button>
          <button
            className={`effects-tab ${activeTab === 'emoji' ? 'active' : ''}`}
            onClick={() => setActiveTab('emoji')}
          >
            <Smile size={15} />
            <span>Emojis</span>
          </button>
          <button
            className={`effects-tab ${activeTab === 'arrows' ? 'active' : ''}`}
            onClick={() => setActiveTab('arrows')}
          >
            <ArrowRight size={15} />
            <span>Setas & Foco</span>
          </button>
        </div>

        {/* Tab 1: Social Badges */}
        {activeTab === 'social' && (
          <div className="audio-tab-content">
            <div className="stickers-badges-grid">
              {socialBadges.map((s) => (
                <div
                  key={s.text}
                  className="social-badge-card"
                  onClick={() => {
                    onAddSticker(s.text);
                    onClose();
                  }}
                >
                  <span className="badge-text">{s.text}</span>
                  <span className="badge-sub">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Emojis */}
        {activeTab === 'emoji' && (
          <div className="audio-tab-content">
            <div className="effects-grid-container" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {emojis.map((e) => (
                <div
                  key={e}
                  className="effect-card-item"
                  onClick={() => {
                    onAddSticker(e);
                    onClose();
                  }}
                >
                  <div className="effect-icon-circle">
                    <span style={{ fontSize: '1.8rem' }}>{e}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Arrows */}
        {activeTab === 'arrows' && (
          <div className="audio-tab-content">
            <div className="effects-grid-container" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {arrows.map((a) => (
                <div
                  key={a}
                  className="effect-card-item"
                  onClick={() => {
                    onAddSticker(a);
                    onClose();
                  }}
                >
                  <div className="effect-icon-circle">
                    <span style={{ fontSize: '1.8rem' }}>{a}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pro-modal-footer">
          <button className="capcut-primary-btn" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
