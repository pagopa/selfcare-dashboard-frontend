import React from 'react';
import { LoadingOverlayComponent } from '@pagopa/selfcare-common-frontend';
import { MicroComponentsProps } from '../dashboardMicrocomponentsUtils';

const RemoteRoutingAdmin = React.lazy(() => import('selfcareAdmin/RoutingAdmin'));

export default ({ history, store, theme, i18n }: MicroComponentsProps) => (
  <React.Suspense fallback={<LoadingOverlayComponent open={true} />}>
    <RemoteRoutingAdmin
      history={history}
      store={store}
      theme={theme}
      i18n={i18n}
      /* decorators={decorators}
      party={party}
      products={products}
      activeProducts={activeProducts}
      productsMap={productsMap}
      CONFIG={CONFIG} */
    />
  </React.Suspense>
);
