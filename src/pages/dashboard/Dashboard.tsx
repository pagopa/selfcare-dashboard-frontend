import { Grid, Box } from '@mui/material';
import withSelectedParty from '../../decorators/withSelectedParty';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import DashboardOverview from '../dashboardOverview/DashboardOverview';
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
        <DashboardOverview party={party} products={products} />
      </Grid>
    </Grid>
  ) : (
    <> </>
  );
};

export default withSelectedParty(Dashboard);
