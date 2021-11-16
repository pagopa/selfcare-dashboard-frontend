import { Grid, Box } from '@mui/material';
import withSelectedParty from '../../decorators/withSelectedParty';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import ActiveProductsSection from './components/activeProductsSection/ActiveProductsSection';
import NotActiveProductsSection from './components/notActiveProductsSection/NotActiveProductsSection';
import WelcomeDashboard from './components/welcomeDashboard/WelcomeDashboard';
import PartyCard from './components/partyCard/PartyCard';
import DashboardSideMenu from './components/dashboardSideMenu/DashboardSideMenu';

const Dashboard = () => {
  const party = useAppSelector(partiesSelectors.selectPartySelected);
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);

  return party && products ? (
    <Grid container pl={10}>
      <Grid item xs={2}>
        <Box sx={{ backgroundColor: '#FFFFFF', height: '2148px' }}>
          <DashboardSideMenu />
        </Box>
      </Grid>
      <Grid item xs={10} px={10} sx={{ backgroundColor: '#E6E9F2' }}>
        <Box>
          <WelcomeDashboard />
          <Grid container direction="row" justifyContent={'center'}>
            <PartyCard party={party} isAdminRef={true} />
          </Grid>
          <ActiveProductsSection />
          {products && products.findIndex((product) => product.active === false) > -1 && (
            <NotActiveProductsSection />
          )}
        </Box>
      </Grid>
    </Grid>
  ) : (
    <> </>
  );
};

export default withSelectedParty(Dashboard);
