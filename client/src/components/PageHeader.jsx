import { Box, Typography, Stack } from "@mui/material";

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={{ mb: 4, gap: 3, pb: 2.5, borderBottom: "1px solid var(--color-border)" }}
    >
      <Box>
        <Typography className="page-header-title" variant="h4" sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', mb: subtitle ? 1.25 : 0, letterSpacing: "-0.02em", color: "#0D2B6B" }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: "#0D2B6B", fontSize: "14px", fontWeight: 600 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && (
        <Box sx={{ display: "flex", gap: 1.25, justifyContent: "flex-end", flexWrap: "wrap" }}>
          {actions}
        </Box>
      )}
    </Stack>
  );
}
