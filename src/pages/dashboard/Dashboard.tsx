import { Box } from '@mui/material';
import withSelectedParty from '../../decorators/withSelectedParty';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import ActiveProductsSection from './components/activeProductsSection/ActiveProductsSection';
import NotActiveProductsSection from './components/notActiveProductsSection/NotActiveProductsSection';
import WelcomeDashboard from './components/welcomeDashboard/WelcomeDashboard';

const Dashboard = () => {
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);

  return products ? (
    <Box mb={6} px={10}>
      <WelcomeDashboard />
      <ActiveProductsSection />
      {products && products.findIndex((product) => product.active === false) > -1 && (
        <NotActiveProductsSection />
      )}
    </Box>
  ) : (
    <> </>
  );
};

export default withSelectedParty(Dashboard);
