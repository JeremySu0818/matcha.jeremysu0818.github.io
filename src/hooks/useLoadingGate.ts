import { useCallback, useEffect, useState } from "react";

export function useLoadingGate(trigger: unknown, minDuration = 800) {
  const [ready, setReady] = useState(false);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    setReady(false);
    setMinTimePassed(false);

    const timer = window.setTimeout(() => {
      setMinTimePassed(true);
    }, minDuration);

    return () => window.clearTimeout(timer);
  }, [trigger, minDuration]);

  const markReady = useCallback(() => {
    setReady(true);
  }, []);

  return {
    loaded: ready && minTimePassed,
    markReady,
  };
}
