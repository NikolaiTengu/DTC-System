import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api/http";

export function useApi(path, options = {}) {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState("");

  const run = useCallback(
    async (overridePath = path, overrideOptions = {}) => {
      if (!overridePath) return null;
      try {
        setLoading(true);
        setError("");
        const result = await apiFetch(overridePath, overrideOptions);
        setData(result);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [path]
  );

  useEffect(() => {
    if (!path || options.manual) {
      setLoading(false);
      return;
    }
    run().catch(() => null);
  }, [options.manual, path, run]);

  return { data, loading, error, run, setData };
}
