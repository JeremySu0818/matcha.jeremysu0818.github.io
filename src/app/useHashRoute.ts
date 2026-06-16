import { useEffect, useState } from "react";

export function useHashRoute() {
  const [route, setRoute] = useState(() => window.location.hash || "");

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || "");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return route;
}
