// src/components/GlassCard.tsx
import { Card, CardProps } from "@mui/material";

export default function GlassCard(props: CardProps) {
  return (
    <Card
      elevation={0}
      {...props}
      sx={{
        border: "1px solid rgba(15, 23, 42, 0.10)",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255,255,255,0.78)",
        borderRadius: 2, // ✅ moins arrondi
        boxShadow: "0 12px 30px rgba(11, 77, 255, 0.08), 0 2px 10px rgba(0,0,0,0.06)",
        ...props.sx,
      }}
    />
  );
}
