import Layout from './components/Layout/Layout';
import { LoadingOverlay } from './components/Loading/LoadingOverlay';
import withLogin from './decorators/withLogin';
import withParties from './decorators/withParties';
import PartySelectionContainer from './pages/partySelectionContainer/PartySelectionContainer';
import { useAppSelector } from './redux/hooks';
import { appStateSelectors } from './redux/slices/appStateSlice';

const App = () => {
  const loading = useAppSelector(appStateSelectors.selectLoading);

  return (
    <Layout>
      {loading && <LoadingOverlay />}
      <PartySelectionContainer />
    </Layout>
  );
};

export default withParties(withLogin(App));
