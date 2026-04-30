const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 30000;

function createTimeoutPromise(timeoutMs) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timeout")), timeoutMs)
  );
}

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("dtc_access_token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const fetchPromise = fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      signal: controller.signal
    });

    // Set timeout for fetch
    const timeoutPromise = createTimeoutPromise(REQUEST_TIMEOUT);
    const response = await Promise.race([fetchPromise, timeoutPromise]);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const type = response.headers.get("content-type") || "";
    if (type.includes("application/json")) return response.json();
    return response.text();
  } catch (error) {
    // Handle abort error
    if (error.name === "AbortError") {
      throw new Error("Request was cancelled");
    }
    throw error;
  }
}

export { API_BASE };
