import { Box } from '@mui/material';

export default function GradientBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(1200px 600px at 10% 10%, rgba(11,77,255,0.18), transparent 60%),' +
          'radial-gradient(900px 500px at 90% 20%, rgba(23,195,178,0.18), transparent 55%),' +
          'linear-gradient(180deg, #F7FAFF 0%, #FFFFFF 55%, #F3FFFD 100%)'
      }}
    >
      {children}
    </Box>
  );
}
