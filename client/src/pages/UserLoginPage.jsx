import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../api/http";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Stack,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { MailOutlined, ArrowRightAlt } from "@mui/icons-material";

export default function UserLoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userCode, setUserCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const ticketCode = userCode.trim();
      const data = await apiFetch("/tickets/verify", {
        method: "POST",
        body: JSON.stringify({ ticketCode })
      });
      const guestProfile = data?.guest || null;
      const guestName = data?.guest?.fullName?.trim() || "";
      const sessionId = data?.sessionId || data?.ticket?.visitSessionId || "";
      if (guestName) {
        sessionStorage.setItem("dtc_user_name", guestName);
      } else {
        sessionStorage.removeItem("dtc_user_name");
      }
      if (guestProfile) {
        sessionStorage.setItem("dtc_user_guest_profile", JSON.stringify(guestProfile));
      } else {
        sessionStorage.removeItem("dtc_user_guest_profile");
      }
      sessionStorage.setItem("dtc_user_ticket_code", ticketCode);
      if (sessionId) {
        sessionStorage.setItem("dtc_user_session_id", sessionId);
      } else {
        sessionStorage.removeItem("dtc_user_session_id");
      }
      navigate("/user-welcome", { replace: true, state: { guestName, sessionId, guestProfile } });
    } catch (err) {
      setError(err.message || "Invalid ticket code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 18% 16%, rgba(13, 43, 107, 0.08), transparent 28%), radial-gradient(circle at 88% 14%, rgba(204, 32, 39, 0.08), transparent 18%), linear-gradient(180deg, #F7FAFF 0%, #F0F4FB 100%)",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(203, 213, 225, 0.45) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
          opacity: 0.5,
        },
      }}
    >
      <Card
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 1,
          width: "min(460px, 100%)",
          borderRadius: "12px",
          boxShadow: "0 16px 48px rgba(13, 43, 107, 0.12)",
          overflow: "hidden",
          bgcolor: "#FFFFFF",
          borderTop: "3px solid transparent",
          backgroundClip: "padding-box",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            height: 4,
            background: "linear-gradient(90deg, #0D2B6B 0%, #CC2027 52%, #D4A700 100%)",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            zIndex: 2,
          },
        }}
      >
        <CardContent sx={{ p: { xs: 4, sm: 6 }, position: "relative", zIndex: 1 }}>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                component="img"
                src="/DICT-Logo-2.png"
                alt="DICT logo"
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  display: "block",
                  bgcolor: "#FFFFFF",
                  border: "1px solid rgba(13, 43, 107, 0.16)",
                  boxShadow: "0 8px 18px rgba(13, 43, 107, 0.16)",
                  flexShrink: 0,
                  objectFit: "contain",
                  p: 0.5,
                }}
              />
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    display: "block",
                    color: "#0D2B6B",
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    lineHeight: 1,
                  }}
                >
                  DICT DTC
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 800,
                  fontSize: "32px",
                  lineHeight: 1.1,
                  color: "#0D2B6B",
                  mb: 1,
                }}
              >
                User Login
              </Typography>
              <Typography variant="body2" sx={{ color: "#6B7280", fontSize: "14px" }}>
                Sign in to access your user dashboard.
              </Typography>
            </Box>

            <Box sx={{ display: "grid", gap: 2 }}>
              <TextField
                label="Ticket Code"
                type="text"
                value={userCode}
                onChange={(event) => setUserCode(event.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 44,
                    borderRadius: "8px",
                    backgroundColor: "#FFFFFF",
                    paddingLeft: 0.5,
                    "& fieldset": { borderColor: "#C7D2E5", borderWidth: "1px" },
                    "&:hover fieldset": { borderColor: "#0D2B6B" },
                    "&.Mui-focused fieldset": {
                      borderColor: "#0D2B6B",
                      boxShadow: "0 0 0 3px rgba(13, 43, 107, 0.18)",
                    },
                  },
                  "& .MuiInputLabel-root": { color: "#6B7280", fontWeight: 600 },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#0D2B6B" },
                  "& .MuiInputBase-input": { color: "#0D1B3E" },
                }}
              />
            </Box>

            {error ? (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "rgba(204, 32, 39, 0.08)",
                  color: "#8B0000",
                  border: "1px solid rgba(204, 32, 39, 0.18)",
                }}
              >
                <Typography variant="body2">{error}</Typography>
              </Box>
            ) : null}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              size="large"
              endIcon={loading ? null : <ArrowRightAlt />}
              sx={{
                width: "100%",
                height: 44,
                borderRadius: "999px",
                background: "linear-gradient(135deg, #CC2027 0%, #8B0000 100%)",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "14px",
                letterSpacing: "0.2px",
                boxShadow: "0 8px 24px rgba(204, 32, 39, 0.18)",
                transition: "all 0.25s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #D9353C 0%, #8B0000 100%)",
                  boxShadow: "0 16px 28px rgba(204, 32, 39, 0.24)",
                  filter: "brightness(1.05)",
                },
              }}
            >
              {loading ? (
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <CircularProgress size={18} color="inherit" />
                  <span>Signing in</span>
                </Stack>
              ) : (
                "Sign In"
              )}
            </Button>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="text"
                href="/login"
                sx={{
                  minWidth: 0,
                  p: 0,
                  color: "#1A3F8F",
                  fontWeight: 600,
                  fontSize: "13px",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "transparent", textDecoration: "underline" },
                }}
              >
                Switch to Admin View
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Box
        sx={{
          mt: 2.75,
          width: "100%",
          maxWidth: 460,
          display: "grid",
          gap: 1.25,
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        <Box sx={{ width: "100%", height: 1, backgroundColor: "rgba(13, 43, 107, 0.12)" }} />
        <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "12px", fontWeight: 600 }}>
          Secure Government System
        </Typography>
      </Box>
    </Box>
  );
}
