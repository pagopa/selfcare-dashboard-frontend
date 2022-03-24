import React from 'react';
import { LoadingOverlayComponent } from '@pagopa/selfcare-common-frontend';
import { DashboardDecoratorsType, DashboardPageProps } from '../pages/dashboard/Dashboard';
import { MicroComponentsProps } from './dashboardMicrocomponentsUtils';

type Props = {
  decorators: DashboardDecoratorsType;
} & DashboardPageProps &
  MicroComponentsProps;

const RemoteRoutingUsers = React.lazy(() => import('selfcareUsers/RoutingUsers'));

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
  <React.Suspense fallback={<LoadingOverlayComponent open={true} />}>
    <RemoteRoutingUsers
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
