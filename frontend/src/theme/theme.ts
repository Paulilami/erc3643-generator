import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#000000' : '#FFFFFF',
      },
      secondary: {
        main: '#FD4319',
      },
      background: {
        default: mode === 'light' ? '#FFFFFF' : '#000000',
        paper: mode === 'light' ? '#FAFAFA' : '#0A0A0A',
      },
      text: {
        primary: mode === 'light' ? '#000000' : '#FFFFFF',
        secondary: mode === 'light' ? '#666666' : '#A0A0A0',
      },
      divider: mode === 'light' ? '#E5E5E5' : '#333333',
      success: {
        main: mode === 'light' ? '#1e7e34' : '#4ade80',
      },
    },
    typography: {
      fontFamily: '"Questrial", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '3.5rem',
        fontWeight: 600,
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.125rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 8,
            padding: '10px 20px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: 'none',
            border: `1px solid ${mode === 'light' ? '#E5E5E5' : '#333333'}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: `1px solid ${mode === 'light' ? '#E5E5E5' : '#333333'}`,
          },
        },
      },
    },
  });
};