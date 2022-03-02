import { Grid, Box } from '@mui/material';
import { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import withSelectedParty from '../../decorators/withSelectedParty';
import { Party } from '../../model/Party';
import { buildProductsMap, Product, ProductsMap } from '../../model/Product';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import { DASHBOARD_ROUTES, RoutesObject } from '../../routes';
import DashboardSideMenu from './components/dashboardSideMenu/DashboardSideMenu';

const buildRoutes = (
  party: Party,
  products: Array<Product>,
  activeProducts: Array<Product>,
  productsMap: ProductsMap,
  rs: RoutesObject
) =>
  Object.values(rs).map(({ path, exact, component: Component, subRoutes }, i) => (
    <Route path={path} exact={exact} key={i}>
      {Component && (
        <Component
          party={party}
          products={products}
          activeProducts={activeProducts}
          productsMap={productsMap}
        />
      )}
      {subRoutes && (
        <Switch>{buildRoutes(party, products, activeProducts, productsMap, subRoutes)}</Switch>
      )}
    </Route>
  ));

const Dashboard = () => {
  const party = useAppSelector(partiesSelectors.selectPartySelected);
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);

  const activeProducts: Array<Product> =
    useMemo(() => products?.filter((p) => p.status === 'ACTIVE'), [products]) ?? [];

  const productsMap: ProductsMap =
    useMemo(() => buildProductsMap(products ?? []), [products]) ?? [];

  return party && products ? (
    <Grid container item pl={{ xs: 4, md: 5, lg: 10 }} xs={12}>
      <Grid item xs={2}>
        <Box sx={{ backgroundColor: 'background.default' }}>
          <DashboardSideMenu products={products} party={party} />
        </Box>
      </Grid>
      <Grid
        item
        xs={10}
        sx={{ backgroundColor: '#F5F6F7' }}
        display="flex"
        justifyContent="center"
        pb={16}
      >
        <Switch>
          {buildRoutes(party, products, activeProducts, productsMap, DASHBOARD_ROUTES)}
        </Switch>
      </Grid>
    </Grid>
  ) : (
    <> </>
  );
};

export default withSelectedParty(Dashboard);
