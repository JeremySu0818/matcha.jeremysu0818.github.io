import type { JSX } from "react";
import { InteractiveMatchaPowder } from "../components/effects/InteractiveMatchaPowder";
import { ROUTE_BACKGROUNDS, UNIQUE_BACKGROUNDS } from "./routes";

interface RouteBackdropProps {
  readonly isHome: boolean;
  readonly isMake: boolean;
  readonly isMobile: boolean;
  readonly route: string;
}

export function RouteBackdrop({
  isHome,
  isMake,
  isMobile,
  route,
}: RouteBackdropProps): JSX.Element {
  const currentBackground = ROUTE_BACKGROUNDS[route] ?? "";
  return (
    <div className="route-backdrop fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#f1eee5]">
      {UNIQUE_BACKGROUNDS.map((backgroundUrl) => (
        <div
          key={backgroundUrl}
          className={`route-backdrop__image absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[800ms] ease-in-out ${
            currentBackground === backgroundUrl ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url('${backgroundUrl}')` }}
        >
          <div
            className={`route-backdrop__scrim absolute inset-0 ${
              isMake
                ? "route-backdrop__scrim--make"
                : "route-backdrop__scrim--home"
            }`}
          />
        </div>
      ))}
      {(isHome || isMake) && (
        <InteractiveMatchaPowder isMobile={isMobile} />
      )}
    </div>
  );
}
