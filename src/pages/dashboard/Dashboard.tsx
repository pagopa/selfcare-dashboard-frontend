import { Box, Grid, useTheme } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import { Route, Switch, matchPath, useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import withProductRolesMap from '../../decorators/withProductsRolesMap';
import withSelectedParty from '../../decorators/withSelectedParty';
import withSelectedProduct from '../../decorators/withSelectedPartyProduct';
import withSelectedProductRoles from '../../decorators/withSelectedPartyProductAndRoles';
import RemoteRoutingAdmin from '../../microcomponents/admin/RemoteRoutingAdmin';
import RemoteRoutingGroups from '../../microcomponents/groups/RemoteRoutingGroups';
import RemoteRoutingProductUsers from '../../microcomponents/users/RemoteRoutingProductUsers';
import RemoteRoutingUsers from '../../microcomponents/users/RemoteRoutingUsers';
import { Party } from '../../model/Party';
import { Product, ProductsMap, buildProductsMap } from '../../model/Product';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import { DASHBOARD_ROUTES, RouteConfig, RoutesObject } from '../../routes';
import { ENV } from '../../utils/env';
import DashboardDelegationsPage from '../dashboardDelegations/DashboardDelegationsPage';
import AddDelegationPage from '../dashboardDelegationsAdd/AddDelegationPage';
import DashboardTechnologyPartnerPage from '../dashboardTechnologyPartnerPage/DashboardTechnologyPartnerPage';
import { LOADING_TASK_TECH_PARTNER_DASHBOARD } from '../../utils/constants';
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

// eslint-disable-next-line sonarjs/cognitive-complexity
const Dashboard = () => {
  const history = useHistory();
  const parties = useAppSelector(partiesSelectors.selectPartiesList);
  const party = useAppSelector(partiesSelectors.selectPartySelected);
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);
  const store = useStore();
  const theme = useTheme();
  const { i18n } = useTranslation();
  const setLoading = useLoading(LOADING_TASK_TECH_PARTNER_DASHBOARD);

  const activeProducts: Array<Product> =
    useMemo(
      () =>
        products?.filter((p) =>
          party?.products.some(
            (ap) =>
              ap.productId === p.id &&
              ap.productOnBoardingStatus === 'ACTIVE' &&
              p.status !== 'INACTIVE'
          )
        ),
      [products, party]
    ) ?? [];

  const authorizedDelegableProducts: Array<Product> = activeProducts.filter((ap) =>
    party?.products.some(
      (p) => p.productId === ap.id && p.authorized && p.userRole === 'ADMIN' && ap.delegable
    )
  );

  const isInvoiceSectionVisible = !!products?.some(
    (prod) =>
      prod.invoiceable &&
      party?.products.some((partyProd) => partyProd.productId === prod.id && partyProd.userRole)
  );

  const productsMap: ProductsMap =
    useMemo(() => buildProductsMap(products ?? []), [products]) ?? [];

  const decorators = { withProductRolesMap, withSelectedProduct, withSelectedProductRoles };
  const canSeeSection = parties?.find((p) => p.partyId === party?.partyId)?.userRole === 'ADMIN';

  const isDelegateSectionVisible =
    ENV.DELEGATIONS.ENABLE &&
    authorizedDelegableProducts.length > 0 &&
    party?.institutionType !== 'PT';

  const location = useLocation();

  const match = matchPath(location.pathname, {
    path: [DASHBOARD_ROUTES.ADD_DELEGATE.path],
    exact: true,
    strict: false,
  });

  useEffect(() => {
    if (party?.partyId && party?.delegation) {
      setLoading(true);
      history.push(
        resolvePathVariables(DASHBOARD_ROUTES.TECHPARTNER.path, { partyId: party.partyId })
      );
      setLoading(false);
    }
  }, [party?.partyId]);

  return party && products ? (
    <Grid
      container
      item
      xs={12}
      sx={{
        backgroundColor: match ? 'background.default' : 'background.paper',
        justifyContent: match && 'center',
      }}
    >
      {!match && (
        <Grid component="nav" item xs={2}>
          <Box>
            <DashboardSideMenu
              party={party}
              isDelegateSectionVisible={isDelegateSectionVisible}
              canSeeSection={canSeeSection}
              isInvoiceSectionVisible={isInvoiceSectionVisible}
            />
          </Box>
        </Grid>
      )}

      <Grid
        item
        component="main"
        xs={10}
        sx={{ backgroundColor: 'background.default' }}
        display="flex"
        pb={8}
      >
        <Switch>
          <Route path={ENV.ROUTES.ADMIN} exact={false}>
            <RemoteRoutingAdmin
              history={history}
              store={store}
              theme={theme}
              i18n={i18n}
              decorators={decorators}
            />
          </Route>
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
          <Route path={DASHBOARD_ROUTES.ADD_DELEGATE.path} exact={true}>
            <AddDelegationPage
              authorizedDelegableProducts={authorizedDelegableProducts}
              party={party}
            />
          </Route>
          <Route path={DASHBOARD_ROUTES.DELEGATIONS.path} exact={true}>
            <DashboardDelegationsPage
              party={party}
              authorizedDelegableProducts={authorizedDelegableProducts}
            />
          </Route>
          <Route path={DASHBOARD_ROUTES.TECHPARTNER.path} exact={true}>
            <DashboardTechnologyPartnerPage
              canSeeSection={canSeeSection}
              party={party}
              ptProducts={activeProducts}
              isDelegateSectionVisible={isDelegateSectionVisible}
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
