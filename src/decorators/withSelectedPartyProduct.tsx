import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { useSelectedPartyProduct } from '../hooks/useSelectedPartyProduct';
import { Product } from '../model/Product';
import { useAppDispatch } from '../redux/hooks';
import { appStateActions } from '../redux/slices/appStateSlice';
import ROUTES, { resolvePathVariables } from '../routes';

type ProductUrlParams = {
  institutionId: string;
  productId: string;
};

export default function withSelectedPartyProduct<T extends { products: Array<Product> }>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithSelectedPartyProduct = (props: T) => {
    const dispatch = useAppDispatch();
    const { institutionId, productId } = useParams<ProductUrlParams>();
    const history = useHistory();
    const selectedPartyProduct = useSelectedPartyProduct(productId, props.products);

    useEffect(() => {
      if (!selectedPartyProduct) {
        dispatch(
          appStateActions.addError({
            id: 'INVALID_PARTY_PRODUCT_ID_' + productId,
            blocking: false,
            techDescription: `Selected an invalid productId ${productId} not in party products ${props.products.map(
              (p) => p.id
            )}`,
            toNotify: false,
            error: new Error('INVALID_PARTY_PRODUCT_ID'),
            onClose: () =>
              history.push(resolvePathVariables(ROUTES.PARTY_DASHBOARD.path, { institutionId })),
          })
        );
      }
    }, [selectedPartyProduct]);

    return <WrappedComponent {...(props as T)} selectedProduct={selectedPartyProduct} />;
  };

  // eslint-disable-next-line functional/immutable-data
  ComponentWithSelectedPartyProduct.displayName = `withSelectedPartyProduct(${displayName})`;

  return ComponentWithSelectedPartyProduct;
}
