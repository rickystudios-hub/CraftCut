# 🗺️ CraftCut Project Roadmap

This roadmap outlines key milestones and future development goals for CraftCut.

---

## 🎯 Phase 1: Core 1:1 Engine & Free PRO Unlocks (Completed ✅)
- [x] Reverse engineering and analysis of `cc_website_download.apk`
- [x] 1:1 CapCut Mobile UI recreation (pitch black `#000000`, 9:16 vertical canvas, top header, bottom dual-level toolbar)
- [x] Signature CapCut timeline with double-dot pill drag handles (`handle-left`, `handle-right`)
- [x] Unlocked PRO features: Smart Cutout, Auto Captions, Vocal Isolation, Audio Denoise, Optical Flow 60fps, 4K export
- [x] Full modal suite: Audio Studio with live microphone recording, Video/Body/Photo Effects, Chroma Key with picker, Masks, Animations, Canvas & Blur, Stickers & Badges
- [x] Web & Android (Capacitor) unified codebase

---

## 🚀 Phase 2: WebAssembly & Accelerated AI (In Progress 🔄)
- [ ] On-device Whisper tiny.wasm for multi-language offline auto-captions
- [ ] Mediapipe/ONNX WebGL background segmentation model execution in web worker
- [ ] Multi-clip Picture-in-Picture (PIP) layering with custom blend modes

---

## 🌟 Phase 3: Android Release & Ecosystem (Upcoming 📅)
- [ ] Continuous integration APK release builds via GitHub Actions
- [ ] Pre-packaged `.apk` downloads on GitHub Releases
- [ ] Community template presets and sound library integrations
