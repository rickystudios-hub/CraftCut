import React, { useState } from 'react';
import { X, Terminal, Play, RotateCcw, Copy, Check, Sparkles } from 'lucide-react';
import type { ProjectState } from '../types/editor';

interface ScriptingModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectState;
  onExecuteScript: (code: string) => { success: boolean; message: string };
  onApplyPresetScript: (presetId: string) => void;
}

export const ScriptingModal: React.FC<ScriptingModalProps> = ({
  isOpen,
  onClose,
  onExecuteScript,
  onApplyPresetScript,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'console'>('presets');
  const [code, setCode] = useState<string>(
`// OpenCut-compatible CraftCut Scripting API
// Available: editor.getClips(), editor.splitAt(time), editor.addText(text), editor.setFilter(clipId, filters)

const clips = editor.getClips();
console.log('Total de clipes na timeline:', clips.length);

// Exemplo: Ativar 4K HDR e aumentar contraste em todos os clipes
clips.forEach(clip => {
  editor.setFilter(clip.id, { contrast: 115, saturation: 120 });
});

editor.notify('Script executado com sucesso!');`
  );
  const [logs, setLogs] = useState<string[]>(['[OpenCut Engine] Editor API inicializada e pronta.']);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const presets = [
    {
      id: 'tiktok_viral',
      name: '📱 Otimizador Viral TikTok/Reels',
      desc: 'Formata em 9:16 vertical, escala sutil para preencher tela e aplica filtro de alta vivacidade.',
      badge: 'VIRAL',
      color: '#ec4899',
    },
    {
      id: 'cinematic_teal_orange',
      name: '🎬 Cinematic Teal & Orange',
      desc: 'Aplica grading de cores de Hollywood, máscara de película e contraste balanceado.',
      badge: 'CINEMA',
      color: '#00f2fe',
    },
    {
      id: 'podcast_audio_clean',
      name: '🎙️ Estúdio de Podcast (Denoise + Isolar Voz)',
      desc: 'Ativa isolamento vocal e supressão de ruído IA em todas as faixas de áudio.',
      badge: 'ÁUDIO PRO',
      color: '#10b981',
    },
    {
      id: 'auto_jump_cut',
      name: '⚡ Dynamic Beat Cut (Cortes Rápidos)',
      desc: 'Divide o clipe selecionado em segmentos dinâmicos de 1.5s para dinamismo de retenção.',
      badge: 'RITMO',
      color: '#f59e0b',
    },
    {
      id: 'add_cta_stickers',
      name: '🔔 Inserir CTA & Stickers de Inscrição',
      desc: 'Adiciona figurinhas de like e inscrição com animação bounce no terço final.',
      badge: 'ENGAJAMENTO',
      color: '#8b5cf6',
    },
  ];

  const handleRunCode = () => {
    try {
      setLogs((prev) => [...prev, `> Executando script customizado...`]);
      const result = onExecuteScript(code);
      if (result.success) {
        setLogs((prev) => [...prev, `[Sucesso] ${result.message}`]);
      } else {
        setLogs((prev) => [...prev, `[Erro] ${result.message}`]);
      }
    } catch (err: any) {
      setLogs((prev) => [...prev, `[Erro de Execução] ${err.message || String(err)}`]);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content capcut-scripting-modal" style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="modal-header">
          <div className="pro-title-line">
            <Terminal size={22} className="icon-cyan" />
            <h3 style={{ fontSize: '1.15rem' }}>OpenCut Scripting & Editor API</h3>
            <span style={{
              fontSize: '0.65rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: 'bold',
              marginLeft: '6px'
            }}>
              v2.0
            </span>
          </div>
          <button className="capcut-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="capcut-effects-tabs">
          <button
            className={`effects-tab ${activeTab === 'presets' ? 'active' : ''}`}
            onClick={() => setActiveTab('presets')}
          >
            <Sparkles size={15} />
            <span>Scripts Prontos (1-Clique)</span>
          </button>
          <button
            className={`effects-tab ${activeTab === 'console' ? 'active' : ''}`}
            onClick={() => setActiveTab('console')}
          >
            <Terminal size={15} />
            <span>Console & Código</span>
          </button>
        </div>

        {/* Tab 1: Presets */}
        {activeTab === 'presets' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px 0', maxHeight: '340px', overflowY: 'auto' }}>
            {presets.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: '#13161c',
                  border: '1px solid #252a36'
                }}
              >
                <div style={{ flex: 1, paddingRight: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff' }}>{p.name}</span>
                    <span style={{
                      fontSize: '0.62rem',
                      fontWeight: 'bold',
                      color: p.color,
                      border: `1px solid ${p.color}`,
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}>
                      {p.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: 0 }}>{p.desc}</p>
                </div>

                <button
                  onClick={() => {
                    onApplyPresetScript(p.id);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
                    border: 'none',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Play size={13} fill="#000" />
                  Executar
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Console / Code Editor */}
        {activeTab === 'console' && (
          <div style={{ padding: '12px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: '#8b949e', fontFamily: 'monospace' }}>JavaScript Editor API</span>
              <button
                onClick={handleCopyCode}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8b949e',
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{
                width: '100%',
                height: '140px',
                background: '#0d1117',
                color: '#58a6ff',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                fontSize: '0.78rem',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #30363d',
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />

            {/* Run Button */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button
                onClick={handleRunCode}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                <Play size={15} fill="#fff" />
                Executar Script
              </button>

              <button
                onClick={() => setLogs(['[OpenCut Engine] Logs limpos.'])}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: '#161b22',
                  border: '1px solid #30363d',
                  color: '#8b949e',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Limpar logs"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            {/* Output Logs */}
            <div style={{
              marginTop: '12px',
              padding: '8px 10px',
              borderRadius: '6px',
              background: '#080a0f',
              border: '1px solid #1c2128',
              maxHeight: '80px',
              overflowY: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              color: '#7ee787'
            }}>
              {logs.map((log, index) => (
                <div key={index} style={{ marginBottom: '2px' }}>{log}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
