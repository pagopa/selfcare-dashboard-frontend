import Layout from './components/Layout/Layout';
import { withLogin } from './decorators/withLogin';
import PartySelection from './pages/partySelection/PartySelection';

const App = () => (
  <Layout>
    <PartySelection />
  </Layout>
);

export default withLogin(App);
