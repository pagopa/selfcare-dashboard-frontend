import { Grid, useMediaQuery, useTheme } from '@mui/material';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import { Route, Switch, matchPath, useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';

import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import { DASHBOARD_ROUTES } from '../../routes';
import { ENV } from '../../utils/env';

import withProductRolesMap from '../../decorators/withProductsRolesMap';
import withSelectedParty from '../../decorators/withSelectedParty';
import withSelectedProduct from '../../decorators/withSelectedPartyProduct';
import withSelectedProductRoles from '../../decorators/withSelectedPartyProductAndRoles';

import RemoteRoutingAdmin from '../../microcomponents/admin/RemoteRoutingAdmin';
import RemoteRoutingGroups from '../../microcomponents/groups/RemoteRoutingGroups';
import RemoteRoutingProductUsers from '../../microcomponents/users/RemoteRoutingProductUsers';
import RemoteRoutingUsers from '../../microcomponents/users/RemoteRoutingUsers';

import DashboardDelegationsPage from '../dashboardDelegations/DashboardDelegationsPage';
import AddDelegationPage from '../dashboardDelegations/dashboardDelegationsAdd/AddDelegationPage';
import DashboardDocuments from '../dashboardDocuments/DashboardDocumentsPage';
import DashboardDocumentsDetail from '../dashboardDocumentsDetail/DashboardDocumentsDetailPage';
import DashboardHandleDelegatesPage from '../dashboardHandleDelegatesPage/DashboardHandleDelegatesPage';

import { Party } from '../../model/Party';
import { Product, ProductsMap } from '../../model/Product';
import DashboardSideMenuDesktop from './components/dashboardSideMenu/DashboardSideMenuDesktop';
import DashboardSideMenuMobile from './components/dashboardSideMenu/DashboardSideMenuMobile';
import { useDashboardData } from './hooks/useDashboardData';
import { buildRoutes } from './utils/dashboard-utils';

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

const Dashboard: React.FC = () => {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hideLabels, setHideLabels] = useState(false);

  const history = useHistory();
  const location = useLocation();
  const store = useStore();

  const party = useAppSelector(partiesSelectors.selectPartySelected);
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);
  const institutionTypes = useAppSelector(partiesSelectors.selectPartySelectedInstitutionTypes);

  const {
    activeOnboardings,
    productsMap,
    activeProducts,
    delegableProducts,
    authorizedDelegableProducts,
    isPTTheOnlyType,
    isPTOnAnyOnboarding,
    hasDelegation,
    getAllProductsWithPermission,
    hasPermission,
  } = useDashboardData(party, products, institutionTypes);

  const decorators = { withProductRolesMap, withSelectedProduct, withSelectedProductRoles };

  const canAggregatorSeeHandleDelegations = useMemo(() => {
    const aggregatorProduct = activeOnboardings.find(
      (product) =>
        (product as any)?.isAggregator &&
        hasPermission(product.productId || '', Actions.ViewManagedInstitutions)
    );
    return Boolean(aggregatorProduct && hasDelegation);
  }, [activeOnboardings, hasDelegation, hasPermission]);

  const isInvoiceSectionVisible = !!(products ?? []).some(
    (prod) =>
      prod.invoiceable &&
      activeOnboardings.some(
        (partyProd) =>
          partyProd.productId === prod.id && hasPermission(partyProd.productId, Actions.ViewBilling)
      )
  );

  const isDocumentsSectionVisible =
    ENV.SHOW_DOCUMENTS &&
    activeProducts.some((p) => hasPermission(p.id ?? '', Actions.ViewContract));

  const isAddDelegateSectionVisible =
    ENV.DELEGATIONS.ENABLE &&
    authorizedDelegableProducts.length > 0 &&
    !isPTTheOnlyType &&
    getAllProductsWithPermission(Actions.ViewDelegations).length > 0;

  const canDelegateSeeHandleDelegations =
    delegableProducts.length > 0 &&
    (isPTOnAnyOnboarding || hasDelegation) &&
    getAllProductsWithPermission(Actions.ViewManagedInstitutions).length > 0;

  const isHandleDelegationsVisible =
    canDelegateSeeHandleDelegations || canAggregatorSeeHandleDelegations;

  const paths = [
    DASHBOARD_ROUTES.ADD_DELEGATE.path,
    `${ENV.ROUTES.USERS}/add`,
    `${ENV.ROUTES.USERS}/:userId/edit`,
    `${ENV.ROUTES.USERS}/:userId/add-product`,
  ];
  const match = matchPath(location.pathname, { path: paths, exact: true, strict: false });

  if (!party || !products) {
    return <></>;
  }

  return (
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
          <DashboardSideMenuMobile
            party={party}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            hideLabels={hideLabels}
            isAddDelegateSectionVisible={isAddDelegateSectionVisible}
            isInvoiceSectionVisible={isInvoiceSectionVisible}
            isHandleDelegationsVisible={isHandleDelegationsVisible}
            isDocumentsSectionVisible={isDocumentsSectionVisible}
            currentPathname={location.pathname}
          />
        ) : (
          <DashboardSideMenuDesktop
            party={party}
            hideLabels={hideLabels}
            setHideLabels={setHideLabels}
            setDrawerOpen={setDrawerOpen}
            isAddDelegateSectionVisible={isAddDelegateSectionVisible}
            isInvoiceSectionVisible={isInvoiceSectionVisible}
            isHandleDelegationsVisible={isHandleDelegationsVisible}
            isDocumentsSectionVisible={isDocumentsSectionVisible}
          />
        ))}

      <Grid
        item
        component="main"
        sx={{ backgroundColor: 'background.default', minHeight: '100%' }}
        display="flex"
        justifyContent={match ? 'center' : 'flex-start'}
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

          <Route path={DASHBOARD_ROUTES.ADD_DELEGATE.path} exact>
            <AddDelegationPage
              authorizedDelegableProducts={authorizedDelegableProducts}
              party={party}
            />
          </Route>

          <Route path={DASHBOARD_ROUTES.DELEGATIONS.path} exact>
            <DashboardDelegationsPage
              party={party}
              authorizedDelegableProducts={authorizedDelegableProducts}
            />
          </Route>

          <Route path={DASHBOARD_ROUTES.TECHPARTNER.path} exact>
            <DashboardHandleDelegatesPage party={party} />
          </Route>

          <Route path={DASHBOARD_ROUTES.DOCUMENTS.path} exact>
            <DashboardDocuments party={party} products={products} />
          </Route>

          <Route path={DASHBOARD_ROUTES.DOCUMENTS_DETAIL.path} exact>
            <DashboardDocumentsDetail party={party} products={products} />
          </Route>

          {buildRoutes(party, products, activeProducts, productsMap, decorators, DASHBOARD_ROUTES)}
        </Switch>
      </Grid>
    </Grid>
  );
};

export default withSelectedParty(Dashboard);
