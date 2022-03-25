import React from 'react';
import { LoadingOverlayComponent } from '@pagopa/selfcare-common-frontend';
import { DashboardMicrofrontendPageProps } from '../dashboardMicrocomponentsUtils';

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
}: DashboardMicrofrontendPageProps) => (
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
