import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
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
  IconButton,
} from "@mui/material";
import {
  MailOutlined,
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  ArrowRightAlt,
} from "@mui/icons-material";

export default function LoginPage() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("admin@dict-dtc.local");
  const [password, setPassword] = useState("ChangeMe123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
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
          borderRadius: 5,
          boxShadow: "0 16px 48px rgba(13, 43, 107, 0.18)",
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
        <CardContent sx={{ p: { xs: 4, sm: "44px 48px" }, position: "relative", zIndex: 1 }}>
          <Stack spacing={3.5} component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "#0D2B6B",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  fontSize: "0.78rem",
                  boxShadow: "0 8px 18px rgba(13, 43, 107, 0.16)",
                  flexShrink: 0,
                }}
              >
                DTC
              </Box>
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
                  color: "var(--color-on-elevated)",
                  mb: 1,
                }}
              >
                Management System
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "14px" }}>
                Employee login for admin and staff operations.
              </Typography>
            </Box>

            <Box sx={{ display: "grid", gap: 2.25 }}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
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
                    height: 52,
                    borderRadius: "8px",
                    backgroundColor: "#FFFFFF",
                    paddingLeft: 0.5,
                    "& fieldset": { borderColor: "#DDE3F0", borderWidth: "1.5px" },
                    "&:hover fieldset": { borderColor: "#1A3F8F" },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2952B3",
                      boxShadow: "0 0 0 3px rgba(41, 82, 179, 0.12)",
                    },
                  },
                  "& .MuiInputLabel-root": { color: "#94a3b8", fontWeight: 600 },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#1A3F8F" },
                  "& .MuiInputBase-input": { color: "#0D1B3E" },
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((current) => !current)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOffOutlined fontSize="small" /> : <VisibilityOutlined fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 52,
                    borderRadius: "8px",
                    backgroundColor: "#FFFFFF",
                    paddingLeft: 0.5,
                    paddingRight: 0.75,
                    "& fieldset": { borderColor: "#DDE3F0", borderWidth: "1.5px" },
                    "&:hover fieldset": { borderColor: "#1A3F8F" },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2952B3",
                      boxShadow: "0 0 0 3px rgba(41, 82, 179, 0.12)",
                    },
                  },
                  "& .MuiInputLabel-root": { color: "#94a3b8", fontWeight: 600 },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#1A3F8F" },
                  "& .MuiInputBase-input": { color: "#0D1B3E" },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -1 }}>
              <Button
                variant="text"
                href="#"
                sx={{
                  minWidth: 0,
                  p: 0,
                  color: "#1A3F8F",
                  fontWeight: 500,
                  fontSize: "13px",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "transparent", textDecoration: "underline" },
                }}
              >
                Forgot password?
              </Button>
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
                height: 52,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #CC2027 0%, #8B0000 100%)",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "15px",
                letterSpacing: "0.3px",
                boxShadow: "0 8px 24px rgba(204, 32, 39, 0.18)",
                transition: "all 0.25s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #D9353C 0%, #8B0000 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 16px 28px rgba(204, 32, 39, 0.24)",
                  filter: "brightness(1.05)",
                },
                "&:active": { transform: "translateY(0)" },
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
