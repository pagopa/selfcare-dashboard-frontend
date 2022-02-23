import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useSelectedPartyProduct } from '../hooks/useSelectedPartyProduct';
import { Product } from '../model/Product';
import ROUTES from '../routes';
import { useProductRoles } from '../hooks/useProductRoles';
import { LOADING_TASK_FETCH_PRODUCT_ROLES } from '../utils/constants';
import { buildEmptyProductRolesLists, ProductRolesLists } from '../model/ProductRole';

type ProductUrlParams = {
  institutionId: string;
  productId: string;
};

type WrappedComponentProps = {
  products: Array<Product>;
};

/** The decorated component will be invoked with selectedProduct and fetchSelectedProductRoles props */
export default function withSelectedPartyProduct<T extends WrappedComponentProps>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<Omit<T, 'selectedProduct' | 'fetchSelectedProductRoles'>> {
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

    // build a function to provide to decorated component in order to give the ability to fetch product roles
    const fetchSelectedProductRoles = useProductRoles();

    const setLoading_fetchProductRoles = useLoading(LOADING_TASK_FETCH_PRODUCT_ROLES);

    const doFetchProductRoles = (onRetry?: () => void): Promise<ProductRolesLists> => {
      setLoading_fetchProductRoles(true);
      return fetchSelectedProductRoles(selectedPartyProduct as Product)
        .catch((reason) => {
          addError({
            id: `FETCH_PRODUCT_ROLES_ERROR_${selectedPartyProduct?.id}`,
            error: reason,
            blocking: false,
            toNotify: true,
            techDescription: `Something gone wrong while fetching roles for product ${selectedPartyProduct?.title}`,
            onRetry,
          });
          return buildEmptyProductRolesLists();
        })
        .finally(() => setLoading_fetchProductRoles(false));
    };

    return selectedPartyProduct ? (
      <WrappedComponent
        {...(props as T)}
        selectedProduct={selectedPartyProduct}
        fetchSelectedProductRoles={doFetchProductRoles}
      />
    ) : (
      <></>
    );
  };

  // eslint-disable-next-line functional/immutable-data
  ComponentWithSelectedPartyProduct.displayName = `withSelectedPartyProduct(${displayName})`;

  return ComponentWithSelectedPartyProduct as React.ComponentType<
    Omit<T, 'selectedProduct' | 'fetchSelectedProductRoles'>
  >;
}
