# Relatório de Engenharia Reversa: CapCut Mobile (Android)
**Alvo:** `cc_website_download.apk`  
**Nome do Pacote:** `com.lemon.lvoverseas` (Lemon Inc. / ByteDance)  
**Versão:** `13.6.0` (Build code correspondente ao release global)  
**Tamanho do APK:** ~320 MB (27.633 arquivos compactados)  
**Ferramentas Utilizadas:** REA (Reverse Engineer Anything), Inspeção de Recursos e Bytecode Android.

---

## 1. Visão Geral e Identificação

A análise estática e extração do pacote revelou que o arquivo `cc_website_download.apk` é o aplicativo oficial do **CapCut** (conhecido internacionalmente como CapCut e no mercado chinês como JianYing / 剪映).

- **Total de Arquivos DEX:** 24 arquivos de bytecode (`classes.dex` até `classes24.dex`), além de DEXes secundários em assets (`audience_network.dex`).
- **Bibliotecas Nativas (`.so`):** 147 bibliotecas compiladas para arquiteturas `arm64-v8a` e `armeabi-v7a`.
- **Proteção/Ofuscação:** O aplicativo utiliza **AndResGuard / AabResGuard** para ofuscar nomes de recursos (diretórios como `r/a2/`, `r/aa/`, `r/ai/`), além de ProGuard/R8 agressivo nas classes Java/Kotlin e ofuscação de strings nativas.

---

## 2. Arquitetura do Núcleo de Edição de Vídeo

O CapCut é construído em torno de uma arquitetura híbrida de alto desempenho:

### A. Motor Gráfico e de Renderização (Graphics & Video Engine)
- **`libAGFX.so` / `libbytevc1enc.so` / `libByteVC1_dec.so`**: Motor proprietário da ByteDance para codificação e decodificação acelerada por hardware de vídeo H.264 e ByteVC1 (H.265/HEVC).
- **Shader Pipeline**: Renderização multi-camadas em OpenGL ES 3.0+ e Vulkan, permitindo blend modes, chroma key, máscaras e filtros em tempo real.
- **Transições e Shaders**: Estruturas de shaders modulares para transições (`assets/splitscreen/`, `DarkMask.zip`, `ManualReshape.zip`).

### B. Motor de Áudio
- **`libaudioeffect.so`**: Processamento de áudio digital, pitch-shifting, equalização, redução de ruído, geração de formas de onda e efeitos de voz.

### C. Inteligência Artificial e Reconhecimento
- **`libByteAIDT.so` / `libByteAINN.so`**: Motores de redes neurais on-device para:
  - Smart Cutout (remoção automática de fundo de pessoas sem tela verde).
  - Face Tracking e retoque facial (`assets/algorithm/face_detect_cache.json`).
  - Auto-captions / Transcript Edit (`assets/transcriptedit/`).
  - Auto-reframe / Smart Crop (`assets/smart_crop/v1/algorithmConfig.json` e `v2`).

---

## 3. Principais Módulos de Interface (UI/UX)

A análise do manifesto e das activities identificou os pilares centrais da experiência do usuário:

1. **Workspace & Timeline Multi-Pistas (Timeline Engine):**
   - Faixa principal de vídeo com thumbnails gerados sob demanda.
   - Pistas secundárias para Picture-in-Picture (PIP) / Sobreposição.
   - Pista de áudio com visualizador de amplitude (waveform) e corte independente.
   - Pistas de texto e legendas animadas (Text animations & Lottie overlays).
   - Marcadores de batida musical (Beat detection).

2. **Ferramentas de Transformação e Corte (Transform & Cut):**
   - **Split (Dividir):** Corte instantâneo no playhead.
   - **Speed / Curva de Velocidade:** Ajuste dinâmico de velocidade (0.1x a 100x com interpolação de quadros suaves).
   - **Crop / Aspect Ratio:** Alternância rápida entre formatos comuns (9:16 vertical, 16:9 widescreen, 1:1 quadrado, 4:5 social).
   - **Filtros e Ajustes:** Matriz de cor para brilho, contraste, saturação, temperatura, vinheta, granulação e LUTs.

3. **Exportação & Render Pipeline:**
   - Renderização assíncrona com suporte a 720p, 1080p, 2K/4K e taxas de 24, 30, 50 e 60 FPS.

---

## 4. Estratégia de Recriação Open Source: "CraftCut"

Para o projeto open source **CraftCut** com suporte nativo para **Web** e **Android**, a arquitetura adotada consiste em:

- **Frontend & Editor Web/Mobile:** React + TypeScript + Vite, estilizado com design system escuro elegante, interfaces com feedback tátil e aceleração por hardware.
- **Suporte Nativo Android:** Integração com **Capacitor**, empacotando o editor em um aplicativo Android nativo completo com acesso ao sistema de arquivos do dispositivo, compartilhamento e câmera.
- **Motor de Renderização:** HTML5 Canvas 2D + Web Audio API + WebCodecs / MediaRecorder para renderização, mixagem e exportação direta sem necessidade de servidor externo.
- **Timeline Interativa:** Timeline multi-faixas com suporte a arrastar, aparar (trimming com in/out points), corte com tecla de atalho (`S` ou botão Dividir), controle de velocidade, filtros CSS/Canvas em tempo real e overlays de texto.
