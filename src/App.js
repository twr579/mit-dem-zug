import { useEffect } from 'react'
import { CssBaseline, ThemeProvider, Box, Container, Toolbar, responsiveFontSizes, Backdrop, CircularProgress } from '@mui/material';
import { appTheme } from './themes/theme';
import Header from './components/header/header';
import CoverPaper from './components/coverPaper/coverPaper';
import BerlinHbf from './images/BerlinHbf.webp';
import DestinationsList from './components/destinationsList/destinationsList';
import { useSelector } from 'react-redux';
import i18next from 'i18next';
import './locales/i18n';

function App() {
  const bgImage = {
    backgroundImage: `url(${BerlinHbf})`,
    backgroundSize: '100% 85%',
    backgroundRepeat: 'no-repeat',
  };

  const status = useSelector((state) => state.destinations.status);
  const language = useSelector((state) => state.language);

  useEffect(() => {
    i18next.changeLanguage(language);
  }, [language]);

  return (
    <ThemeProvider theme={responsiveFontSizes(appTheme)}>
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
        <DestinationsList />
        <Backdrop
          sx={{ color: "#fff" }}
          open={status === "loading"}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </ThemeProvider >
  );
}

export default App;
