import { useEffect, useState } from "react";

/**
 * Minimal Jarvis-style boot animation shown once on first load.
 * Uses the site's black / white / orange palette.
 */
export function BootLoader() {
  const [closing, setClosing] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem("ma-booted") === "1") {
      setDone(true);
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      window.sessionStorage.setItem("ma-booted", "1");
      setDone(true);
      return;
    }

    document.body.style.overflow = "hidden";
    const duration = 1800;

    const closeTimer = window.setTimeout(() => {
      setClosing(true);
      window.setTimeout(() => {
        window.sessionStorage.setItem("ma-booted", "1");
        setDone(true);
      }, 700);
    }, duration);

    return () => {
      clearTimeout(closeTimer);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  if (done) return null;

  return (
    <div className={`boot-loader${closing ? " is-closing" : ""}`} aria-hidden>
      <div className="boot-scan" />
      <div className="boot-core">
        <span className="boot-ring boot-ring-1" />
        <span className="boot-ring boot-ring-2" />
        <span className="boot-ring boot-ring-3" />
        <span className="boot-ring-ticks" />
        <span className="boot-monogram">MA</span>
      </div>
      <div className="boot-meta">
        <p className="boot-title">MARINO ANDRIANI</p>
        <p className="boot-status">INITIALIZING SYSTEM</p>
      </div>
    </div>
  );
}
