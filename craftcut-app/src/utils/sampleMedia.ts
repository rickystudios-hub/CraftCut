import type { Track } from '../types/editor';

// Create a procedural video blob using HTML5 Canvas & MediaRecorder
export function createProceduralVideo(
  title: string,
  gradientStart: string,
  gradientEnd: string,
  durationSec: number = 5
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 1280; // 9:16 vertical
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve('');
      return;
    }

    const stream = canvas.captureStream(30);
    let mediaRecorder: MediaRecorder;
    try {
      mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    } catch {
      // fallback
      try {
        mediaRecorder = new MediaRecorder(stream);
      } catch {
        resolve('');
        return;
      }
    }

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(URL.createObjectURL(blob));
    };

    mediaRecorder.start();

    const fps = 30;
    const totalFrames = durationSec * fps;
    let frame = 0;

    const interval = setInterval(() => {
      if (frame >= totalFrames) {
        clearInterval(interval);
        mediaRecorder.stop();
        return;
      }

      const progress = frame / totalFrames;
      
      // Background gradient animation
      const grad = ctx.createLinearGradient(0, 0, 720, 1280);
      grad.addColorStop(0, gradientStart);
      grad.addColorStop(1, gradientEnd);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 720, 1280);

      // Animated glowing shapes
      ctx.save();
      ctx.translate(360, 640);
      ctx.rotate((progress * Math.PI * 2) * 0.5);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 8;
      ctx.beginPath();
      const radius = 180 + Math.sin(progress * Math.PI * 4) * 30;
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Floating particles
      for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2 + progress * Math.PI * 2;
        const dist = 240 + Math.sin(progress * 5 + i) * 40;
        const px = Math.cos(angle) * dist;
        const py = Math.sin(angle) * dist;
        ctx.fillStyle = '#00f2fe';
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Title Card
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 52px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 16;
      ctx.fillText(title, 360, 580);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '24px system-ui, -apple-system, sans-serif';
      ctx.fillText(`CraftCut Sample #${frame}`, 360, 650);

      // Timecode
      const curSec = (frame / fps).toFixed(2);
      ctx.fillStyle = '#00f2fe';
      ctx.font = 'bold 28px monospace';
      ctx.fillText(`00:0${curSec}s`, 360, 720);

      frame++;
    }, 1000 / fps);
  });
}

// Generate default initial project with ready-to-test clips
export function createDefaultTracks(): Track[] {
  return [
    {
      id: 'track-video-1',
      type: 'video',
      name: 'Vídeo Principal',
      isMuted: false,
      isLocked: false,
      clips: [
        {
          id: 'clip-1',
          type: 'video',
          name: 'Cyberpunk Intro',
          start: 0,
          duration: 4.5,
          offset: 0,
          sourceDuration: 4.5,
          sourceUrl: '', // generated on load or procedural
          volume: 1,
          speed: 1,
          isMuted: false,
          color: '#2563eb',
          mask: 'none',
          animation: 'fade',
          pro: {
            backgroundRemoved: false,
            chromaKeyEnabled: false,
            chromaColor: '#00ff00',
            vocalIsolation: false,
            noiseReduction: true,
            stabilization: true,
            smoothSlowMotion: false,
            antiFlicker: false,
            aiUpscaling: true,
            faceRetouch: false,
          },
          filters: {
            brightness: 105,
            contrast: 110,
            saturation: 120,
            blur: 0,
            grayscale: 0,
            sepia: 0,
            hueRotate: 0,
            vignette: 15,
            temperature: 5,
            sharpness: 20,
          },
          transform: {
            scale: 1,
            rotation: 0,
            flipHorizontal: false,
            x: 0,
            y: 0,
          },
        },
        {
          id: 'clip-2',
          type: 'video',
          name: 'Neon Sunset',
          start: 4.5,
          duration: 5.0,
          offset: 0,
          sourceDuration: 5.0,
          sourceUrl: '',
          volume: 1,
          speed: 1,
          isMuted: false,
          color: '#db2777',
          mask: 'none',
          animation: 'zoom',
          pro: {
            backgroundRemoved: false,
            chromaKeyEnabled: false,
            chromaColor: '#00ff00',
            vocalIsolation: true,
            noiseReduction: true,
            stabilization: false,
            smoothSlowMotion: true,
            antiFlicker: false,
            aiUpscaling: true,
            faceRetouch: true,
          },
          filters: {
            brightness: 100,
            contrast: 105,
            saturation: 135,
            blur: 0,
            grayscale: 0,
            sepia: 15,
            hueRotate: 20,
            vignette: 25,
            temperature: 10,
            sharpness: 10,
          },
          transform: {
            scale: 1,
            rotation: 0,
            flipHorizontal: false,
            x: 0,
            y: 0,
          },
        },
      ],
    },
    {
      id: 'track-text-1',
      type: 'text',
      name: 'Legendas / Texto',
      isMuted: false,
      isLocked: false,
      clips: [
        {
          id: 'clip-text-1',
          type: 'text',
          name: 'Título Estilizado',
          start: 0.5,
          duration: 3.5,
          offset: 0,
          sourceDuration: 3.5,
          sourceUrl: '',
          volume: 1,
          speed: 1,
          isMuted: false,
          color: '#eab308',
          mask: 'none',
          animation: 'fade',
          pro: {
            backgroundRemoved: false,
            chromaKeyEnabled: false,
            chromaColor: '#00ff00',
            vocalIsolation: false,
            noiseReduction: false,
            stabilization: false,
            smoothSlowMotion: false,
            antiFlicker: false,
            aiUpscaling: false,
            faceRetouch: false,
          },
          filters: {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            blur: 0,
            grayscale: 0,
            sepia: 0,
            hueRotate: 0,
            vignette: 0,
            temperature: 0,
            sharpness: 0,
          },
          transform: {
            scale: 1,
            rotation: 0,
            flipHorizontal: false,
            x: 0,
            y: 0,
          },
          textSettings: {
            text: 'CRAFTCUT STUDIO',
            color: '#00f2fe',
            fontSize: 38,
            fontFamily: 'Inter, system-ui, sans-serif',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            isBold: true,
            isItalic: false,
            x: 50,
            y: 78,
          },
        },
        {
          id: 'clip-text-2',
          type: 'text',
          name: 'Chamada Final',
          start: 5.2,
          duration: 3.8,
          offset: 0,
          sourceDuration: 3.8,
          sourceUrl: '',
          volume: 1,
          speed: 1,
          isMuted: false,
          color: '#eab308',
          mask: 'none',
          animation: 'glitch',
          pro: {
            backgroundRemoved: false,
            chromaKeyEnabled: false,
            chromaColor: '#00ff00',
            vocalIsolation: false,
            noiseReduction: false,
            stabilization: false,
            smoothSlowMotion: false,
            antiFlicker: false,
            aiUpscaling: false,
            faceRetouch: false,
          },
          filters: {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            blur: 0,
            grayscale: 0,
            sepia: 0,
            hueRotate: 0,
            vignette: 0,
            temperature: 0,
            sharpness: 0,
          },
          transform: {
            scale: 1,
            rotation: 0,
            flipHorizontal: false,
            x: 0,
            y: 0,
          },
          textSettings: {
            text: 'EDITE COM PRECISÃO ⚡',
            color: '#ffffff',
            fontSize: 32,
            fontFamily: 'Inter, system-ui, sans-serif',
            backgroundColor: 'rgba(124, 77, 255, 0.7)',
            isBold: true,
            isItalic: false,
            x: 50,
            y: 82,
          },
        },
      ],
    },
    {
      id: 'track-audio-1',
      type: 'audio',
      name: 'Trilha Sonora',
      isMuted: false,
      isLocked: false,
      clips: [
        {
          id: 'clip-audio-1',
          type: 'audio',
          name: 'Lo-Fi Chill Beat',
          start: 0,
          duration: 9.5,
          offset: 0,
          sourceDuration: 9.5,
          sourceUrl: '',
          volume: 0.8,
          speed: 1,
          isMuted: false,
          color: '#10b981',
          mask: 'none',
          animation: 'none',
          pro: {
            backgroundRemoved: false,
            chromaKeyEnabled: false,
            chromaColor: '#00ff00',
            vocalIsolation: true,
            noiseReduction: true,
            stabilization: false,
            smoothSlowMotion: false,
            antiFlicker: false,
            aiUpscaling: false,
            faceRetouch: false,
          },
          filters: {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            blur: 0,
            grayscale: 0,
            sepia: 0,
            hueRotate: 0,
            vignette: 0,
            temperature: 0,
            sharpness: 0,
          },
          transform: {
            scale: 1,
            rotation: 0,
            flipHorizontal: false,
            x: 0,
            y: 0,
          },
        },
      ],
    },
  ];
}
