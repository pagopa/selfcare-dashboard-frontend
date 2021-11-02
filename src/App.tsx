import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Layout from './components/Layout/Layout';
import theme from './theme';
import PartySelectionContainer from './pages/partySelectionContainer/PartySelectionContainer';

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <PartySelectionContainer/>
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
}
