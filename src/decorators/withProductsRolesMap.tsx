import withRetrievedValue from '@pagopa/selfcare-common-frontend/lib/decorators/withRetrievedValue';
import { useProductsRolesMap } from '../hooks/useProductsRolesMap';
import { ProductsRolesMap } from '../model/ProductRole';

export type withProductsRolesMapProps = {
  productsRolesMap: ProductsRolesMap;
};

export default function withProductsRolesMap<T extends withProductsRolesMapProps>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<Omit<T, 'productsRolesMap' | 'reload'>> {
  return withRetrievedValue('productsRolesMap', useProductsRolesMap, WrappedComponent);
}
