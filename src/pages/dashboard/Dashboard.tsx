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
        <Box sx={{ backgroundColor: 'background.default' }}>
          <DashboardSideMenu products={products} party={party} />
        </Box>
      </Grid>
      <Grid
        item
        xs={10}
        sx={{ backgroundColor: '#E6E9F2' }}
        display="flex"
        justifyContent="center"
        pb={16}
      >
        <Box sx={{ width: '953px' }}>
          <WelcomeDashboard />
          <Grid container direction="row" justifyContent={'center'}>
            <PartyCard party={party} />
          </Grid>
          <ActiveProductsSection products={products} />
          {products && products.findIndex((product) => product.active === false) > -1 && (
            <NotActiveProductsSection products={products} />
          )}
        </Box>
      </Grid>
    </Grid>
  ) : (
    <> </>
  );
};

export default withSelectedParty(Dashboard);
