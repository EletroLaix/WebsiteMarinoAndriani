import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let raf = 0;
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };

    const handleMove = (e: MouseEvent) => {
      target = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    const animate = () => {
      current = {
        x: current.x + (target.x - current.x) * 0.06,
        y: current.y + (target.y - current.y) * 0.06,
      };
      setMouse({ x: current.x, y: current.y });
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const wrapStyle = (multiplier: number) => ({
    transform: `translate3d(${mouse.x * multiplier}px, ${mouse.y * multiplier}px, 0)`,
  });

  return (
    <div aria-hidden className="bg-fx">
      <div className="bg-fx-glow-wrap" style={wrapStyle(60)}>
        <div className="bg-fx-glow bg-fx-glow-1" />
      </div>
      <div className="bg-fx-glow-wrap" style={wrapStyle(-40)}>
        <div className="bg-fx-glow bg-fx-glow-2" />
      </div>
      <div className="bg-fx-glow-wrap" style={wrapStyle(30)}>
        <div className="bg-fx-glow bg-fx-glow-3" />
      </div>
      <div className="bg-fx-vignette" />
    </div>
  );
}
