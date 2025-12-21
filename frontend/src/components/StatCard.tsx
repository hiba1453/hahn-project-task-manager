// src/components/StatCard.tsx
import { Box, Typography } from "@mui/material";
import GlassCard from "./GlassCard";

export default function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <GlassCard sx={{ p: 1.75 }}>
      <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: 0.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {value}
        </Typography>
        {hint && (
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
            {hint}
          </Typography>
        )}
      </Box>
    </GlassCard>
  );
}
