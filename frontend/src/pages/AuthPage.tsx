import { motion } from 'framer-motion';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import GradientBackdrop from '../components/GradientBackdrop';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function AuthPage() {
  const { login, register, token, user } = useAuth();
  const isAuthenticated = !!token || !!user;

  const nav = useNavigate();

  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (!validateEmail(email)) return false;
    if (password.trim().length < 6) return false;
    if (tab === 1 && fullName.trim().length < 2) return false;
    return true;
  }, [email, password, fullName, tab]);

  if (isAuthenticated) return null;

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      if (tab === 0) await login(email, password);
      else await register(email, password, fullName);
      nav('/app');
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Network error';
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <GradientBackdrop>
      <Container
        maxWidth="sm"
        sx={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          py: 2,
          overflow: 'hidden'
        }}
      >
        <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}>
          
          <Box
            component="img"
            src="/TaskFlowLogo2.png"
            alt="TaskFlow"
            sx={{
              width: { xs: 200, sm: 260 },
              maxWidth: '70vw',
              height: 'auto',
              objectFit: 'contain',
              imageRendering: 'auto'
            }}
          />

          <GlassCard sx={{ width: '100%', p: 3 }}>
            <Stack spacing={2}>
              <Stack spacing={0.5}>
                <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -1 }}>
                  {tab === 0 ? 'Welcome back' : 'Create your account'}
                </Typography>
                <Typography color="text.secondary">Flow. Focus. Finish.</Typography>
              </Stack>

              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="fullWidth"
                sx={{
                  bgcolor: 'rgba(15, 23, 42, 0.04)',
                  borderRadius: 2,
                  p: 0.5,
                  '& .MuiTab-root': { minHeight: 42 },
                  '& .MuiTabs-indicator': { display: 'none' },
                  '& .Mui-selected': {
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 10px 30px rgba(11, 77, 255, 0.15)'
                  }
                }}
              >
                <Tab label="Login" />
                <Tab label="Register" />
              </Tabs>

              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Stack spacing={1.5}>
                {tab === 1 && (
                  <TextField
                    label="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                    fullWidth
                  />
                )}

                <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" fullWidth />

                <TextField
                  label="Password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={tab === 0 ? 'current-password' : 'new-password'}
                  fullWidth
                  helperText={tab === 1 ? 'Minimum 6 characters' : undefined}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPwd((s) => !s)} edge="end">
                          {showPwd ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <Button
                  variant="contained"
                  size="large"
                  disabled={!canSubmit || loading}
                  onClick={onSubmit}
                  sx={{ py: 1.2, borderRadius: 2, fontWeight: 900 }}
                >
                  {loading ? 'Please wait…' : tab === 0 ? 'Login' : 'Create account'}
                </Button>

                <Divider sx={{ my: 0.5 }} />
              </Stack>
            </Stack>
          </GlassCard>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} TaskFlow
            </Typography>
          </motion.div>
        </Stack>
      </Container>
    </GradientBackdrop>
  );
}
