export const HERO_FRAME_COUNT = 240;

export function heroFramePath(index: number) {
  const frame = Math.min(HERO_FRAME_COUNT, Math.max(1, index));
  return `/hero-frames/ezgif-frame-${String(frame).padStart(3, "0")}.jpg`;
}
