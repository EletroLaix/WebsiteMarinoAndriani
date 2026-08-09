import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const wrapRefs = useRef<Array<HTMLDivElement | null>>([]);
  const multipliers = [60, -40, 30];

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    let running = false;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const handleMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(animate);
      }
    };

    const animate = () => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;

      // Write transforms straight to the DOM: no React re-render per frame,
      // which is what made the first paint stutter.
      wrapRefs.current.forEach((el, i) => {
        if (!el) return;
        const m = multipliers[i] ?? 0;
        el.style.transform = `translate3d(${current.x * m}px, ${current.y * m}px, 0)`;
      });

      const settled =
        Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001;
      if (settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="bg-fx">
      <div className="bg-fx-glow-wrap" ref={(el) => { wrapRefs.current[0] = el; }}>
        <div className="bg-fx-glow bg-fx-glow-1" />
      </div>
      <div className="bg-fx-glow-wrap" ref={(el) => { wrapRefs.current[1] = el; }}>
        <div className="bg-fx-glow bg-fx-glow-2" />
      </div>
      <div className="bg-fx-glow-wrap" ref={(el) => { wrapRefs.current[2] = el; }}>
        <div className="bg-fx-glow bg-fx-glow-3" />
      </div>
      <div className="bg-fx-vignette" />
    </div>
  );
}
