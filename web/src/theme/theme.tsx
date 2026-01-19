'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#faf8f3',
      paper: '#ffffff',
    },
    primary: {
      main: '#c97d60',
      light: '#d99a84',
      dark: '#a0522d',
    },
    secondary: {
      main: '#8b7355',
      light: '#a68f73',
      dark: '#6b5a42',
    },
    success: {
      main: '#6b8e6b',
      light: '#8ba88b',
      dark: '#4d6b4d',
    },
    error: {
      main: '#b85c57',
      light: '#c97d78',
      dark: '#8b4542',
    },
    warning: {
      main: '#d4a574',
      light: '#e0b890',
      dark: '#b8874f',
    },
    text: {
      primary: '#3d3d3d',
      secondary: '#6b6b6b',
    },
    divider: '#e8e0d6',
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Inter, Roboto, "Segoe UI", sans-serif',
    h1: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
  },
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
