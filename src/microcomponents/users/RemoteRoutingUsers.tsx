import React from 'react';
import { LoadingOverlayComponent } from '@pagopa/selfcare-common-frontend/lib';
import { CONFIG } from '@pagopa/selfcare-common-frontend/lib/config/env';
import { DashboardMicrofrontendPageProps } from '../dashboardMicrocomponentsUtils';

const RemoteRoutingUsers = React.lazy(() => import('selfcareUsers/RoutingUsers'));

export default ({
  history,
  store,
  theme,
  i18n,
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
      i18n={i18n}
      decorators={decorators}
      party={party}
      products={products}
      activeProducts={activeProducts}
      productsMap={productsMap}
      CONFIG={CONFIG}
    />
  </React.Suspense>
);
