import { useEffect, useRef } from "react";

/**
 * Warm plasma / lava background.
 * Rendered on a small offscreen buffer (~1/10 of the viewport) and upscaled by
 * the browser: organic movement at 60fps-friendly cost, no WebGL required.
 * Palette is strictly warm: bordeaux -> crimson -> orange -> amber -> yellow.
 */

const PALETTE: Array<[number, number, number]> = [
  [8, 3, 2],
  [32, 6, 4],
  [72, 12, 8],
  [116, 26, 10],
  [164, 48, 12],
  [204, 78, 18],
  [228, 122, 36],
  [240, 176, 80],
];

function buildLut() {
  const lut = new Uint8ClampedArray(256 * 3);
  const last = PALETTE.length - 1;
  for (let i = 0; i < 256; i++) {
    const p = (i / 255) * last;
    const i0 = Math.floor(p);
    const i1 = Math.min(i0 + 1, last);
    const f = p - i0;
    const a = PALETTE[i0]!;
    const b = PALETTE[i1]!;
    lut[i * 3] = a[0] + (b[0] - a[0]) * f;
    lut[i * 3 + 1] = a[1] + (b[1] - a[1]) * f;
    lut[i * 3 + 2] = a[2] + (b[2] - a[2]) * f;
  }
  return lut;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(hover: none)").matches;
    const lut = buildLut();

    let w = 0;
    let h = 0;
    let image: ImageData | null = null;
    let raf = 0;
    let last = 0;
    let t = 0;

    // Pointer heat trail (desktop only)
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, energy: 0 };

    const resize = () => {
      const scale = coarse ? 14 : 10;
      w = Math.max(48, Math.round(window.innerWidth / scale));
      h = Math.max(32, Math.round(window.innerHeight / scale));
      canvas.width = w;
      canvas.height = h;
      image = ctx.createImageData(w, h);
      const data = image.data;
      for (let i = 3; i < data.length; i += 4) data[i] = 255;
      draw(0);
    };

    const draw = (dt: number) => {
      if (!image) return;
      t += dt;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      mouse.energy *= 0.94;

      const data = image.data;
      const mx = mouse.x * w;
      const my = mouse.y * h;
      const radius = Math.max(w, h) * 0.34;
      const invR2 = 1 / (radius * radius);
      const heat = coarse ? 0 : 0.35 + mouse.energy * 0.45;

      let p = 0;
      for (let y = 0; y < h; y++) {
        const fy = y / h;
        for (let x = 0; x < w; x++, p += 4) {
          const fx = x / w;

          // domain warp -> lava-lamp style folding (slowed ~2x)
          const wx = fx + 0.18 * Math.sin(fy * 5.1 + t * 0.22);
          const wy = fy + 0.18 * Math.sin(fx * 4.3 - t * 0.16);

          let v =
            Math.sin(wx * 5.6 + t * 0.28) +
            Math.sin(wy * 6.4 - t * 0.2) +
            Math.sin((wx + wy) * 4.1 + t * 0.36) +
            Math.sin(Math.sqrt((wx - 0.32) * (wx - 0.32) + (wy - 0.7) * (wy - 0.7)) * 11 - t * 0.45);

          v = v * 0.25; // -1..1

          // rising heat: gentle ember source
          v += 0.18 * (1 - fy) * 0.4 + 0.14 * (1 - fx) * 0.3;

          if (heat > 0) {
            const dx = x - mx;
            const dy = y - my;
            v += heat * Math.exp(-(dx * dx + dy * dy) * invR2 * 2.4);
          }

          let n = (v + 1) * 0.5;
          if (n < 0) n = 0;
          else if (n > 1) n = 1;
          n = n * n * (3 - 2 * n); // smoothstep for softer transitions

          const idx = ((n * 255) | 0) * 3;
          data[p] = lut[idx]!;
          data[p + 1] = lut[idx + 1]!;
          data[p + 2] = lut[idx + 2]!;
        }
      }
      ctx.putImageData(image, 0, 0);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const elapsed = now - last;
      const frame = coarse ? 60 : 33; // ~16fps mobile, ~30fps desktop (buffer is tiny)
      if (elapsed < frame) return;
      last = now;
      draw(Math.min(elapsed, 100) / 1000);
    };

    const onMove = (e: MouseEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = e.clientY / window.innerHeight;
      mouse.energy = Math.min(0.7, mouse.energy + 0.06);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    if (!coarse) window.addEventListener("mousemove", onMove, { passive: true });
    if (!reduced) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div aria-hidden className="bg-fx">
      <canvas ref={canvasRef} className="bg-fx-canvas" />
      <div className="bg-fx-vignette" />
    </div>
  );
}
