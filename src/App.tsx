import Layout from './components/Layout/Layout';
import { withLogin } from './decorators/withLogin';
import PartySelectionContainer from './pages/partySelectionContainer/PartySelectionContainer';

const App = () => (
  <Layout>
    <PartySelectionContainer />
  </Layout>
);

export default withLogin(App);
