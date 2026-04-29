import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("dtc_access_token");
    if (!token) {
      setBootstrapped(true);
      return;
    }
    apiFetch("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("dtc_access_token");
        localStorage.removeItem("dtc_refresh_token");
      })
      .finally(() => setBootstrapped(true));
  }, []);

  const value = useMemo(
    () => ({
      user,
      bootstrapped,
      isAuthenticated: Boolean(user),
      hasPermission(permission) {
        return user?.permissions?.includes(permission);
      },
      async login(email, password) {
        const data = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });
        localStorage.setItem("dtc_access_token", data.accessToken);
        localStorage.setItem("dtc_refresh_token", data.refreshToken);
        setUser(data.user);
      },
      async logout() {
        const refreshToken = localStorage.getItem("dtc_refresh_token");
        try {
          await apiFetch("/auth/logout", {
            method: "POST",
            body: JSON.stringify({ refreshToken })
          });
        } catch {
          // ignore logout failures and clear local state
        }
        localStorage.removeItem("dtc_access_token");
        localStorage.removeItem("dtc_refresh_token");
        setUser(null);
      }
    }),
    [bootstrapped, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
