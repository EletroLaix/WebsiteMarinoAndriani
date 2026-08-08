export function AnimatedBackground() {
  return (
    <div aria-hidden className="bg-fx">
      <div className="bg-fx-glow bg-fx-glow-1" />
      <div className="bg-fx-glow bg-fx-glow-2" />
      <div className="bg-fx-glow bg-fx-glow-3" />
      <div className="bg-fx-vignette" />
    </div>
  );
}
