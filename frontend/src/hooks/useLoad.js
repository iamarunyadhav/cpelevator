import { useEffect, useState } from "react";

// Runs an async loader on mount (and whenever `deps` change) and returns { data, loading, error }.
export function useLoad(loader, deps = []) {
  const [state, setState] = useState({ data: undefined, loading: true, error: null });
  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    loader()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => active && setState({ data: undefined, loading: false, error }));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}
