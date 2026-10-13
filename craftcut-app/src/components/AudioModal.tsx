import React, { useState, useRef } from 'react';
import { 
  X, 
  Volume2, 
  Mic, 
  Sparkles, 
  ShieldCheck, 
  Radio, 
  Square, 
  Check 
} from 'lucide-react';
import type { MediaClip } from '../types/editor';

interface AudioModalProps {
  clip: MediaClip | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateClipVolume: (volume: number) => void;
  onToggleVocalIsolation: () => void;
  onToggleNoiseReduction: () => void;
  onAddRecordedAudio: (audioBlobUrl: string, duration: number) => void;
}

export const AudioModal: React.FC<AudioModalProps> = ({
  clip,
  isOpen,
  onClose,
  onUpdateClipVolume,
  onToggleVocalIsolation,
  onToggleNoiseReduction,
  onAddRecordedAudio,
}) => {
  const [activeTab, setActiveTab] = useState<'volume' | 'effects' | 'record'>('volume');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [selectedVoiceEffect, setSelectedVoiceEffect] = useState<string>('normal');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  if (!isOpen) return null;

  const currentVolumePercent = clip ? Math.round(clip.volume * 100) : 100;

  // Real Microphone Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Permissão de microfone negada ou indisponível.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const handleSaveRecording = () => {
    if (recordedUrl) {
      onAddRecordedAudio(recordedUrl, Math.max(1, recordingSeconds));
      onClose();
    }
  };

  const voiceEffects = [
    { id: 'normal', name: 'Original', icon: '🎙️' },
    { id: 'chipmunk', name: 'Esquilo / Agudo', icon: '🐿️' },
    { id: 'deep', name: 'Voz Grave / Monstro', icon: '👹' },
    { id: 'echo', name: 'Eco Espacial', icon: '📢' },
    { id: 'robot', name: 'Robô Sintetizador', icon: '🤖' },
    { id: 'megaphone', name: 'Megafone', icon: '📣' },
  ];

  return (
    <div className="modal-backdrop">
      <div className="modal-content capcut-audio-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="pro-title-line">
            <Volume2 size={22} className="icon-cyan" />
            <h3 style={{ fontSize: '1.15rem' }}>Estúdio de Áudio</h3>
            <span className="unlocked-badge">PRO DESBLOQUEADO</span>
          </div>
          <button className="capcut-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Audio Sub-Tabs */}
        <div className="capcut-effects-tabs">
          <button
            className={`effects-tab ${activeTab === 'volume' ? 'active' : ''}`}
            onClick={() => setActiveTab('volume')}
          >
            <Volume2 size={15} />
            <span>Volume & Ajustes</span>
          </button>
          <button
            className={`effects-tab ${activeTab === 'effects' ? 'active' : ''}`}
            onClick={() => setActiveTab('effects')}
          >
            <Sparkles size={15} />
            <span>Efeitos de Voz</span>
          </button>
          <button
            className={`effects-tab ${activeTab === 'record' ? 'active' : ''}`}
            onClick={() => setActiveTab('record')}
          >
            <Mic size={15} />
            <span>Gravar Voz</span>
          </button>
        </div>

        {/* Tab 1: Volume */}
        {activeTab === 'volume' && (
          <div className="audio-tab-content">
            <div className="audio-volume-display">
              <span className="volume-val">{currentVolumePercent}%</span>
              <span className="volume-sub">
                {currentVolumePercent > 100 ? 'Amplificação Dinâmica Ativa' : 'Volume Padrão'}
              </span>
            </div>

            <div className="slider-item" style={{ marginTop: '1rem' }}>
              <div className="slider-label">
                <span>Controle de Ganho (0% a 1000%)</span>
                <span className="slider-val">{currentVolumePercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.05"
                value={clip ? clip.volume : 1}
                onChange={(e) => onUpdateClipVolume(Number(e.target.value))}
              />
            </div>

            {/* PRO Audio Toggles */}
            <div className="pro-audio-toggles-grid" style={{ marginTop: '1.25rem' }}>
              <div
                className={`pro-audio-card ${clip?.pro.noiseReduction ? 'active' : ''}`}
                onClick={onToggleNoiseReduction}
              >
                <div className="card-top">
                  <ShieldCheck size={18} className="icon-gold" />
                  <span className="pro-corner-badge">PRO</span>
                </div>
                <h4>Reduzir Ruído (Denoise)</h4>
                <p>Elimina chiado e ruído ambiente</p>
                <span className="status-tag">{clip?.pro.noiseReduction ? 'ATIVO' : 'DESATIVADO'}</span>
              </div>

              <div
                className={`pro-audio-card ${clip?.pro.vocalIsolation ? 'active' : ''}`}
                onClick={onToggleVocalIsolation}
              >
                <div className="card-top">
                  <Radio size={18} className="icon-gold" />
                  <span className="pro-corner-badge">PRO</span>
                </div>
                <h4>Isolamento Vocal IA</h4>
                <p>Separa os vocais da música</p>
                <span className="status-tag">{clip?.pro.vocalIsolation ? 'ATIVO' : 'DESATIVADO'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Voice Effects */}
        {activeTab === 'effects' && (
          <div className="audio-tab-content">
            <p style={{ fontSize: '0.75rem', color: '#a1a1aa', marginBottom: '12px' }}>
              Modifique a voz da sua trilha com modulação de frequência em tempo real:
            </p>
            <div className="effects-grid-container">
              {voiceEffects.map((eff) => (
                <div
                  key={eff.id}
                  className={`effect-card-item ${selectedVoiceEffect === eff.id ? 'selected' : ''}`}
                  onClick={() => setSelectedVoiceEffect(eff.id)}
                >
                  <div className="effect-icon-circle">
                    <span className="effect-emoji">{eff.icon}</span>
                    <span className="pro-corner-badge">PRO</span>
                  </div>
                  <span className="effect-name-label">{eff.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Record Voiceover */}
        {activeTab === 'record' && (
          <div className="audio-tab-content record-center">
            <div className="record-timer-display">
              <span className="record-time-text">
                00:{String(recordingSeconds).padStart(2, '0')}
              </span>
              <span className="record-state-sub">
                {isRecording ? 'Gravando do microfone...' : recordedUrl ? 'Gravação concluída!' : 'Toque para gravar'}
              </span>
            </div>

            <div className="record-button-wrapper">
              {!isRecording ? (
                <button className="record-big-btn" onClick={startRecording}>
                  <Mic size={32} />
                </button>
              ) : (
                <button className="record-big-btn recording" onClick={stopRecording}>
                  <Square size={28} />
                </button>
              )}
            </div>

            {recordedUrl && (
              <div className="recording-actions" style={{ marginTop: '1.25rem' }}>
                <button className="capcut-primary-btn" onClick={handleSaveRecording}>
                  <Check size={16} />
                  <span>Inserir na Linha do Tempo</span>
                </button>
              </div>
            )}
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
