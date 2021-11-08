import Layout from './components/Layout/Layout';
import { withLogin } from './decorators/withLogin';
import PartySelection from './pages/partySelection/PartySelection';

const app = function App() {
  return (
    <Layout>
      <PartySelection />
    </Layout>
  );
};

export default withLogin(app);
