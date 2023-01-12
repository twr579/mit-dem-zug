import React from 'react'
import { CssBaseline, ThemeProvider, responsiveFontSizes, Box, Toolbar } from '@mui/material';
import { appTheme } from './themes/theme';
import Header from './components/header';
import BerlinHbf from './images/BerlinHbf.webp';

function App() {
  const bgImage = {
    backgroundImage: `url(${BerlinHbf})`,
    height: '100vh',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  }

  return (
    <ThemeProvider theme={responsiveFontSizes(appTheme)}>
      <CssBaseline />
      <Box style={bgImage}>
        <Header />
        <Toolbar />
      </Box>
    </ThemeProvider >
  );
}

export default App;
