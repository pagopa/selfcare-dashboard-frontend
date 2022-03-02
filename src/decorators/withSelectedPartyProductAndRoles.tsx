import { useEffect, useState } from 'react';
import { Party } from '../model/Party';
import { Product, ProductsMap } from '../model/Product';
import { ProductRolesLists } from '../model/ProductRole';

export type withSelectedPartyProductAndRolesProps = {
  party: Party;
  products: Array<Product>;
  productsMap: ProductsMap;
  activeProducts: Array<Product>;
  selectedProduct: Product;
  fetchSelectedProductRoles: (onRetry: () => void) => Promise<ProductRolesLists>;
  productRolesList: ProductRolesLists;
};

/** This decorator should be used after withSelectedPartyProduct in order to use the fetchSelectedProductRoles and providing the decorated component of the productRolesList */
export default function withSelectedPartyProductAndRoles<
  T extends withSelectedPartyProductAndRolesProps
>(WrappedComponent: React.ComponentType<T>): React.ComponentType<Omit<T, 'productRolesList'>> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithSelectedPartyProductAndRoles = (props: T) => {
    const [productRolesList, setProductRolesList] = useState<ProductRolesLists>();

    const doFetchProductRoles = () => {
      // void is allowed here because the catch is handled inside the fetchSelectedProductRoles function provided by withSelectedPartyProduct
      void props
        .fetchSelectedProductRoles(doFetchProductRoles)
        .then((roles) => setProductRolesList(roles));
    };

    useEffect(() => {
      if (props.selectedProduct) {
        doFetchProductRoles();
      }
    }, [props.selectedProduct]);

    return productRolesList ? (
      <WrappedComponent {...props} productRolesList={productRolesList} />
    ) : (
      <></>
    );
  };

  // eslint-disable-next-line functional/immutable-data
  ComponentWithSelectedPartyProductAndRoles.displayName = `withSelectedPartyProductAndRoles(${displayName})`;

  return ComponentWithSelectedPartyProductAndRoles as React.ComponentType<
    Omit<T, 'productRolesList'>
  >;
}
