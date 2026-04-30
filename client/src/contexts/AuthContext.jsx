import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      const token = localStorage.getItem("dtc_access_token");
      if (!token) {
        if (isMounted) {
          setBootstrapped(true);
        }
        return;
      }
      
      try {
        const data = await apiFetch("/auth/me");
        if (isMounted) {
          setUser(data.user);
        }
      } catch (error) {
        if (isMounted) {
          localStorage.removeItem("dtc_access_token");
          localStorage.removeItem("dtc_refresh_token");
          console.error("Auth check failed:", error);
        }
      } finally {
        if (isMounted) {
          setBootstrapped(true);
        }
      }
    };
    
    checkAuth();
    
    return () => {
      isMounted = false;
    };
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
        try {
          const data = await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
          });
          localStorage.setItem("dtc_access_token", data.accessToken);
          localStorage.setItem("dtc_refresh_token", data.refreshToken);
          setUser(data.user);
        } catch (error) {
          console.error("Login failed:", error);
          throw error;
        }
      },
      async logout() {
        const refreshToken = localStorage.getItem("dtc_refresh_token");
        try {
          await apiFetch("/auth/logout", {
            method: "POST",
            body: JSON.stringify({ refreshToken })
          });
        } catch (error) {
          // Log logout errors but don't throw - we still want to clear local state
          console.error("Logout API call failed:", error);
        } finally {
          localStorage.removeItem("dtc_access_token");
          localStorage.removeItem("dtc_refresh_token");
          setUser(null);
        }
      }
    }),
    [bootstrapped, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
