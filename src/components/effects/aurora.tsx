/**
 * Ambient animated background: a faint grid plus two slowly drifting
 * color fields. Pure CSS animation — zero JS on the main thread.
 */
export function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-lines [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
      <div
        className="absolute -top-1/4 left-1/2 h-[60rem] w-[80rem] -translate-x-1/2 animate-aurora rounded-full blur-3xl will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(139,147,255,0.10) 0%, rgba(110,231,249,0.05) 45%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-1/3 right-0 h-[40rem] w-[50rem] animate-aurora rounded-full blur-3xl will-change-transform [animation-delay:-12s]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(110,231,249,0.05) 0%, rgba(139,147,255,0.04) 50%, transparent 70%)",
        }}
      />
    </div>
  );
}
