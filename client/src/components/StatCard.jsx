import { Card, Box, Typography } from "@mui/material";

export default function StatCard({ label, value, hint, icon, delay = 0 }) {
  return (
    <Card
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "var(--color-border)",
        background: "#FFFFFF",
        boxShadow: "var(--shadow-sm)",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
        animation: "fadeRise 0.45s ease both",
        animationDelay: typeof delay === "number" ? `${delay}s` : delay,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #0D2B6B 0%, #2EC9FF 100%)",
        },
        "&:hover": {
          boxShadow: "var(--shadow-md)",
          transform: "translateY(-3px)",
          borderColor: "var(--color-highlight-strong)",
        },
      }}
    >
      {icon ? (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            bgcolor: "rgba(13, 43, 107, 0.08)",
            color: "#0D2B6B",
          }}
          aria-hidden="true"
        >
          {icon}
        </Box>
      ) : null}

      <Typography
        variant="caption"
        sx={{
          color: "#0D2B6B",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontSize: "11px",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 800,
          color: "#0D2B6B",
          fontSize: "40px",
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
      {hint && (
        <Typography variant="caption" sx={{ color: "#0D2B6B", mt: 0.25, fontSize: "0.82rem" }}>
          {hint}
        </Typography>
      )}
    </Card>
  );
}
