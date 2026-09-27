"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, Move } from "lucide-react";

export interface IDCardLanyardProps {
  /** Full name shown on the card and used for the back-face signature. */
  name?: string;
  /** Job title / role line under the name. */
  role?: string;
  /** Wordmark shown top-left on the front face. */
  brand?: string;
  /** Small caption under the wordmark. */
  brandTagline?: string;
  /** Three short values stacked top-right (e.g. your working pillars). */
  pillars?: [string, string, string];
  location?: string;
  idNumber?: string;
  validThru?: string;
  /** URL/label shown next to the back-face QR code. */
  site?: string;
  /** Photo URL of the cardholder (replaces placeholder vector). */
  photoUrl?: string;
  /** Social links shown as small icon buttons on the back face. Omit any you don't want rendered. */
  githubUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  /** When true, confines the lanyard exclusively to its parent container (e.g. About section). Defaults to true. */
  contained?: boolean;
  /** Horizontal anchor for the lanyard clip: a percentage ("50%"), a px value ("120px"), or "calc(100% - 130px)" to anchor from the right edge. */
  anchorX?: string;
  /** Vertical anchor offset in px from the top of the viewport. */
  anchorY?: number;
  /** Stacking order of the overlay. */
  zIndex?: number;
  /** Show the "drag to swing" hint until the visitor first interacts with the card. */
  showHint?: boolean;
  className?: string;
}

const CSS = `
.idcl-root{
  --idcl-ink-faint:#5b6270;
  --idcl-accent:#D52A2F;
  --idcl-accent-dim:#8F1118;
  --idcl-card:#FAF8F5;
  --idcl-card-2:#EAE5D9;
  --idcl-card-ink:#0A0A0A;
  --idcl-card-soft:#555A64;
  --idcl-card-line:#DDD6C4;
  --idcl-font-display:'Archivo','Arial Narrow',sans-serif;
  --idcl-font-mono:'JetBrains Mono','Consolas',monospace;
  --idcl-font-script:'Caveat',cursive;
  font-family:'Work Sans',system-ui,sans-serif;
}
.idcl-root *{ box-sizing:border-box; }

/* default full-viewport overlay */
.idcl-stage{
  position:fixed;
  inset:0;
  z-index:var(--idcl-z, 60);
  pointer-events:none;
  overflow:visible;
}

/* section-contained mode: strictly constrained to parent section (e.g. #about only) */
.idcl-root.is-contained,
.idcl-stage.is-contained{
  position:absolute;
  inset:0;
  z-index:var(--idcl-z, 30);
  pointer-events:none;
  overflow:hidden;
}

.idcl-hint.is-contained{
  position:absolute;
  top:24px;
  left:50%;
  transform:translateX(-50%);
}

.idcl-rope{ position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }

.idcl-rail{
  position:absolute; top:0; width:72px; height:7px;
  transform:translateX(-50%);
  background:linear-gradient(180deg, #3a0d10, #140203);
  border:1px solid rgba(213,42,47,0.4);
  border-top:none;
  border-radius:0 0 5px 5px;
  box-shadow:0 3px 10px rgba(0,0,0,.7), 0 0 12px rgba(213,42,47,.25);
  pointer-events:none;
}

.idcl-card{
  position:absolute;
  width:clamp(196px, 60vw, 236px);
  aspect-ratio: 236 / 460;
  perspective:1400px;
  cursor:grab; touch-action:none; user-select:none;
  transform-origin:top center;
  pointer-events:auto;
}
.idcl-card:active{ cursor:grabbing; }

.idcl-flipper{ position:relative; width:100%; height:100%; transform-style:preserve-3d; }

.idcl-face{
  position:absolute; inset:0; border-radius:18px;
  padding:16px 16px 14px;
  display:flex; flex-direction:column;
  backface-visibility:hidden;
  box-shadow:
    0 32px 60px -16px rgba(0,0,0,.85),
    0 10px 24px -8px rgba(0,0,0,.6),
    0 0 20px rgba(213,42,47,.15),
    inset 0 1px 0 rgba(255,255,255,.7),
    inset 0 0 0 1px rgba(0,0,0,.15);
}
.idcl-face::before{
  content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
  background:
    linear-gradient(180deg, rgba(255,255,255,.55) 0%, transparent 24%),
    radial-gradient(rgba(0,0,0,.07) 1px, transparent 1.3px) 0 0/3px 3px;
  mix-blend-mode:multiply; opacity:.6;
}
.idcl-face::after{
  content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
  background:radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,.6), transparent 40%);
  mix-blend-mode:overlay; opacity:0; transition:opacity .3s ease;
}
.idcl-card.idcl-hovering .idcl-face::after{ opacity:1; }
@media (prefers-reduced-motion: reduce){ .idcl-face::after{ transition:none; } }

.idcl-front{ background:linear-gradient(165deg, var(--idcl-card), var(--idcl-card-2)); align-items:stretch; text-align:left; }
.idcl-back{ background:linear-gradient(165deg, var(--idcl-card-2), var(--idcl-card)); transform:rotateY(180deg); }

.idcl-holo{
  position:absolute; top:14px; bottom:14px; right:5px; width:6px; border-radius:5px;
  background:repeating-linear-gradient(125deg, #fef1f2 0%, #d52a2f 15%, #ffb4b7 30%, #e8d0d1 45%, #d52a2f 60%);
  background-size:240% 240%;
  animation:idcl-foil 6s linear infinite;
  box-shadow:inset 0 0 0 1px rgba(0,0,0,.15), 0 0 8px rgba(213,42,47,.4);
}
@keyframes idcl-foil{ to{ background-position:240% 0%; } }
@media (prefers-reduced-motion: reduce){ .idcl-holo{ animation:none; } }

.idcl-hole{ width:32px; height:9px; background:var(--idcl-card-ink); border-radius:5px; margin:0 auto 10px; flex-shrink:0; opacity:.85; }

.idcl-header{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; }
.idcl-brand{ display:flex; align-items:flex-start; gap:6px; }
.idcl-brand-mark{ font-size:12px; color:var(--idcl-accent); line-height:1; margin-top:1px; }
.idcl-brand-text{ display:flex; flex-direction:column; }
.idcl-brand-text b{ font-family:var(--idcl-font-display); font-weight:800; font-size:11.5px; letter-spacing:.02em; color:var(--idcl-card-ink); line-height:1.2; }
.idcl-brand-text small{ font-family:var(--idcl-font-mono); font-size:6.3px; letter-spacing:.09em; text-transform:uppercase; color:var(--idcl-card-soft); }
.idcl-pillars{ display:flex; flex-direction:column; align-items:flex-end; gap:1px; }
.idcl-pillars span{ font-family:var(--idcl-font-mono); font-size:7px; letter-spacing:.1em; text-transform:uppercase; color:var(--idcl-card-soft); }
.idcl-pillars i{ width:16px; height:2px; background:var(--idcl-accent); margin-top:3px; }

.idcl-photo{
  position:relative; width:100%; height:116px; border-radius:10px;
  background:#14080a; overflow:hidden; margin-bottom:12px; flex-shrink:0;
  box-shadow:inset 0 0 0 1px rgba(0,0,0,.15), inset 0 2px 8px rgba(0,0,0,.25);
}
.idcl-photo img{ width:100%; height:100%; display:block; object-fit:cover; }
.idcl-verified{
  position:absolute; right:6px; bottom:6px; width:22px; height:22px; border-radius:50%;
  background:linear-gradient(160deg, var(--idcl-accent), var(--idcl-accent-dim));
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 2px 6px rgba(0,0,0,.45), 0 0 0 2.5px var(--idcl-card);
}
.idcl-verified svg{ width:12px; height:12px; }

.idcl-name{ margin:0 0 2px; font-family:var(--idcl-font-display); font-weight:800; font-size:18px; color:var(--idcl-card-ink); letter-spacing:-.01em; }
.idcl-role{ margin:0 0 10px; font-size:9.5px; color:var(--idcl-card-soft); font-weight:600; letter-spacing:.08em; text-transform:uppercase; }

.idcl-divider{ width:100%; height:1px; background:var(--idcl-card-line); margin-bottom:10px; }

.idcl-idrow{ width:100%; display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:16px; }
.idcl-idrow-labels{ display:flex; flex-direction:column; gap:5px; font-family:var(--idcl-font-mono); }
.idcl-idrow-labels div{ display:flex; gap:8px; align-items:baseline; }
.idcl-idrow-labels span{ width:56px; flex-shrink:0; font-size:7.6px; letter-spacing:.06em; text-transform:uppercase; color:var(--idcl-card-soft); }
.idcl-idrow-labels b{ font-size:9.5px; font-weight:600; color:var(--idcl-card-ink); }

.idcl-footer{
  width:100%; margin-top:12px; padding-top:10px; border-top:1px solid var(--idcl-card-line);
  text-align:center; font-family:var(--idcl-font-mono); font-size:8.5px; letter-spacing:.14em; text-transform:uppercase;
  color:var(--idcl-card-soft);
}
.idcl-footer i{ color:var(--idcl-accent); font-style:normal; margin:0 5px; }

.idcl-stripe{ width:100%; height:30px; background:repeating-linear-gradient(45deg, #1b0a0c, #1b0a0c 6px, #2d0e12 6px, #2d0e12 12px); border-radius:3px; margin-bottom:12px; }
.idcl-barcode{ display:flex; align-items:flex-end; gap:2px; height:32px; width:100%; background:#fff; border-radius:3px; padding:0 4px; margin-bottom:8px; overflow:hidden; }
.idcl-barcode span{ width:2px; background:#1a1c22; }
.idcl-idnum{ margin:0 0 8px; font-family:var(--idcl-font-mono); font-size:10px; font-weight:600; color:var(--idcl-card-ink); letter-spacing:.03em; display:flex; justify-content:space-between; font-variant-numeric: tabular-nums; }
.idcl-idnum em{ font-style:normal; color:var(--idcl-card-soft); }

.idcl-backrow{ display:flex; gap:12px; align-items:flex-start; margin-bottom:10px; }
.idcl-qr{ display:grid; grid-template-columns:repeat(9,1fr); gap:1px; width:58px; height:58px; background:#fff; padding:4px; border-radius:4px; flex-shrink:0; box-shadow:0 0 0 1px var(--idcl-card-line); }
.idcl-qr i{ background:transparent; }
.idcl-qr i.on{ background:#181a20; }
.idcl-qr.idcl-small{ width:46px; height:46px; padding:3px; }

.idcl-scan{ font-family:var(--idcl-font-mono); font-size:8.4px; color:var(--idcl-card-soft); line-height:1.5; padding-top:2px; text-align:left; }
.idcl-scan b{ color:var(--idcl-card-ink); display:block; font-size:9px; margin-bottom:2px; letter-spacing:.03em; }

.idcl-connect{ display:flex; align-items:center; justify-content:space-between; margin-top:14px; }
.idcl-connect span{ font-family:var(--idcl-font-mono); font-size:8px; letter-spacing:.1em; text-transform:uppercase; color:var(--idcl-card-soft); }
.idcl-connect-icons{ display:flex; gap:6px; }
.idcl-connect-icons a{
  width:24px; height:24px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  border:1px solid var(--idcl-card-line); color:var(--idcl-card-soft);
  transition:border-color .15s ease, color .15s ease, transform .15s ease;
}
.idcl-connect-icons a:hover{ border-color:var(--idcl-accent); color:var(--idcl-accent); transform:translateY(-1px); }
.idcl-connect-icons svg{ width:12px; height:12px; }

.idcl-sig{ margin-top:16px; }
.idcl-sig .idcl-script{ font-family:var(--idcl-font-script); font-size:26px; color:var(--idcl-card-ink); line-height:1; }
.idcl-sig small{ display:block; font-family:var(--idcl-font-mono); font-size:8px; letter-spacing:.08em; text-transform:uppercase; color:var(--idcl-card-soft); border-top:1px solid var(--idcl-card-line); margin-top:4px; padding-top:4px; }

.idcl-hint{
  position:fixed; top:18px; left:50%; transform:translateX(-50%);
  display:flex; align-items:center; gap:8px;
  background:rgba(16, 2, 4, 0.88);
  backdrop-filter:blur(8px);
  border:1px solid rgba(213, 42, 47, 0.35);
  box-shadow:0 8px 24px rgba(0,0,0,0.6), 0 0 18px rgba(213,42,47,0.25);
  color:#f2f0eb;
  padding:8px 16px;
  border-radius:999px;
  font-family:var(--idcl-font-mono);
  font-size:11px; letter-spacing:.04em;
  pointer-events:none;
  opacity:1;
  transition:opacity .4s ease;
  white-space:nowrap;
}
.idcl-hint.idcl-hint-hidden{ opacity:0; }
.idcl-hint svg{ width:13px; height:13px; color:#D52A2F; flex-shrink:0; }
`;

export function IDCardLanyard({
  name = "Deric Andrews",
  role = "Full-Stack Dev & AI Creator",
  brand = "DERIC ANDREWS",
  brandTagline = "Creative Technologist",
  pillars = ["Creative Code", "AI & Automation", "Real Impact"],
  location = "Linz, Austria",
  idNumber = "DA-2026-X08",
  validThru = "12/2029",
  site = "dericandrews.dev",
  photoUrl = "/images/about/starting.png",
  githubUrl = "https://github.com",
  linkedinUrl = "https://linkedin.com",
  instagramUrl = "https://instagram.com",
  contained = true,
  anchorX = "calc(100% - 130px)",
  anchorY = 6,
  zIndex = 30,
  showHint = true,
  className = "",
}: IDCardLanyardProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const flipperRef = useRef<HTMLDivElement>(null);
  const barcodeRef = useRef<HTMLDivElement>(null);
  const qrBackRef = useRef<HTMLDivElement>(null);
  const qrFrontRef = useRef<HTMLDivElement>(null);
  const [interacted, setInteracted] = useState(false);

  // load the display fonts once (safe to call from multiple instances)
  useEffect(() => {
    const id = "idcl-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Caveat:wght@600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    const rail = railRef.current;
    const card = cardRef.current;
    const flipper = flipperRef.current;
    const barcodeEl = barcodeRef.current;
    const qrBackEl = qrBackRef.current;
    const qrFrontEl = qrFrontRef.current;
    if (!scene || !canvas || !rail || !card || !flipper || !barcodeEl || !qrBackEl || !qrFrontEl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    barcodeEl.innerHTML = "";
    for (let i = 0; i < 30; i++) {
      const bar = document.createElement("span");
      bar.style.height = ((i * 37) % 100 > 40 ? 100 : 55) + "%";
      barcodeEl.appendChild(bar);
    }

    function buildQR(el: HTMLDivElement, seed: number) {
      el.innerHTML = "";
      const N = 9;
      const seedOn = new Set([
        0, 1, 2, 9, 10, 11, 18, 19, 20,
        6, 7, 8, 15, 16, 17, 24, 25, 26,
        54, 55, 56, 63, 64, 65, 72, 73, 74,
      ]);
      for (let i = 0; i < N * N; i++) {
        const cell = document.createElement("i");
        const pseudoRandom = (i * seed) % 97 < 46;
        if (seedOn.has(i) || pseudoRandom) cell.classList.add("on");
        el.appendChild(cell);
      }
    }
    buildQR(qrBackEl, 928371);
    buildQR(qrFrontEl, 574123);

    // anchor is a full-viewport point — resolve anchorX ("50%", "120px", or
    // "calc(100% - 130px)" to hang the card from the right edge) against the window
    function resolveAnchorX() {
      const rect = scene!.getBoundingClientRect();
      const v = anchorX.trim();
      const calcMatch = v.match(/^calc\(\s*100%\s*-\s*([\d.]+)px\s*\)$/);
      if (calcMatch) return rect.width - parseFloat(calcMatch[1]);
      if (v.endsWith("%")) return rect.width * (parseFloat(v) / 100);
      return parseFloat(v);
    }

    const anchor = { x: resolveAnchorX(), y: anchorY };

    const NUM_POINTS = 13;
    const REST_LENGTH = 140;
    const SEGMENT_LENGTH = REST_LENGTH / (NUM_POINTS - 1);
    const GRAVITY = 0.55;
    const FRICTION = 0.98;
    const CONSTRAINT_ITERATIONS = 6;
    const TAP_THRESHOLD = 6;
    const MAX_TILT = 9;

    type Pt = { x: number; y: number; oldx: number; oldy: number; pinned: boolean };
    const points: Pt[] = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      const y = anchor.y + i * SEGMENT_LENGTH;
      points.push({ x: anchor.x, y, oldx: anchor.x, oldy: y, pinned: i === 0 });
    }

    function resize() {
      const rect = scene!.getBoundingClientRect();
      canvas!.width = rect.width;
      canvas!.height = rect.height;
      anchor.x = resolveAnchorX();
      rail!.style.left = anchor.x + "px";
      rail!.style.top = anchor.y - 3 + "px";
      if (points.length > 0) {
        points[0].x = anchor.x;
        points[0].y = anchor.y;
      }
    }
    resize();

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(scene);

    let dragging = false;
    let flipped = false;
    let downPos = { x: anchor.x, y: anchor.y };
    let pointer = { x: anchor.x, y: anchor.y + REST_LENGTH };
    let lastPointer = { ...pointer };
    let velocity = { x: 0, y: 0 };

    let flipTarget = 0;
    let flipCurrent = 0;
    const tiltTarget = { x: 0, y: 0 };
    const tiltCurrent = { x: 0, y: 0 };
    let mouse = { x: -9999, y: -9999 };

    function getScenePos(e: PointerEvent) {
      const rect = scene!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function clampToScene(p: { x: number; y: number }) {
      const margin = 18;
      p.x = Math.max(margin, Math.min(canvas!.width - margin, p.x));
      p.y = Math.max(anchor.y + 20, Math.min(canvas!.height - 30, p.y));
      return p;
    }

    function updatePoints() {
      for (let i = 1; i < points.length; i++) {
        if (dragging && i === points.length - 1) continue;
        const p = points[i];
        const vx = (p.x - p.oldx) * FRICTION;
        const vy = (p.y - p.oldy) * FRICTION;
        p.oldx = p.x;
        p.oldy = p.y;
        p.x += vx;
        p.y += vy + GRAVITY;
      }
    }

    function applyConstraints() {
      points[0].x = anchor.x;
      points[0].y = anchor.y;
      if (dragging) {
        const last = points[points.length - 1];
        last.x = pointer.x;
        last.y = pointer.y;
      }
      for (let iter = 0; iter < CONSTRAINT_ITERATIONS; iter++) {
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
          const diff = (SEGMENT_LENGTH - dist) / dist;
          const offX = dx * diff * 0.5;
          const offY = dy * diff * 0.5;
          const p1Locked = p1.pinned;
          const p2Locked = dragging && i + 1 === points.length - 1;
          if (!p1Locked) {
            p1.x -= offX;
            p1.y -= offY;
          }
          if (!p2Locked) {
            p2.x += offX;
            p2.y += offY;
          }
        }
      }
      for (let i = 1; i < points.length; i++) clampToScene(points[i]);
    }

    function drawRope() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const path: { x: number; y: number; cx?: number; cy?: number }[] = [];
      path.push({ x: points[0].x, y: points[0].y });
      for (let i = 1; i < points.length - 1; i++) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        const midY = (points[i].y + points[i + 1].y) / 2;
        path.push({ x: points[i].x, y: points[i].y, cx: midX, cy: midY });
      }
      path.push({ x: points[points.length - 1].x, y: points[points.length - 1].y });

      function strokeRibbon(style: string | CanvasGradient, width: number) {
        ctx!.beginPath();
        ctx!.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
          const p = path[i];
          if (p.cx !== undefined) ctx!.quadraticCurveTo(p.x, p.y, p.cx, p.cy as number);
          else ctx!.lineTo(p.x, p.y);
        }
        ctx!.strokeStyle = style;
        ctx!.lineWidth = width;
        ctx!.lineCap = "round";
        ctx!.lineJoin = "round";
        ctx!.stroke();
      }

      // Drop shadow
      ctx!.save();
      ctx!.translate(2, 4);
      ctx!.globalAlpha = 0.45;
      strokeRibbon("#000000", 18);
      ctx!.restore();

      // Custom branded woven thread (Deep burgundy & crimson with metallic highlight stitch)
      strokeRibbon("#120203", 18);
      strokeRibbon("#8F1118", 15);
      strokeRibbon("#D52A2F", 11.5);
      strokeRibbon("rgba(242, 240, 235, 0.4)", 2.5);

      const markIdx = Math.floor(points.length * 0.3);
      const m = points[markIdx];
      const mPrev = points[markIdx - 1];
      const mNext = points[markIdx + 1];
      const angle = Math.atan2(mNext.y - mPrev.y, mNext.x - mPrev.x) + Math.PI / 2;
      ctx!.save();
      ctx!.translate(m.x, m.y);
      ctx!.rotate(angle);
      ctx!.strokeStyle = "rgba(255,255,255,0.7)";
      ctx!.lineWidth = 1.4;
      ctx!.lineCap = "round";
      ctx!.lineJoin = "round";
      ctx!.beginPath();
      ctx!.moveTo(-4, 3.5);
      ctx!.lineTo(0, -3.5);
      ctx!.lineTo(4, 3.5);
      ctx!.stroke();
      ctx!.restore();
    }

    function drawClip() {
      ctx!.save();
      ctx!.translate(anchor.x, anchor.y - 2);
      const g = ctx!.createLinearGradient(-11, -9, 11, 9);
      g.addColorStop(0, "#2c0e12");
      g.addColorStop(0.35, "#8F1118");
      g.addColorStop(0.7, "#1c0507");
      g.addColorStop(1, "#0a0a0c");
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.roundRect(-11, -9, 22, 16, 4);
      ctx!.fill();
      ctx!.strokeStyle = "rgba(213,42,47,.55)";
      ctx!.lineWidth = 1;
      ctx!.stroke();
      ctx!.strokeStyle = "rgba(255,255,255,.55)";
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.moveTo(-8, -6);
      ctx!.lineTo(8, -6);
      ctx!.stroke();
      ctx!.fillStyle = "#D52A2F";
      ctx!.beginPath();
      ctx!.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    function positionCard() {
      const last = points[points.length - 1];
      const prev = points[points.length - 2];
      const angle = Math.atan2(last.y - prev.y, last.x - prev.x) - Math.PI / 2;
      card!.style.left = last.x - card!.offsetWidth / 2 + "px";
      card!.style.top = last.y + "px";
      card!.style.transform = `rotate(${angle}rad)`;
    }

    function updateTiltAndSheen() {
      flipCurrent += (flipTarget - flipCurrent) * 0.16;

      const hovering = !dragging && mouse.x > -1000;
      if (hovering) {
        const cx = card!.offsetLeft + card!.offsetWidth / 2;
        const cy = card!.offsetTop + card!.offsetHeight / 2;
        const dx = Math.max(-1, Math.min(1, (mouse.x - cx) / (card!.offsetWidth / 2)));
        const dy = Math.max(-1, Math.min(1, (mouse.y - cy) / (card!.offsetHeight / 2)));
        tiltTarget.y = dx * MAX_TILT;
        tiltTarget.x = -dy * MAX_TILT;

        const mx = Math.max(0, Math.min(100, ((mouse.x - card!.offsetLeft) / card!.offsetWidth) * 100));
        const my = Math.max(0, Math.min(100, ((mouse.y - card!.offsetTop) / card!.offsetHeight) * 100));
        card!.style.setProperty("--mx", mx + "%");
        card!.style.setProperty("--my", my + "%");
        card!.classList.add("idcl-hovering");
      } else {
        tiltTarget.x = 0;
        tiltTarget.y = 0;
        card!.classList.remove("idcl-hovering");
      }

      tiltCurrent.x += (tiltTarget.x - tiltCurrent.x) * 0.12;
      tiltCurrent.y += (tiltTarget.y - tiltCurrent.y) * 0.12;

      flipper!.style.transform = `rotateY(${flipCurrent + tiltCurrent.y}deg) rotateX(${tiltCurrent.x}deg)`;
    }

    let raf = 0;
    function loop() {
      updatePoints();
      applyConstraints();
      drawRope();
      drawClip();
      positionCard();
      updateTiltAndSheen();
      raf = requestAnimationFrame(loop);
    }

    const onCardDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a")) return;
      e.preventDefault();
      dragging = true;
      setInteracted(true);
      card!.setPointerCapture(e.pointerId);
      const pos = clampToScene(getScenePos(e));
      pointer = pos;
      lastPointer = pos;
      downPos = pos;
    };
    const onWindowMove = (e: PointerEvent) => {
      mouse = getScenePos(e);
      if (!dragging) return;
      const pos = clampToScene(mouse);
      velocity.x = pos.x - lastPointer.x;
      velocity.y = pos.y - lastPointer.y;
      lastPointer = pos;
      pointer = pos;
    };
    const onWindowUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      const pos = getScenePos(e);
      const dist = Math.hypot(pos.x - downPos.x, pos.y - downPos.y);
      if (dist < TAP_THRESHOLD) {
        flipped = !flipped;
        flipTarget = flipped ? 180 : 0;
        const last = points[points.length - 1];
        last.oldx = last.x;
        last.oldy = last.y;
        return;
      }
      const last = points[points.length - 1];
      last.oldx = last.x - velocity.x;
      last.oldy = last.y - velocity.y;
    };
    const onResize = () => resize();
    const onPointerOut = (e: PointerEvent) => {
      if (e.relatedTarget === null) mouse = { x: -9999, y: -9999 };
    };

    card.addEventListener("pointerdown", onCardDown);
    window.addEventListener("pointermove", onWindowMove);
    window.addEventListener("pointerup", onWindowUp);
    window.addEventListener("resize", onResize);
    document.addEventListener("pointerout", onPointerOut);

    loop();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      card.removeEventListener("pointerdown", onCardDown);
      window.removeEventListener("pointermove", onWindowMove);
      window.removeEventListener("pointerup", onWindowUp);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("pointerout", onPointerOut);
    };
  }, [anchorX, anchorY]);

  return (
    <div className={`idcl-root ${contained ? "is-contained" : ""} ${className}`} style={{ "--idcl-z": zIndex } as React.CSSProperties}>
      <style>{CSS}</style>

      {/* section-contained or fixed viewport stage */}
      <div className={`idcl-stage ${contained ? "is-contained" : ""}`} ref={sceneRef}>
        <canvas className="idcl-rope" ref={canvasRef} />
        <div className="idcl-rail" ref={railRef} />

        <div className="idcl-card" ref={cardRef}>
          <div className="idcl-flipper" ref={flipperRef}>
            <div className="idcl-face idcl-front">
              <div className="idcl-hole" />
              <div className="idcl-holo" />

              <div className="idcl-header">
                <div className="idcl-brand">
                  <span className="idcl-brand-mark">▲</span>
                  <div className="idcl-brand-text">
                    <b>{brand}</b>
                    <small>{brandTagline}</small>
                  </div>
                </div>
                <div className="idcl-pillars">
                  {pillars.map((p) => (
                    <span key={p}>{p}</span>
                  ))}
                  <i />
                </div>
              </div>

              {/* Card Photo with Deric Andrews picture */}
              <div className="idcl-photo">
                <img
                  src={photoUrl}
                  alt={name}
                  className="h-full w-full object-cover object-[center_18%] filter contrast-[1.08] brightness-[0.98]"
                />
                <span className="idcl-verified">
                  <Check className="h-3 w-3 text-white stroke-[3]" />
                </span>
              </div>

              <h2 className="idcl-name">{name}</h2>
              <p className="idcl-role">{role}</p>
              <div className="idcl-divider" />

              <div className="idcl-idrow">
                <div className="idcl-idrow-labels">
                  <div>
                    <span>ID</span>
                    <b>{idNumber}</b>
                  </div>
                  <div>
                    <span>Location</span>
                    <b>{location}</b>
                  </div>
                  <div>
                    <span>Valid Thru</span>
                    <b>{validThru}</b>
                  </div>
                </div>
                <div className="idcl-qr idcl-small" ref={qrFrontRef} />
              </div>

              <div className="idcl-footer">
                Build<i>·</i>Ship<i>·</i>Iterate
              </div>
            </div>

            <div className="idcl-face idcl-back">
              <div className="idcl-hole" />
              <div className="idcl-holo" />
              <div className="idcl-stripe" />

              <div className="idcl-idnum">
                <span>NO. {idNumber}</span>
                <em>VALID {validThru}</em>
              </div>
              <div className="idcl-barcode" ref={barcodeRef} />

              <div className="idcl-backrow">
                <div className="idcl-qr" ref={qrBackRef} />
                <div className="idcl-scan">
                  <b>Scan for portfolio</b>
                  {site}
                  <br />
                  Full case studies,
                  <br />
                  source &amp; credits.
                </div>
              </div>

              {(githubUrl || linkedinUrl || instagramUrl) && (
                <div className="idcl-connect">
                  <span>Connect</span>
                  <div className="idcl-connect-icons">
                    {githubUrl && (
                      <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                      </a>
                    )}
                    {linkedinUrl && (
                      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                    )}
                    {instagramUrl && (
                      <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="idcl-sig">
                <div className="idcl-script">{name}</div>
                <small>Authorized Signature</small>
              </div>
            </div>
          </div>
        </div>

        {showHint && (
          <div className={`idcl-hint ${contained ? "is-contained" : ""} ${interacted ? "idcl-hint-hidden" : ""}`}>
            <Move className="h-3.5 w-3.5" />
            Drag to swing · Click to flip ID pass
          </div>
        )}
      </div>
    </div>
  );
}

export default IDCardLanyard;
