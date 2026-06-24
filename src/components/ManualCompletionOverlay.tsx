import { useTranslation } from "../i18n";

interface ManualCompletionOverlayProps {
  visible: boolean;
  actionLabel: string;
  onAction: () => void;
}

export function ManualCompletionOverlay({
  visible,
  actionLabel,
  onAction,
}: ManualCompletionOverlayProps) {
  const { t } = useTranslation();

  if (!visible) {
    return null;
  }

  const recipeRows = [
    [t.overlay.matcha, "2 g"],
    [t.overlay.warmWater, "70 ml"],
    [t.overlay.waterTemp, "75°C"],
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6">
      <div className="glass-card w-full max-w-[520px] rounded-[2rem] border border-white/30 bg-white/20 p-8 text-left shadow-glass backdrop-blur-2xl pointer-events-auto md:p-10 animate-fade-in-up">
        <span className="eyebrow block font-mono text-xs uppercase tracking-[0.25em] text-matcha-ink/70">
          {t.overlay.finalRecipe}
        </span>

        <h2 className="heading-serif mb-6 mt-3 text-3xl leading-tight text-matcha-ink md:text-4xl">
          {t.steps.finish.title}
        </h2>
        <div className="mb-6 h-[1px] w-full bg-white/30"></div>

        <div className="mb-6">
          {recipeRows.map(([label, value]) => (
            <div key={label}>
              <div className="flex items-baseline justify-between gap-8 py-3">
                <span className="font-sans text-[0.8125rem] tracking-[0.04em] text-matcha-ink/70">
                  {label}
                </span>
                <span className="font-mono text-[0.875rem] font-medium tracking-[0.02em] text-matcha-ink">
                  {value}
                </span>
              </div>
              <div className="h-[1px] w-full bg-white/10"></div>
            </div>
          ))}
        </div>

        <p className="body-text mb-8 text-base leading-relaxed text-matcha-ink md:text-lg">
          {t.steps.finish.body}
        </p>

        <div className="flex justify-center w-full">
          <button
            onClick={onAction}
            className="group relative flex items-center overflow-hidden rounded-full border border-white/50 bg-white/20 px-10 py-5 transition-all duration-500 hover:bg-white/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] focus:outline-none"
          >
            <span className="font-mono text-sm font-bold uppercase tracking-[0.25em] text-white">
              {actionLabel}
            </span>
            <span className="ml-6 flex h-8 w-8 items-center justify-center rounded-full bg-white text-matcha-ink transition-transform duration-500 group-hover:scale-110">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
