import { BrowserRouter } from 'react-router-dom';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import BodyRouting from './components/Layout/BodyRouting';
import BodyContent from './components/Layout/BodyContent';

const theme = createTheme({});

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BodyRouting>
          <BodyContent/>
        </BodyRouting>
        
      </ThemeProvider>
    </BrowserRouter>
  );
}
