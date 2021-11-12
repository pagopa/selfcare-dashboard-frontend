import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Party } from './model/Party';

import Layout from './components/Layout/Layout';
import theme from './theme';
import CardUser from './pages/CardUser';

export function App() {
  const party: Party = {
    role: 'Manager',
    description: 'Comune di Milano',
    image: 'image',
    status: 'Pending',
    institutionId: '1',
    attributes: ['Ente Locale'],
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <CardUser party={party} />
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
}
