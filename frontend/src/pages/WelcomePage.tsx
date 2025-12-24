import { motion } from 'framer-motion';
import {
  Box,
  Button,
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
      'One click to toggle tasks. Done or not done.'
    ],
    []
  );

  const nextTip = () => setTip((t) => (t + 1) % tips.length);

  return (
    <GradientBackdrop>
      {/* FULL SCREEN ROOT */}
      <Box
        sx={{
          minHeight: '60dvh',
          width: '100%',
          display: 'grid',
          placeItems: 'center',
          px: { xs: 2, sm: 4, md: 8, lg: 12 },
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            display: 'grid',
            placeItems: 'center'
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: -120,
              pointerEvents: 'none',
              opacity: 0.95,
              backgroundImage: `
                radial-gradient(circle at 15% 30%, rgba(11,77,255,0.16), transparent 55%),
                radial-gradient(circle at 85% 25%, rgba(23,195,178,0.16), transparent 60%),
                radial-gradient(circle at 55% 90%, rgba(11,77,255,0.12), transparent 65%)
              `
            }}
          />

          <Stack
            spacing={{ xs: 1.6, sm: 2.8 }}
            alignItems="center"
            sx={{
              textAlign: 'center',
              position: 'relative',
              width: '100%'
            }}
          >
            <MotionBox
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Box
                component="img"
                src="/TaskFlowLogo2.png"
                alt="TaskFlow"
                sx={{
                  width: 'auto',
                  maxWidth: { xs: '90vw', md: '60vw', lg: '45vw' },
                  height: 'auto',
                  filter: `
                    drop-shadow(0 22px 50px rgba(11,77,255,0.30))
                    drop-shadow(0 8px 16px rgba(0,0,0,0.08))
                  `
                }}
              />
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
            >
              <Typography
                sx={{
                  fontWeight: 950,
                  letterSpacing: { xs: -1, sm: -1.8 },
                  lineHeight: 1.05,
                  fontSize: { xs: 36, sm: 56, md: 72, lg: 84 }
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

            <MotionBox
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              sx={{ maxWidth: 960 }}
            >
              <Typography
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.5,
                  fontSize: { xs: 15, sm: 19, md: 21 }
                }}
              >
                A simple workspace to plan your projects, break work into tasks, and track completion
                with a clean, modern UI.
                <br />
                <Box component="span" sx={{ fontWeight: 850, color: 'text.primary' }}>
                  Less clutter — more progress.
                </Box>
              </Typography>
            </MotionBox>
            <MotionBox
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              sx={{ width: '100%', maxWidth: 680 }}
            >
              <Stack spacing={1.3}>
                <Button
                  size="large"
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  onClick={() => nav('/auth')}
                  sx={{
                    py: 1.5,
                    borderRadius: 2.5,
                    textTransform: 'none',
                    fontWeight: 900,
                    fontSize: 18,
                    background: 'linear-gradient(90deg, #0B4DFF, #17C3B2)',
                    boxShadow: '0 22px 60px rgba(11,77,255,0.22)'
                  }}
                >
                  Let’s start
                </Button>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.3}>
                  <Button
                    fullWidth
                    size="large"
                    variant="outlined"
                    startIcon={<LoginRoundedIcon />}
                    onClick={() => nav('/auth?mode=login')}
                    sx={{
                      py: 1.3,
                      borderRadius: 2.5,
                      fontWeight: 850,
                      fontSize: 16,
                      backgroundColor: 'rgba(255,255,255,0.6)'
                    }}
                  >
                    I already have an account
                  </Button>

                  <Button
                    fullWidth
                    size="large"
                    variant="outlined"
                    startIcon={<PlayCircleOutlineRoundedIcon />}
                    onClick={() => nav('/dashboard')}
                    sx={{
                      py: 1.3,
                      borderRadius: 2.5,
                      fontWeight: 850,
                      fontSize: 16,
                      backgroundColor: 'rgba(255,255,255,0.6)'
                    }}
                  >
                    Try demo
                  </Button>
                </Stack>
              </Stack>
            </MotionBox>

            {/* TIP */}
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              sx={{
                mt: 0.4,
                display: { xs: 'none', sm: 'inline-flex' },
                alignItems: 'center',
                gap: 1,
                px: 1.6,
                py: 0.9,
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(15, 23, 42, 0.12)'
              }}
            >
              <IconButton size="small" onClick={nextTip}>
                <LightbulbOutlinedIcon fontSize="small" />
              </IconButton>

              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                Tip:{' '}
                <Box component="span" sx={{ fontWeight: 650, color: 'text.secondary' }}>
                  {tips[tip]}
                </Box>
              </Typography>
            </MotionBox>

            {/* FOOTER */}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.6 }}>
              © {new Date().getFullYear()} TaskFlow
            </Typography>
          </Stack>
        </Box>
      </Box>
    </GradientBackdrop>
  );
}
