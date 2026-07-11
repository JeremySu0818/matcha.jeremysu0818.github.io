import { useTranslation } from "../i18n";

interface ManualIntroOverlayProps {
  visible: boolean;
  onAction: () => void;
}

export function ManualIntroOverlay({ visible, onAction }: ManualIntroOverlayProps) {
  const { t } = useTranslation();

  if (!visible) return null;

  return (
    <div className="manual-intro">
      <div className="manual-intro__frame" aria-hidden="true" />
      <div className="manual-intro__folio" aria-hidden="true">M / 01</div>
      <div className="manual-intro__copy">
        <p className="editorial-eyebrow eyebrow-anim">{t.hero.eyebrow}</p>
        <h1>{t.steps.intro.title}</h1>
        <p className="manual-intro__body">{t.steps.intro.body}</p>
        <button type="button" onClick={onAction} className="editorial-action editorial-action--light">
          <span>{t.overlay.start}</span>
          <i aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
