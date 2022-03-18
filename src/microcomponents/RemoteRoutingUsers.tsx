import React from 'react';
import { History } from 'history';
import { DashboardDecoratorsType } from '../pages/dashboard/Dashboard';
import { Party } from '../model/Party';
import { Product, ProductsMap } from '../model/Product';
import { createStore } from '../redux/store';

export type DashboardPageProps = {
  party: Party;
  products: Array<Product>;
  activeProducts: Array<Product>;
  productsMap: ProductsMap;
};

export type MicroserviceProps = {
  history: History;
  store: ReturnType<typeof createStore>;
};

type Props = {
  decorators: DashboardDecoratorsType;
} & DashboardPageProps &
  MicroserviceProps;

const RemoteRoutingUsers = React.lazy(() => import('selfcareUsers/RoutingUsers'));

export default ({
  history,
  store,
  decorators,
  party,
  products,
  activeProducts,
  productsMap,
}: Props) => (
  <React.Suspense fallback="Loading RoutingUsers">
    <RemoteRoutingUsers
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
