import DehazeIcon from '@mui/icons-material/Dehaze';
import { Box, Button, Divider, Drawer, Grid, useMediaQuery, useTheme } from '@mui/material';
import { usePermissions } from '@pagopa/selfcare-common-frontend/lib';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import { Route, Switch, matchPath, useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
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
import DashboardHandleDelegatesPage from '../dashboardHandleDelegatesPage/DashboardHandleDelegatesPage';
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
  const { getAllProductsWithPermission, hasPermission } = usePermissions();
  const { i18n, t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hideLabels, setHideLabels] = useState(false);

  const history = useHistory();
  const location = useLocation();

  const store = useStore();
  const party = useAppSelector(partiesSelectors.selectPartySelected);
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);

  const isPT = party?.institutionType === 'PT';
  const hasDelegation = Boolean(party?.delegation);

  const productsMap: ProductsMap =
    useMemo(() => buildProductsMap(products ?? []), [products]) ?? [];

  const decorators = { withProductRolesMap, withSelectedProduct, withSelectedProductRoles };

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

  const delegableProducts: Array<Product> = activeProducts.filter((product) =>
    party?.products.some(
      (partyProduct) => partyProduct.productId === product.id && product.delegable
    )
  );

  const authorizedDelegableProducts: Array<Product> = delegableProducts.filter((ap) =>
    hasPermission(ap.id ?? '', Actions.AccessProductBackoffice)
  );

  const canAggregatorSeeHandleDelegations = useMemo(() => {
    const aggregatorProduct = party?.products?.find(
      (product) =>
        product.isAggregator &&
        hasPermission(product.productId ?? '', Actions.ViewManagedInstitutions)
    );
    return Boolean(aggregatorProduct && hasDelegation);
  }, [party, hasDelegation]);

  const isInvoiceSectionVisible = !!products?.some(
    (prod) =>
      prod.invoiceable &&
      party?.products.some(
        (partyProd) =>
          partyProd.productId === prod.id && hasPermission(partyProd.productId, Actions.ViewBilling)
      )
  );

  const isAddDelegateSectionVisible =
    ENV.DELEGATIONS.ENABLE &&
    authorizedDelegableProducts.length > 0 &&
    !isPT &&
    getAllProductsWithPermission(Actions.ViewDelegations).length > 0;

  const isHandleDelegationsVisible = useMemo(() => {
    const canDelegateSeeHandleDelegations =
      delegableProducts.length > 0 &&
      (isPT || hasDelegation) &&
      getAllProductsWithPermission(Actions.ViewManagedInstitutions).length > 0;

    return canDelegateSeeHandleDelegations || canAggregatorSeeHandleDelegations;
  }, [
    authorizedDelegableProducts,
    isPT,
    hasDelegation,
    canAggregatorSeeHandleDelegations,
    delegableProducts,
  ]);

  // Check if the current route matches any path in the array
  const paths = [DASHBOARD_ROUTES.ADD_DELEGATE.path, `${ENV.ROUTES.USERS}/add`];

  const match = matchPath(location.pathname, {
    path: paths,
    exact: true,
    strict: false,
  });

  const getButtonText = (pathname: string): string => {
    if (pathname.includes('users')) {
      return t('overview.sideMenu.institutionManagement.referents.title');
    }
    if (pathname.includes('groups')) {
      return t('overview.sideMenu.institutionManagement.groups.title');
    }
    if (pathname.includes('delegations')) {
      return t('overview.sideMenu.institutionManagement.delegations.title');
    }
    if (pathname.includes('delegate')) {
      return t('overview.ptPage.title');
    }
    return t('overview.sideMenu.institutionManagement.overview.title');
  };

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
      {!match &&
        (isMobile ? (
          <>
            <Button
              fullWidth
              disableRipple
              sx={{
                height: '59px',
                justifyContent: 'left',
                boxShadow:
                  'rgba(0, 43, 85, 0.1) 0px 2px 4px -1px, rgba(0, 43, 85, 0.05) 0px 4px 5px !important',
              }}
              onClick={() => setDrawerOpen(true)}
            >
              <DehazeIcon sx={{ marginRight: 2 }} />
              {getButtonText(location.pathname)}
            </Button>
            <Grid>
              <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Grid item xs={2} component="nav" display={'inline-grid'}>
                  <DashboardSideMenu
                    party={party}
                    isAddDelegateSectionVisible={isAddDelegateSectionVisible}
                    isInvoiceSectionVisible={isInvoiceSectionVisible}
                    isHandleDelegationsVisible={isHandleDelegationsVisible}
                    setDrawerOpen={setDrawerOpen}
                    hideLabels={hideLabels}
                  />
                </Grid>
              </Drawer>
            </Grid>
          </>
        ) : (
          <Grid component="nav" item xs={hideLabels ? 1 : 2} position={'relative'}>
            <Box>
              <DashboardSideMenu
                party={party}
                isAddDelegateSectionVisible={isAddDelegateSectionVisible}
                isInvoiceSectionVisible={isInvoiceSectionVisible}
                isHandleDelegationsVisible={isHandleDelegationsVisible}
                setDrawerOpen={setDrawerOpen}
                hideLabels={hideLabels}
              />
              <Box sx={{ position: 'absolute', bottom: '0', width: '100%' }}>
                <Divider sx={{ marginTop: '80px' }} />

                <Button
                  fullWidth
                  // disableRipple
                  sx={{
                    height: '59px',
                    display: 'flex',
                    justifyContent: hideLabels ? 'center' : 'left',
                    my: 3,
                    color: 'text.primary',
                  }}
                  onClick={() => setHideLabels(!hideLabels)}
                >
                  <DehazeIcon sx={{ marginRight: 2 }} />
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}

      <Grid
        item
        component="main"
        sx={{ backgroundColor: 'background.default' }}
        display="flex"
        pb={8}
        xs={12}
        lg={hideLabels ? 11 : 10}
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
            <DashboardHandleDelegatesPage party={party} />
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
