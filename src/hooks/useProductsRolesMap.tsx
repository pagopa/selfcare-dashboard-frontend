import useReduxCachedValue from '@pagopa/selfcare-common-frontend/hooks/useReduxCachedValue';
import { useMemo } from 'react';
import {
  ProductRolesLists,
  productRoles2ProductRolesList,
  ProductsRolesMap,
} from '../model/ProductRole';
import { useAppSelector } from '../redux/hooks';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { RootState } from '../redux/store';
import { fetchProductRoles } from '../services/productService';

export const useProductsRolesMap = (): (() => Promise<ProductsRolesMap>) => {
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);
  const productsRolesMap = useAppSelector(partiesSelectors.selectPartySelectedProductsRolesMap);

  const activeProducts = useMemo(
    () => products?.filter((p) => p.productOnBoardingStatus === 'ACTIVE'),
    [products]
  );

  const fetchProductRolesNotYetCached = async (): Promise<ProductsRolesMap> => {
    if (!activeProducts) {
      return new Promise((resolve) => resolve(productsRolesMap));
    }

    const promises: Array<Promise<[string, ProductRolesLists]>> = activeProducts
      .filter((p) => !productsRolesMap[p.id])
      .map((p) =>
        fetchProductRoles(p).then((roles) => [p.id, productRoles2ProductRolesList(roles)])
      );
    const fetched: Array<[string, ProductRolesLists]> = await Promise.all(promises);

    return Object.fromEntries(Object.entries(productsRolesMap).concat(fetched));
  };

  return useReduxCachedValue(
    'PRODUCTS_ROLES',
    fetchProductRolesNotYetCached,
    (state: RootState) =>
      !activeProducts ||
      (state.parties.selectedProductsRolesMap &&
        !activeProducts.find(
          (p) => !(state.parties.selectedProductsRolesMap as ProductsRolesMap)[p.id]
        ))
        ? state.parties.selectedProductsRolesMap
        : undefined,
    partiesActions.setPartySelectedProductsRolesMap
  );
};
