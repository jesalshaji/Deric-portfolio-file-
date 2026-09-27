"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { HERO_FRAME_COUNT, heroFramePath } from "@/lib/heroFrames";

export type HeroFrameCanvasHandle = {
  drawFrame: (index: number) => void;
};

type Props = {
  onProgress: (loaded: number, total: number) => void;
  onReady: () => void;
};

export const HeroFrameCanvas = forwardRef<HeroFrameCanvasHandle, Props>(function HeroFrameCanvas(
  { onProgress, onReady },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentIndexRef = useRef(0);
  const dprRef = useRef(1);
  const callbacksRef = useRef({ onProgress, onReady });
  callbacksRef.current = { onProgress, onReady };

  const draw = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !ctx || !img || !img.complete || img.naturalWidth === 0) return;

    const dpr = dprRef.current;
    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  useImperativeHandle(ref, () => ({
    drawFrame: (index: number) => {
      const clamped = Math.min(HERO_FRAME_COUNT - 1, Math.max(0, Math.round(index)));
      currentIndexRef.current = clamped;
      draw(clamped);
    },
  }));

  // Preload the full frame sequence once on mount. Callbacks are read from a
  // ref so this effect intentionally never re-runs while loading is in flight.
  useEffect(() => {
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= HERO_FRAME_COUNT; i += 1) {
      const img = new Image();
      img.decoding = "async";
      img.src = heroFramePath(i);
      const onSettle = () => {
        loaded += 1;
        callbacksRef.current.onProgress(loaded, HERO_FRAME_COUNT);
        if (i === 1) draw(0);
        if (loaded === HERO_FRAME_COUNT) callbacksRef.current.onReady();
      };
      img.onload = onSettle;
      img.onerror = onSettle;
      images.push(img);
    }

    imagesRef.current = images;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(currentIndexRef.current);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
});
