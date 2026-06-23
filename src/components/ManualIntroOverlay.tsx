import { useTranslation } from "../i18n";

interface ManualIntroOverlayProps {
  visible: boolean;
  onAction: () => void;
}

export function ManualIntroOverlay({ visible, onAction }: ManualIntroOverlayProps) {
  const { t } = useTranslation();

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-8 text-center md:px-24 pointer-events-auto bg-black/40 backdrop-blur-sm">
      <div className="flex w-full max-w-4xl flex-col items-center">
        <div className="mb-6 inline-flex items-center gap-4 eyebrow-anim animate-fade-in-up-on-load delay-300">
          <span className="h-[1px] w-12 bg-white/60"></span>
          <span className="font-mono text-sm font-medium uppercase tracking-[0.3em] text-white/90">
            {t.hero?.eyebrow || "A Ritual of Focus"}
          </span>
        </div>
        <h1 className="heading-serif text-[4.5rem] font-normal leading-[0.9] tracking-tight text-white drop-shadow-lg md:text-[9rem] animate-fade-in-up-on-load delay-500">
          {t.steps.intro.title}
        </h1>
        <p className="mt-10 max-w-2xl text-xl leading-relaxed text-white drop-shadow animate-fade-in-up-on-load delay-700 mb-14">
          {t.steps.intro.body}
        </p>

        <div className="animate-fade-in-up-on-load delay-900">
          <button
            onClick={onAction}
            className="group relative flex items-center overflow-hidden rounded-full border border-white/50 bg-white/20 px-10 py-5 transition-all duration-500 hover:bg-white/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] focus:outline-none shadow-glass backdrop-blur-md"
          >
            <span className="font-mono text-sm font-bold uppercase tracking-[0.25em] text-white">
              {t.overlay.start || "Start Ritual"}
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
