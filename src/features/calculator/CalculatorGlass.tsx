import type { ReactNode } from "react";

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="calculator-card-title">{children}</h2>;
}

export function GlassSlot({
  children,
  className = "",
  shape = "card",
}: {
  children: ReactNode;
  className?: string;
  shape?: "tab" | "reset" | "card";
}) {
  return (
    <div
      className={`calculator-glass-slot calculator-glass-slot-${shape} ${className}`}
    >
      <div
        className={`calculator-live-glass calculator-live-glass-${shape}`}
        aria-hidden="true"
      />
      <div className="calculator-visible-reveal">{children}</div>
    </div>
  );
}
