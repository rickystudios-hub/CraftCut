import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  ChevronDown, 
  Upload
} from 'lucide-react';
import type { AspectRatio } from '../types/editor';

interface HeaderProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  onOpenExport: () => void;
  onOpenProModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projectName,
  onProjectNameChange,
  aspectRatio,
  onAspectRatioChange,
  onOpenExport,
  onOpenProModal,
}) => {
  const [showResDropdown, setShowResDropdown] = useState(false);
  const [currentRes, setCurrentRes] = useState<'720P' | '1080P' | '2K/4K'>('1080P');
  const [currentFps, setCurrentFps] = useState<30 | 60>(60);

  return (
    <header className="capcut-header">
      {/* Left: Close icon & Project Name */}
      <div className="capcut-header-left">
        <button 
          className="capcut-icon-btn close-btn" 
          title="Fechar projeto"
          onClick={() => {}}
        >
          <X size={20} />
        </button>

        <div className="capcut-title-container">
          <input
            type="text"
            className="capcut-project-name"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            title="Nome do projeto"
          />
        </div>
      </div>

      {/* Center: Shiny PRO UNLOCKED badge & Resolution Pill */}
      <div className="capcut-header-center">
        {/* PRO Badge Unlocked */}
        <button 
          className="capcut-pro-pill" 
          onClick={onOpenProModal}
          title="Funções PRO 100% Desbloqueadas e Grátis"
        >
          <div className="crown-glow">
            <Crown size={14} className="crown-icon" />
          </div>
          <span className="pro-pill-text">PRO DESBLOQUEADO</span>
          <span className="pro-free-badge">GRÁTIS</span>
        </button>

        {/* Resolution Dropdown Pill */}
        <div className="res-pill-wrapper">
          <button 
            className="capcut-res-pill" 
            onClick={() => setShowResDropdown(!showResDropdown)}
            title="Resolução e Taxa de Quadros"
          >
            <span>{currentRes}</span>
            <ChevronDown size={14} />
          </button>

          {showResDropdown && (
            <div className="res-dropdown-menu">
              <div className="res-dropdown-header">
                <span>Configuração de Saída</span>
                <span className="pro-tag-sm">PRO GRÁTIS</span>
              </div>
              <div className="res-options">
                <div className="res-section-title">Resolução</div>
                <div className="res-buttons-row">
                  {(['720P', '1080P', '2K/4K'] as const).map((r) => (
                    <button
                      key={r}
                      className={`res-btn ${currentRes === r ? 'active' : ''}`}
                      onClick={() => setCurrentRes(r)}
                    >
                      {r} {r === '2K/4K' && '👑'}
                    </button>
                  ))}
                </div>

                <div className="res-section-title" style={{ marginTop: '10px' }}>Taxa de Quadros</div>
                <div className="res-buttons-row">
                  {([24, 30, 50, 60] as const).map((f) => (
                    <button
                      key={f}
                      className={`res-btn ${currentFps === f ? 'active' : ''}`}
                      onClick={() => setCurrentFps(f as 30 | 60)}
                    >
                      {f} fps {f === 60 && '👑'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Aspect Ratio & Export Button */}
      <div className="capcut-header-right">
        {/* Aspect Ratio Quick Toggle */}
        <div className="aspect-quick-pill" title="Proporção da tela">
          {(['9:16', '16:9', '1:1'] as const).map((ratio) => (
            <button
              key={ratio}
              className={`aspect-tab ${aspectRatio === ratio ? 'active' : ''}`}
              onClick={() => onAspectRatioChange(ratio)}
            >
              {ratio}
            </button>
          ))}
        </div>

        {/* CapCut's Iconic Export Button */}
        <button 
          className="capcut-export-btn" 
          onClick={onOpenExport}
          title="Exportar vídeo (Sem marca d'água)"
        >
          <Upload size={16} className="export-icon" />
          <span>Exportar</span>
        </button>
      </div>
    </header>
  );
};
