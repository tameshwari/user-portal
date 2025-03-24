import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
  CssBaseline,
  Box,
  AppBar,
  ThemeProvider,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { LeftNavigationBar } from './components';
import UserOverview from './pages/UserOverview';
import KeyTemplates from './pages/KeyTemplates';
import { lightTheme, darkTheme } from './utils/theme';
import Departments from './pages/Departments';
import Login from './components/Login';
import { ThemeMode } from './utils/constant';
import LanguageSelector from './utils/common/LanguageSelector';
import { useTranslation } from 'react-i18next';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const { t } = useTranslation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === ThemeMode.DARK);
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? ThemeMode.DARK : ThemeMode.LIGHT);
      return newMode;
    });
  };
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Router>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: '#CE0043',
            }}
          >
            <Box sx={{ height: '10px' }}>
              <Box
                display="flex"
                gap={2}
                justifyContent="right"
                alignItems="center"
                sx={{ textAlign: 'right', p: 4 }}
              >
                <LanguageSelector />

                <FormControlLabel
                  control={<Switch defaultChecked onChange={toggleTheme} />}
                  label={t('lightMode')}
                />
              </Box>
            </Box>
          </AppBar>
          <LeftNavigationBar />
          <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
            <Routes>
              <Route
                path="/"
                element={<ProtectedRoute element={<>Open User tab</>} />}
              />

              <Route path="/login" element={<Login />} />
              <Route
                path="/user-overview"
                element={<ProtectedRoute element={<UserOverview />} />}
              />

              <Route
                path="/key-templates"
                element={<ProtectedRoute element={<KeyTemplates />} />}
              />
              <Route
                path="/departments"
                element={<ProtectedRoute element={<Departments />} />}
              />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
