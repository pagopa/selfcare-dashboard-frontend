import React from 'react';
import { LoadingOverlayComponent } from '@pagopa/selfcare-common-frontend';
import { CONFIG } from '@pagopa/selfcare-common-frontend/config/env';
import { DashboardMicrofrontendPageProps } from '../dashboardMicrocomponentsUtils';

const RemoteRoutingGroups = React.lazy(() => import('selfcareGroups/RoutingGroups'));

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
    <RemoteRoutingGroups
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
