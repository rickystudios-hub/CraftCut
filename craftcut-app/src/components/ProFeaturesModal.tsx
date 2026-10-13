import React from 'react';
import { 
  X, 
  Crown, 
  Sparkles, 
  Wand2, 
  Zap, 
  CheckCircle2, 
  Activity, 
  Mic, 
  Video 
} from 'lucide-react';
import type { MediaClip } from '../types/editor';

interface ProFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFeatureName?: string;
  selectedClip: MediaClip | null;
  onUpdateClipPro: (proUpdates: Partial<MediaClip['pro']>) => void;
  onAutoGenerateCaptions: () => void;
}

export const ProFeaturesModal: React.FC<ProFeaturesModalProps> = ({
  isOpen,
  onClose,
  activeFeatureName,
  selectedClip,
  onUpdateClipPro,
  onAutoGenerateCaptions,
}) => {
  if (!isOpen) return null;

  const pro = selectedClip?.pro;

  const handleToggle = (key: keyof NonNullable<typeof pro>) => {
    if (!pro) return;
    onUpdateClipPro({
      [key]: !pro[key],
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content capcut-pro-modal">
        {/* Header with Crown */}
        <div className="pro-modal-header">
          <div className="pro-header-badge">
            <Crown size={22} className="crown-shining" />
            <div>
              <div className="pro-title-line">
                <h3>CraftCut PRO</h3>
                <span className="unlocked-badge">100% DESBLOQUEADO</span>
              </div>
              <p className="pro-subtitle">Todas as ferramentas premium sem custo ou assinatura</p>
            </div>
          </div>
          <button className="capcut-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Feature Focus Banner if opened via a specific button */}
        {activeFeatureName && (
          <div className="pro-feature-spotlight">
            <Sparkles size={18} className="spotlight-icon" />
            <span>Recurso Selecionado: <strong>{activeFeatureName}</strong> (Ativo e Gratuito)</span>
          </div>
        )}

        {/* PRO Features Grid */}
        <div className="pro-features-list">
          {/* 1. Remover Fundo IA */}
          <div className={`pro-feature-card ${pro?.backgroundRemoved ? 'active' : ''}`}>
            <div className="card-left">
              <div className="icon-wrap bg-purple">
                <Wand2 size={20} />
              </div>
              <div className="card-info">
                <h4>Remover Fundo por IA (Smart Cutout)</h4>
                <p>Isola a pessoa ou objeto em movimento sem tela verde</p>
              </div>
            </div>
            <button
              className={`pro-toggle-btn ${pro?.backgroundRemoved ? 'on' : ''}`}
              onClick={() => handleToggle('backgroundRemoved')}
            >
              {pro?.backgroundRemoved ? 'Ativo' : 'Ativar'}
            </button>
          </div>

          {/* 2. Legendas Automáticas IA */}
          <div className="pro-feature-card">
            <div className="card-left">
              <div className="icon-wrap bg-cyan">
                <Zap size={20} />
              </div>
              <div className="card-info">
                <h4>Legendas Automáticas por IA</h4>
                <p>Gera legendas sincronizadas palavra por palavra em português</p>
              </div>
            </div>
            <button
              className="pro-action-btn"
              onClick={() => {
                onAutoGenerateCaptions();
                onClose();
              }}
            >
              Gerar Agora
            </button>
          </div>

          {/* 3. Câmera Lenta Suave (Optical Flow) */}
          <div className={`pro-feature-card ${pro?.smoothSlowMotion ? 'active' : ''}`}>
            <div className="card-left">
              <div className="icon-wrap bg-pink">
                <Video size={20} />
              </div>
              <div className="card-info">
                <h4>Câmera Lenta Suave (Optical Flow)</h4>
                <p>Interpolação de quadros a 60fps sem travamentos</p>
              </div>
            </div>
            <button
              className={`pro-toggle-btn ${pro?.smoothSlowMotion ? 'on' : ''}`}
              onClick={() => handleToggle('smoothSlowMotion')}
            >
              {pro?.smoothSlowMotion ? 'Ativo' : 'Ativar'}
            </button>
          </div>

          {/* 4. Isolamento Vocal IA */}
          <div className={`pro-feature-card ${pro?.vocalIsolation ? 'active' : ''}`}>
            <div className="card-left">
              <div className="icon-wrap bg-green">
                <Mic size={20} />
              </div>
              <div className="card-info">
                <h4>Isolamento Vocal & Denoise IA</h4>
                <p>Remove ruídos de fundo e separa voz da música perfeitamente</p>
              </div>
            </div>
            <button
              className={`pro-toggle-btn ${pro?.vocalIsolation ? 'on' : ''}`}
              onClick={() => handleToggle('vocalIsolation')}
            >
              {pro?.vocalIsolation ? 'Ativo' : 'Ativar'}
            </button>
          </div>

          {/* 5. Estabilizador Óptico */}
          <div className={`pro-feature-card ${pro?.stabilization ? 'active' : ''}`}>
            <div className="card-left">
              <div className="icon-wrap bg-blue">
                <Activity size={20} />
              </div>
              <div className="card-info">
                <h4>Estabilização Óptica Anti-Tremido</h4>
                <p>Corrige vídeos gravados na mão com giroscópio virtual</p>
              </div>
            </div>
            <button
              className={`pro-toggle-btn ${pro?.stabilization ? 'on' : ''}`}
              onClick={() => handleToggle('stabilization')}
            >
              {pro?.stabilization ? 'Ativo' : 'Ativar'}
            </button>
          </div>

          {/* 6. Super Resolução 4K IA */}
          <div className={`pro-feature-card ${pro?.aiUpscaling ? 'active' : ''}`}>
            <div className="card-left">
              <div className="icon-wrap bg-amber">
                <Crown size={20} />
              </div>
              <div className="card-info">
                <h4>Super Resolução 4K & HDR Inteligente</h4>
                <p>Aprimoramento de nitidez com inteligência artificial</p>
              </div>
            </div>
            <button
              className={`pro-toggle-btn ${pro?.aiUpscaling ? 'on' : ''}`}
              onClick={() => handleToggle('aiUpscaling')}
            >
              {pro?.aiUpscaling ? 'Ativo' : 'Ativar'}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pro-modal-footer">
          <div className="pro-status-notice">
            <CheckCircle2 size={16} className="text-green" />
            <span>Assinatura vitalícia ativa: Sem anúncios e sem marca d'água</span>
          </div>
          <button className="capcut-primary-btn" onClick={onClose}>
            Salvar e Voltar
          </button>
        </div>
      </div>
    </div>
  );
};
