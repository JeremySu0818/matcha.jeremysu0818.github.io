import type { JSX } from "react";
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
}: Readonly<ManualCompletionOverlayProps>): JSX.Element | null {
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
    <div className="manual-completion">
      <div className="manual-completion__sheet">
        <div className="manual-completion__folio" aria-hidden="true">M / 04</div>
        <p className="editorial-eyebrow">{t.overlay.finalRecipe}</p>
        <h2>{t.steps.finish.title}</h2>

        <div className="manual-completion__recipe">
          {recipeRows.map(([label, value]) => (
            <div className="manual-completion__row" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        <p className="manual-completion__body">
          {t.steps.finish.body}
        </p>

        <button type="button" onClick={onAction} className="editorial-action">
          <span>{actionLabel}</span>
          <i aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
