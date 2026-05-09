import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './app/App';
import './styles/index.css';

const appTheme = createTheme({
  palette: {
    primary: { main: '#2563eb' },
    secondary: { main: '#0f766e' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          minHeight: 40,
          paddingInline: 16,
          transition: 'all 0.18s ease',
        },
        contained: {
          boxShadow: '0 6px 14px rgba(37, 99, 235, 0.2)',
        },
        containedPrimary: {
          background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
          '&:hover': {
            background: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)',
            transform: 'translateY(-1px)',
            boxShadow: '0 10px 20px rgba(37, 99, 235, 0.24)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
            background: '#f8fafc',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '&:hover': {
            backgroundColor: '#eff6ff',
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
