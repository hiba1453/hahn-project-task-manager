import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import GradientBackdrop from '../components/GradientBackdrop';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

export default function WelcomePage() {
  const nav = useNavigate();
  const [tip, setTip] = useState(0);

  const tips = useMemo(
    () => [
      'Organize projects into tasks and subtasks for clarity.',
      'Your progress updates automatically from completed tasks.',
      'Use “Tasks” to see everything across all projects.',
      'Less noise. More flow.',
      'One click to toggle tasks. Done or not done.',
    ],
    []
  );

  const nextTip = () => setTip((t) => (t + 1) % tips.length);

  return (
    <GradientBackdrop>
      <Container
        maxWidth="md"
        sx={{
          minHeight: '00vh',
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
          py: 2
        }}
      >
        <Box sx={{ width: '100%' }}>
          {/* soft decorative blobs */}
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: -80,
              pointerEvents: 'none',
              opacity: 0.75,
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(11,77,255,0.14), transparent 48%),
                radial-gradient(circle at 80% 20%, rgba(23,195,178,0.14), transparent 52%),
                radial-gradient(circle at 55% 85%, rgba(11,77,255,0.10), transparent 55%)
              `
            }}
          />

          <Stack
            spacing={2.2}
            alignItems="center"
            sx={{
              textAlign: 'center',
              position: 'relative',
              px: { xs: 2, sm: 0 }
            }}
          >
            {/* LOGO */}
            <MotionBox
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55 }}
              sx={{ display: 'grid', placeItems: 'center' }}
            >
              <motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 2, ease: 'easeOut' }}
>
  <Box
  component="img"
  src="/TaskFlowLogo2.png"
  alt="TaskFlow"
  sx={{
    width: { xs: 180, sm: 220, md: 260 },
    maxWidth: '90vw',
    height: 'auto',
    objectFit: 'contain',
    filter: `
      drop-shadow(0 18px 40px rgba(11,77,255,0.28))
      drop-shadow(0 6px 12px rgba(0,0,0,0.08))
    `
  }}
/> 
</motion.div>


            </MotionBox>

            {/* TITLE */}
            <MotionBox
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.06 }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 950,
                  letterSpacing: -1.6,
                  lineHeight: 1.05
                }}
              >
                Welcome to{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(90deg, #0B4DFF, #17C3B2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  TaskFlow
                </Box>
              </Typography>
            </MotionBox>

            {/* DESCRIPTION */}
            <MotionBox
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              sx={{ maxWidth: 720 }}
            >
              <Typography variant="h6" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                A simple workspace to plan your projects, break work into tasks, and track completion
                with a clean, modern UI.
                <br />
                <Box component="span" sx={{ fontWeight: 850, color: 'text.primary' }}>
                  Less clutter — more progress.
                </Box>
              </Typography>
            </MotionBox>

            {/* ACTIONS */}
            <MotionBox
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18 }}
              sx={{ mt: 0.5, width: '100%', maxWidth: 520 }}
            >
              <Stack spacing={1.25}>
                <Button
                  size="large"
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  onClick={() => nav('/auth')}
                  sx={{
                    py: 1.4,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 900,
                    background: 'linear-gradient(90deg, rgba(11,77,255,1), rgba(23,195,178,1))',
                    boxShadow: '0 18px 50px rgba(11,77,255,0.18)',
                    '&:hover': {
                      boxShadow: '0 22px 60px rgba(11,77,255,0.22)'
                    }
                  }}
                >
                  Let’s start
                </Button>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                  <Button
                    fullWidth
                    size="large"
                    variant="outlined"
                    startIcon={<LoginRoundedIcon />}
                    onClick={() => nav('/auth?mode=login')}
                    sx={{
                      py: 1.2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 850,
                      borderColor: 'rgba(15, 23, 42, 0.18)',
                      backgroundColor: 'rgba(255,255,255,0.55)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.70)' }
                    }}
                  >
                    I already have an account
                  </Button>

                  <Button
                    fullWidth
                    size="large"
                    variant="outlined"
                    startIcon={<PlayCircleOutlineRoundedIcon />}
                    onClick={() => nav('/app')}
                    sx={{
                      py: 1.2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 850,
                      borderColor: 'rgba(15, 23, 42, 0.18)',
                      backgroundColor: 'rgba(255,255,255,0.55)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.70)' }
                    }}
                  >
                    Try demo
                  </Button>
                </Stack>
              </Stack>
            </MotionBox>

            {/* INTERACTIVE TIP (no card) */}
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              sx={{
                mt: 0.5,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 1.25,
                py: 0.75,
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.55)',
                border: '1px solid rgba(15, 23, 42, 0.10)'
              }}
            >
              <IconButton size="small" onClick={nextTip} aria-label="next tip">
                <LightbulbOutlinedIcon fontSize="small" />
              </IconButton>
              <motion.div
                key={tip}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  Tip: <Box component="span" sx={{ fontWeight: 650, color: 'text.secondary' }}>{tips[tip]}</Box>
                </Typography>
              </motion.div>
            </MotionBox>

            {/* FOOTER */}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              © {new Date().getFullYear()} TaskFlow
            </Typography>
          </Stack>
        </Box>
      </Container>
    </GradientBackdrop>
  );
}
