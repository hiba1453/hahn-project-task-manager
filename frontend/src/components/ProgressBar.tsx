import { Box, LinearProgress, Typography } from '@mui/material';

export default function ProgressBar({
  value,
  label
}: {
  value: number; // 0..100
  label?: string;
}) {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
        <Typography variant="body2" color="text.secondary">
          {label || 'Completion'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {Math.round(value)}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={Math.max(0, Math.min(100, value))}
        sx={{
          height: 10,
          borderRadius: 999,
          backgroundColor: 'rgba(11,77,255,0.12)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 999,
            backgroundImage: 'linear-gradient(90deg, #0B4DFF, #17C3B2)'
          }
        }}
      />
    </Box>
  );
}
