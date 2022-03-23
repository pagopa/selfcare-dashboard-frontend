import React from 'react';
import { DashboardDecoratorsType, DashboardPageProps } from '../pages/dashboard/Dashboard';
import { MicroComponentsProps } from './dashboardMicrocomponentsUtils';

type Props = {
  decorators: DashboardDecoratorsType;
} & DashboardPageProps &
  MicroComponentsProps;

const RemoteRoutingProductUsers = React.lazy(() => import('selfcareUsers/RoutingProductUsers'));

export default ({
  history,
  store,
  theme,
  decorators,
  party,
  products,
  activeProducts,
  productsMap,
}: Props) => (
  <React.Suspense fallback="Loading RoutingProductUsers">
    <RemoteRoutingProductUsers
      history={history}
      store={store}
      theme={theme}
      decorators={decorators}
      party={party}
      products={products}
      activeProducts={activeProducts}
      productsMap={productsMap}
    />
  </React.Suspense>
);
