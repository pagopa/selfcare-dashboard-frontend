import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Layout from './components/Layout/Layout';
import PartySelection from './pages/partySelection/PartySelection';
import theme from './theme';

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <PartySelection/>
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
}
