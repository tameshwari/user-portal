import  { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, ThemeProvider, CssBaseline, Box, IconButton } from '@mui/material';

import { useTranslation } from 'react-i18next';

import { lightTheme, darkTheme } from './utils/theme';
import { Brightness4, Brightness7 } from '@mui/icons-material';

interface POST {
  id: string, 
  title: string
    }

function App() {
  const { t, i18n } = useTranslation();

  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light'); // Save the theme preference
      return newMode;
    });
  };


  const [users, setUsers] = useState<POST[]>([]);

  useEffect(() => {
    debugger
    // Fetch the mocked data from the API
    const fetchUsers = async () => {
      debugger
      const response = await fetch('/api/users')
      const data = await response.json();
      setUsers(data);
      setLoading(false)
    };

    fetchUsers();
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang); // Change the language
  };

  const [loading, setLoading] = useState(true);



  // useEffect(() => {
  //   // Fetch data from the mock API
  //   fetch('https://jsonplaceholder.typicode.com/posts')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setPosts(data);
  //       setLoading(false);
  //     });
  // }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
       <CssBaseline />
       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            {darkMode ? 'Dark Mode' : 'Light Mode'}
          </Typography>
          <IconButton color="primary" onClick={toggleTheme}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Box>
    <Container>
      <Typography variant="h4" gutterBottom>
       {t('posts')}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>  <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('da')}>Deutsch</button> 
        <List>
          {users?.map((post) => (
            <ListItem key={post.id}>
              <ListItemText primary={post.title} />
            </ListItem>
          ))}
        </List>
        </>
      )}
      
    </Container>
    </ThemeProvider>
  );
}

export default App;
