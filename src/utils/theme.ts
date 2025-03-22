// src/theme.ts

import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976πd2', // Blue color
    },
    background: {
      default: '#ffffff',
      paper: '#f4f6f8',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Light Blue color for dark mode
    },
    background: {
      default: '#121212',
      paper: '#333333',
    },
  },
});
