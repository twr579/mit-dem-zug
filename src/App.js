import React from 'react'
import { CssBaseline, ThemeProvider, Box, Container, Toolbar } from '@mui/material';
import { appTheme } from './themes/theme';
import Header from './components/header';
import CoverPaper from './components/coverPaper';
import BerlinHbf from './images/BerlinHbf.webp';

function App() {
  const bgImage = {
    backgroundImage: `url(${BerlinHbf})`,
    backgroundSize: '100% 85%',
    backgroundRepeat: 'no-repeat',
  };

  appTheme.typography.h3 = {
    [appTheme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
    [appTheme.breakpoints.up('sm')]: {
      fontSize: '1.5rem',
    },
    [appTheme.breakpoints.up('md')]: {
      fontSize: '2rem',
    },
  };

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box
          style={bgImage}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Container maxWidth="md">
            <Header />
            <Toolbar />
            <CoverPaper />
          </Container>
        </Box>
      </Container>
    </ThemeProvider >
  );
}

export default App;
