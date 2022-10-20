import { Grid, Box, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { Route, Switch, useHistory } from 'react-router';
import { useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import withSelectedParty from '../../decorators/withSelectedParty';
import withProductRolesMap from '../../decorators/withProductsRolesMap';
import withSelectedProduct from '../../decorators/withSelectedPartyProduct';
import withSelectedProductRoles from '../../decorators/withSelectedPartyProductAndRoles';
import RemoteRoutingUsers from '../../microcomponents/users/RemoteRoutingUsers';
import RemoteRoutingProductUsers from '../../microcomponents/users/RemoteRoutingProductUsers';
import { Party } from '../../model/Party';
import { buildProductsMap, Product, ProductsMap } from '../../model/Product';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import { DASHBOARD_ROUTES, RouteConfig, RoutesObject } from '../../routes';
import { ENV } from '../../utils/env';
import RemoteRoutingGroups from '../../microcomponents/groups/RemoteRoutingGroups';
import DashboardSideMenu from './components/dashboardSideMenu/DashboardSideMenu';

export type DashboardPageProps = {
  party: Party;
  products: Array<Product>;
  activeProducts: Array<Product>;
  productsMap: ProductsMap;
};

export type DashboardDecoratorsType = {
  withProductRolesMap: (WrappedComponent: React.ComponentType<any>) => React.ComponentType<any>;
  withSelectedProduct: (WrappedComponent: React.ComponentType<any>) => React.ComponentType<any>;
  withSelectedProductRoles: (
    WrappedComponent: React.ComponentType<any>
  ) => React.ComponentType<any>;
};

const reduceDecorators = (
  decorators: DashboardDecoratorsType,
  route: RouteConfig
): ((WrappedComponent: React.ComponentType<any>) => React.ComponentType<any>) =>
  ['withProductRolesMap', 'withSelectedProductRoles', 'withSelectedProduct'].reduce(
    (out, decorator) =>
      (route as any)[decorator]
        ? (WrappedComponent: React.ComponentType<any>) =>
            (decorators as any)[decorator](out(WrappedComponent))
        : out,
    (WrappedComponent: React.ComponentType<any>) => WrappedComponent
  );

export const buildRoutes = (
  party: Party,
  products: Array<Product>,
  activeProducts: Array<Product>,
  productsMap: ProductsMap,
  decorators: DashboardDecoratorsType,
  rs: RoutesObject
) =>
  Object.values(rs).map((route, i) => {
    const { path, exact, component: Component, subRoutes } = route;
    const decoratorResult = Component ? reduceDecorators(decorators, route) : undefined;
    const WrappedComponent = Component && decoratorResult ? decoratorResult(Component) : undefined;
    return (
      <Route path={path} exact={exact} key={i}>
        {WrappedComponent && (
          <WrappedComponent
            party={party}
            products={products}
            activeProducts={activeProducts}
            productsMap={productsMap}
          />
        )}
        {subRoutes && (
          <Switch>
            {buildRoutes(party, products, activeProducts, productsMap, decorators, subRoutes)}
          </Switch>
        )}
      </Route>
    );
  });

const Dashboard = () => {
  const history = useHistory();
  const party = useAppSelector(partiesSelectors.selectPartySelected);
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);
  const store = useStore();
  const theme = useTheme();
  const { i18n } = useTranslation();

  const activeProducts: Array<Product> =
    useMemo(() => products?.filter((p) => p.status === 'ACTIVE'), [products]) ?? [];

  const productsMap: ProductsMap =
    useMemo(() => buildProductsMap(products ?? []), [products]) ?? [];

  const decorators = { withProductRolesMap, withSelectedProduct, withSelectedProductRoles };

  return party && products ? (
    <Grid container item xs={12} sx={{ backgroundColor: 'background.paper' }}>
      <Grid component="nav" item xs={2}>
        <Box>
          <DashboardSideMenu products={products} party={party} />
        </Box>
      </Grid>
      <Grid
        item
        component="main"
        xs={10}
        sx={{ backgroundColor: '#F5F6F7' }}
        display="flex"
        justifyContent="center"
        pb={8}
      >
        <Switch>
          <Route path={ENV.ROUTES.USERS} exact={false}>
            <RemoteRoutingUsers
              party={party}
              products={products}
              activeProducts={activeProducts}
              productsMap={productsMap}
              history={history}
              store={store}
              theme={theme}
              i18n={i18n}
              decorators={decorators}
            />
          </Route>
          <Route path={ENV.ROUTES.PRODUCT_USERS} exact={false}>
            <RemoteRoutingProductUsers
              party={party}
              products={products}
              activeProducts={activeProducts}
              productsMap={productsMap}
              history={history}
              store={store}
              theme={theme}
              i18n={i18n}
              decorators={decorators}
            />
          </Route>
          <Route path={ENV.ROUTES.GROUPS} exact={false}>
            <RemoteRoutingGroups
              party={party}
              products={products}
              activeProducts={activeProducts}
              productsMap={productsMap}
              history={history}
              store={store}
              theme={theme}
              i18n={i18n}
              decorators={decorators}
            />
          </Route>
          {buildRoutes(party, products, activeProducts, productsMap, decorators, DASHBOARD_ROUTES)}
        </Switch>
      </Grid>
    </Grid>
  ) : (
    <> </>
  );
};

export default withSelectedParty(Dashboard);
