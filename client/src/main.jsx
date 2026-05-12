import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./styles/global.css";
import "./components/shared/Button.css";
import "./components/shared/Card.css";
import "./components/shared/Badge.css";
import "./components/shared/Input.css";
import "./components/shared/Table.css";
import "./components/admin/Sidebar.css";
import "./components/admin/Dashboard.css";
import "./components/admin/PCInventory.css";
import "./components/admin/RoomLayout.css";
import "./components/kiosk/KioskLayout.css";

const theme = createTheme({
  palette: {
    primary: { main: "#0D2B6B", light: "#1A3F8F", dark: "#081D49", contrastText: "#FFFFFF" },
    secondary: { main: "#CC2027", light: "#E05A5F", dark: "#8B0000", contrastText: "#FFFFFF" },
    success: { main: "#2952B3" },
    error: { main: "#CC2027" },
    warning: { main: "#D4A700" },
    info: { main: "#1A3F8F" },
    background: {
      default: "#F0F4FB",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    color: "#000000",
    h1: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, color: "#000000" },
    h2: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, color: "#000000" },
    h3: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, color: "#000000" },
    h4: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, color: "#000000" },
    h5: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, color: "#000000" },
    h6: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, color: "#000000"},
    subtitle1: { fontWeight: 600, color: "#000000" },
    subtitle2: { fontWeight: 600, color: "#000000" },
    body1: { color: "#000000" },
    body2: { color: "var(--color-text-secondary)" },
    caption: { color: "var(--color-text-secondary)" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: 700,
          fontSize: "0.95rem",
          transition: "all 0.25s ease",
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #0D2B6B 0%, #1A3F8F 50%, #CC2027 100%)",
          color: "#000000",
          boxShadow: "0 8px 24px rgba(13, 43, 107, 0.18)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 16px 28px rgba(13, 43, 107, 0.22)",
            filter: "brightness(1.05)",
          },
        },
        outlinedPrimary: {
          borderColor: "#0D2B6B",
          color: "#0D2B6B",
          "&:hover": {
            borderColor: "#CC2027",
            color: "#CC2027",
            backgroundColor: "rgba(13, 43, 107, 0.06)",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            fontSize: "0.95rem",
            borderRadius: "8px",
            backgroundColor: "#ffffff",
            "& fieldset": {
              borderColor: "#DDE3F0",
              borderWidth: "1.5px",
            },
            "&:hover fieldset": {
              borderColor: "#1A3F8F",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2952B3",
              borderWidth: "2px",
            },
          },
          "& .MuiInputBase-input": {
            color: "#0D1B3E",
            "::placeholder": {
              color: "#216ad1",
              opacity: 0.8,
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0D2B6B",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "linear-gradient(180deg, #F7FAFF 0%, #F0F4FB 55%, #EAF0FA 100%)",
          color: "#0D1B3E",
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
