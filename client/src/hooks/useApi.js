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
    
    let isMounted = true;
    
    // Create a new function to avoid dependency on 'run' which would cause infinite loops
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await apiFetch(path);
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [path, options.manual]);

  return { data, loading, error, run, setData };
}
