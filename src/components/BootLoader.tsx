import { useEffect, useState } from "react";

/**
 * Soft boot loader shown once on first load.
 * Uses the site's favicon at the center of a minimal ring.
 * Entrance and exit are always fully played, even if the site loads instantly.
 */
export function BootLoader() {
  const [phase, setPhase] = useState<"entering" | "holding" | "exiting" | "done">("entering");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem("ma-booted") === "1") {
      setPhase("done");
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      window.sessionStorage.setItem("ma-booted", "1");
      setPhase("done");
      return;
    }

    document.body.style.overflow = "hidden";

    // Force a real first paint with opacity:0 before revealing the loader.
    // This guarantees the browser sees the state change and animates smoothly,
    // even if the site hydrates almost instantly.
    const showTimer = window.setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    }, 200);

    // Keep the loader on screen long enough for the full entrance animation
    // to play and be seen, even when the site finishes loading very quickly.
    const holdTimer = window.setTimeout(() => {
      setPhase("exiting");
      window.setTimeout(() => {
        window.sessionStorage.setItem("ma-booted", "1");
        setPhase("done");
      }, 1400);
    }, 3600);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(holdTimer);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (phase === "done") document.body.style.overflow = "";
  }, [phase]);

  if (phase === "done") return null;

  const isExiting = phase === "exiting";

  return (
    <div
      className={`boot-loader${visible ? " is-visible" : ""}${isExiting ? " is-closing" : ""}`}
      aria-hidden
    >
      <div className="boot-core">
        <span className="boot-ring" />
        <img src="/favicon.png" alt="" className="boot-logo" />
      </div>
      <div className="boot-meta">
        <p className="boot-title">MARINO ANDRIANI</p>
        <p className="boot-status">INITIALIZING SYSTEM</p>
      </div>
    </div>
  );
}
