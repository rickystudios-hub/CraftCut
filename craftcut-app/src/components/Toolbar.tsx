import React from 'react';
import { 
  ChevronLeft,
  Scissors, 
  Gauge, 
  Sparkles, 
  SlidersHorizontal, 
  Type, 
  Music, 
  Layers, 
  Wand2, 
  Volume2, 
  RotateCw, 
  FlipHorizontal, 
  Copy, 
  Trash2, 
  Ratio,
  Mic,
  ShieldCheck,
  Disc,
  Smile,
  Snowflake,
  Activity,
  Palette,
  Crop,
  Terminal,
  Shuffle
} from 'lucide-react';
import type { MediaClip } from '../types/editor';

interface ToolbarProps {
  selectedClip: MediaClip | null;
  onClearSelection: () => void;
  onSplit: () => void;
  onOpenSpeedModal: () => void;
  onOpenFiltersModal: () => void;
  onOpenTextModal: () => void;
  onOpenProModal: (featureName: string) => void;
  onOpenEffectsModal: () => void;
  onOpenAudioModal: () => void;
  onOpenCutoutModal: () => void;
  onOpenMaskModal: () => void;
  onOpenAnimationModal: () => void;
  onOpenCanvasModal: () => void;
  onOpenStickersModal: () => void;
  onRotateClip: () => void;
  onFlipClip: () => void;
  onDuplicateClip: () => void;
  onDeleteClip: () => void;
  onAddTextClip: () => void;
  onOpenMediaDrawer: () => void;
  onToggleFreeze: () => void;
  onOpenTransitionsModal: () => void;
  onOpenScriptingModal: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedClip,
  onClearSelection,
  onSplit,
  onOpenSpeedModal,
  onOpenFiltersModal,
  onOpenTextModal,
  onOpenProModal,
  onOpenEffectsModal,
  onOpenAudioModal,
  onOpenCutoutModal,
  onOpenMaskModal,
  onOpenAnimationModal,
  onOpenCanvasModal,
  onOpenStickersModal,
  onRotateClip,
  onFlipClip,
  onDuplicateClip,
  onDeleteClip,
  onAddTextClip,
  onOpenMediaDrawer,
  onToggleFreeze,
  onOpenTransitionsModal,
  onOpenScriptingModal,
}) => {
  // If clip is selected, render CapCut's Edit Sub-Menu
  if (selectedClip) {
    return (
      <div className="capcut-bottom-bar edit-sub-menu">
        {/* Back Button '<' */}
        <button 
          className="capcut-bar-item back-btn" 
          onClick={onClearSelection}
          title="Voltar ao menu principal"
        >
          <ChevronLeft size={22} />
          <span>Voltar</span>
        </button>

        {/* Dividir (Split) */}
        <button className="capcut-bar-item" onClick={onSplit} title="Dividir (S)">
          <Scissors size={20} className="icon-cyan" />
          <span>Dividir</span>
        </button>

        {/* Editar Texto (se for clipe de texto) */}
        {selectedClip.type === 'text' && (
          <button className="capcut-bar-item" onClick={onOpenTextModal}>
            <Type size={20} className="icon-cyan" />
            <span>Editar Texto</span>
          </button>
        )}

        {/* Velocidade (Speed) */}
        <button className="capcut-bar-item" onClick={onOpenSpeedModal}>
          <Gauge size={20} />
          <span>Velocidade</span>
        </button>

        {/* Animação PRO */}
        <button className="capcut-bar-item pro-item" onClick={onOpenAnimationModal}>
          <div className="pro-corner-badge">PRO</div>
          <Sparkles size={20} className="icon-gold" />
          <span>Animação</span>
        </button>

        {/* Transições */}
        <button className="capcut-bar-item" onClick={onOpenTransitionsModal} title="Transições entre clipes">
          <Shuffle size={20} className="icon-cyan" />
          <span>Transições</span>
        </button>

        {/* Remover Fundo IA PRO */}
        <button className="capcut-bar-item pro-item" onClick={onOpenCutoutModal}>
          <div className="pro-corner-badge">PRO</div>
          <Wand2 size={20} className="icon-gold" />
          <span>Recorte IA</span>
        </button>

        {/* Volume & Áudio */}
        <button className="capcut-bar-item" onClick={onOpenAudioModal}>
          <Volume2 size={20} />
          <span>Volume</span>
        </button>

        {/* Filtros */}
        <button className="capcut-bar-item" onClick={onOpenFiltersModal}>
          <Disc size={20} />
          <span>Filtros</span>
        </button>

        {/* Ajustar */}
        <button className="capcut-bar-item" onClick={onOpenFiltersModal}>
          <SlidersHorizontal size={20} />
          <span>Ajustar</span>
        </button>

        {/* Máscara */}
        <button className="capcut-bar-item" onClick={onOpenMaskModal}>
          <Crop size={20} />
          <span>Máscara</span>
        </button>

        {/* Efeitos de Voz PRO */}
        <button className="capcut-bar-item pro-item" onClick={onOpenAudioModal}>
          <div className="pro-corner-badge">PRO</div>
          <Mic size={20} className="icon-gold" />
          <span>Voz PRO</span>
        </button>

        {/* Reduzir Ruído PRO */}
        <button className="capcut-bar-item pro-item" onClick={onOpenAudioModal}>
          <div className="pro-corner-badge">PRO</div>
          <ShieldCheck size={20} className="icon-gold" />
          <span>Denoise</span>
        </button>

        {/* Estabilização PRO */}
        <button 
          className="capcut-bar-item pro-item" 
          onClick={() => onOpenProModal('Estabilização de Câmera Óptica')}
        >
          <div className="pro-corner-badge">PRO</div>
          <Activity size={20} className="icon-gold" />
          <span>Estabilizar</span>
        </button>

        {/* Congelar (Freeze) */}
        <button className="capcut-bar-item" onClick={onToggleFreeze}>
          <Snowflake size={20} />
          <span>Congelar</span>
        </button>

        {/* Girar */}
        <button className="capcut-bar-item" onClick={onRotateClip}>
          <RotateCw size={20} />
          <span>Girar</span>
        </button>

        {/* Espelhar */}
        <button className="capcut-bar-item" onClick={onFlipClip}>
          <FlipHorizontal size={20} />
          <span>Espelhar</span>
        </button>

        {/* Duplicar */}
        <button className="capcut-bar-item" onClick={onDuplicateClip}>
          <Copy size={20} />
          <span>Duplicar</span>
        </button>

        {/* Excluir */}
        <button className="capcut-bar-item text-danger" onClick={onDeleteClip}>
          <Trash2 size={20} />
          <span>Excluir</span>
        </button>
      </div>
    );
  }

  // Level 1: CapCut Main Bottom Bar (No clip selected)
  return (
    <div className="capcut-bottom-bar main-menu">
      {/* Editar */}
      <button className="capcut-bar-item" onClick={onOpenMediaDrawer}>
        <Scissors size={22} />
        <span>Editar</span>
      </button>

      {/* Áudio */}
      <button className="capcut-bar-item" onClick={onOpenAudioModal}>
        <Music size={22} />
        <span>Áudio</span>
      </button>

      {/* Texto */}
      <button className="capcut-bar-item" onClick={onAddTextClip}>
        <Type size={22} />
        <span>Texto</span>
      </button>

      {/* Camadas / Sobreposição (PIP) */}
      <button className="capcut-bar-item" onClick={onOpenMediaDrawer}>
        <Layers size={22} />
        <span>Camadas</span>
      </button>

      {/* Efeitos de Vídeo PRO */}
      <button className="capcut-bar-item pro-item" onClick={onOpenEffectsModal}>
        <div className="pro-corner-badge">PRO</div>
        <Sparkles size={22} className="icon-gold" />
        <span>Efeitos</span>
      </button>

      {/* Filtros */}
      <button className="capcut-bar-item" onClick={onOpenFiltersModal}>
        <Disc size={22} />
        <span>Filtros</span>
      </button>

      {/* Legendas Automáticas IA PRO */}
      <button 
        className="capcut-bar-item pro-item" 
        onClick={() => onOpenProModal('Legendas Automáticas por IA')}
      >
        <div className="pro-corner-badge">PRO</div>
        <Wand2 size={22} className="icon-gold" />
        <span>Legendas IA</span>
      </button>

      {/* Ajustar */}
      <button className="capcut-bar-item" onClick={onOpenFiltersModal}>
        <SlidersHorizontal size={22} />
        <span>Ajustar</span>
      </button>

      {/* Stickers / Figurinhas */}
      <button className="capcut-bar-item" onClick={onOpenStickersModal}>
        <Smile size={22} />
        <span>Stickers</span>
      </button>

      {/* Plano de Fundo / Tela */}
      <button className="capcut-bar-item" onClick={onOpenCanvasModal}>
        <Palette size={22} />
        <span>Tela</span>
      </button>

      {/* Proporção */}
      <button className="capcut-bar-item" onClick={onOpenCanvasModal}>
        <Ratio size={22} />
        <span>Proporção</span>
      </button>

      {/* OpenCut Scripting & Automation API */}
      <button className="capcut-bar-item pro-item" onClick={onOpenScriptingModal} title="OpenCut Scripting & Editor API Console">
        <div className="pro-corner-badge" style={{ background: 'linear-gradient(135deg, #00f2fe, #4facfe)', color: '#000' }}>API</div>
        <Terminal size={22} className="icon-cyan" />
        <span>Scripting</span>
      </button>
    </div>
  );
};
