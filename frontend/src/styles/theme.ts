import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0B4DFF' },
    secondary: { main: '#17C3B2' },
    background: { default: '#F7FAFF', paper: 'rgba(255,255,255,0.75)' },
    success: { main: '#1DBA74' },
    warning: { main: '#FFB703' },
    error: { main: '#EF4444' },
    text: { primary: '#0B1020', secondary: '#4B5563' }
  },
  // Slightly rounded (professional, not "pill" everywhere)
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: [
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Helvetica',
      'Arial'
    ].join(','),
    h1: { fontSize: '3rem', fontWeight: 800, letterSpacing: -1 },
    h2: { fontSize: '2.25rem', fontWeight: 800, letterSpacing: -0.5 },
    h3: { fontSize: '1.6rem', fontWeight: 800 },
    button: { textTransform: 'none', fontWeight: 700 }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(15, 23, 42, 0.08)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, paddingInline: 16, paddingBlock: 10 }
      }
    }
  }
});
