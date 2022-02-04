import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useSelectedPartyProduct } from '../hooks/useSelectedPartyProduct';
import { Product } from '../model/Product';
import ROUTES from '../routes';

type ProductUrlParams = {
  institutionId: string;
  productId: string;
};

export default function withSelectedPartyProduct<T extends { products: Array<Product> }>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<Omit<T, 'selectedProduct'>> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithSelectedPartyProduct = (props: T) => {
    const { institutionId, productId } = useParams<ProductUrlParams>();
    const history = useHistory();
    const selectedPartyProduct = useSelectedPartyProduct(productId, props.products);
    const addError = useErrorDispatcher();

    useEffect(() => {
      if (!selectedPartyProduct) {
        addError({
          id: 'INVALID_PARTY_PRODUCT_ID_' + productId,
          blocking: false,
          techDescription: `Selected an invalid productId ${productId} not in party products ${props.products.map(
            (p) => p.id
          )}`,
          toNotify: false,
          error: new Error('INVALID_PARTY_PRODUCT_ID'),
          onClose: () =>
            history.push(resolvePathVariables(ROUTES.PARTY_DASHBOARD.path, { institutionId })),
        });
      }
    }, [selectedPartyProduct]);

    return <WrappedComponent {...(props as T)} selectedProduct={selectedPartyProduct} />;
  };

  // eslint-disable-next-line functional/immutable-data
  ComponentWithSelectedPartyProduct.displayName = `withSelectedPartyProduct(${displayName})`;

  return ComponentWithSelectedPartyProduct as React.ComponentType<Omit<T, 'selectedProduct'>>;
}
