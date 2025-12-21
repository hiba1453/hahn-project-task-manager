import { Button, Container, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GradientBackdrop from '../components/GradientBackdrop';

export default function NotFoundPage() {
  const nav = useNavigate();
  return (
    <GradientBackdrop>
      <Container maxWidth="sm" sx={{ py: 12 }}>
        <Stack spacing={2}>
          <Typography variant="h3">404</Typography>
          <Typography color="text.secondary">Page not found.</Typography>
          <Button variant="contained" onClick={() => nav('/dashboard')}>Go to dashboard</Button>
        </Stack>
      </Container>
    </GradientBackdrop>
  );
}
