import Layout from './components/Layout/Layout';
import { LoadingOverlay } from './components/Loading/LoadingOverlay';
import withLogin from './decorators/withLogin';
import withParties from './decorators/withParties';
import PartySelectionContainer from './pages/partySelectionContainer/PartySelectionContainer';

const App = () => (
  <Layout>
    <LoadingOverlay />
    <PartySelectionContainer />
  </Layout>
);

export default withParties(withLogin(App));
