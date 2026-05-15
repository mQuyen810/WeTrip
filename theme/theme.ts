'use client'

import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#2563eb',
    },

    secondary: {
      main: '#7c3aed',
    },

    background: {
      default: '#f5f7fb',
      paper: '#ffffff',
    },
  },

  shape: {
    borderRadius: 16,
  },

  typography: {
    fontFamily: 'Inter, sans-serif',

    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },

    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },

    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 20,
          paddingBlock: 10,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
  },
})

export default theme