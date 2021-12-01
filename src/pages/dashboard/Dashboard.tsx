import { Grid, Box } from '@mui/material';
import { Route, Switch } from 'react-router';
import withSelectedParty from '../../decorators/withSelectedParty';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import { DASHBOARD_ROUTES, RoutesObject } from '../../routes';
import DashboardSideMenu from './components/dashboardSideMenu/DashboardSideMenu';

const buildRoutes = (party: Party, products: Array<Product>, rs: RoutesObject) =>
  Object.values(rs).map(({ path, exact, component: Component, subRoutes }, i) => (
    <Route path={path} exact={exact} key={i}>
      {Component && <Component party={party} products={products} />}
      {subRoutes && buildRoutes(party, products, subRoutes)}
    </Route>
  ));

const Dashboard = () => {
  const party = useAppSelector(partiesSelectors.selectPartySelected);
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);

  return party && products ? (
    <Grid container item pl={10} xs={12}>
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
        <Switch>{buildRoutes(party, products, DASHBOARD_ROUTES)}</Switch>
      </Grid>
    </Grid>
  ) : (
    <> </>
  );
};

export default withSelectedParty(Dashboard);
