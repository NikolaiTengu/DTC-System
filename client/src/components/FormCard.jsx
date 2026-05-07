import { Card, Typography, Box } from "@mui/material";

export default function FormCard({ title, children }) {
  return (
    <Card
      sx={{
        p: 3.5,
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: "rgba(220, 180, 60, 0.15)",
        mb: 3,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        background: "linear-gradient(135deg, #ffffff 0%, #FFFACD 100%)",
      }}
    >
      {title && (
        <Box sx={{ mb: 3, pb: 2, borderBottom: "2px solid rgba(230, 57, 70, 0.15)" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "#3d2f1f", fontSize: "1.1rem", letterSpacing: "0.01em" }}
          >
            {title}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2.5,
        }}
      >
        {children}
      </Box>
    </Card>
  );
}
