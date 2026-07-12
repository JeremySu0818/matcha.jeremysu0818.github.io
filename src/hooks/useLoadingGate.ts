import { useCallback, useEffect, useState } from "react";

interface LoadingGateResult {
  readonly loaded: boolean;
  readonly markReady: () => void;
}

interface LoadingGateState {
  readonly minTimePassed: boolean;
  readonly ready: boolean;
  readonly trigger: unknown;
}

export function useLoadingGate(
  trigger: unknown,
  minDuration = 800,
): LoadingGateResult {
  const [state, setState] = useState<LoadingGateState>(() => ({
    minTimePassed: false,
    ready: false,
    trigger,
  }));

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setState((current) => ({
        minTimePassed: true,
        ready: Object.is(current.trigger, trigger) && current.ready,
        trigger,
      }));
    }, minDuration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [trigger, minDuration]);

  const markReady = useCallback(() => {
    setState((current) => ({
      minTimePassed:
        Object.is(current.trigger, trigger) && current.minTimePassed,
      ready: true,
      trigger,
    }));
  }, [trigger]);

  return {
    loaded:
      Object.is(state.trigger, trigger) &&
      state.ready &&
      state.minTimePassed,
    markReady,
  };
}
