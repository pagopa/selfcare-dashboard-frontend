import React from 'react';
import { DashboardDecoratorsType } from '../pages/dashboard/Dashboard';
import { DashboardPageProps, MicroserviceProps } from './RemoteRoutingUsers';

type Props = {
  decorators: DashboardDecoratorsType;
} & DashboardPageProps &
  MicroserviceProps;

const RemoteRoutingProductUsers = React.lazy(() => import('selfcareUsers/RoutingProductUsers'));

export default ({
  history,
  store,
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
      decorators={decorators}
      party={party}
      products={products}
      activeProducts={activeProducts}
      productsMap={productsMap}
    />
  </React.Suspense>
);
