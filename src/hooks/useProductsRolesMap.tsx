import useReduxCachedValue from '@pagopa/selfcare-common-frontend/lib/hooks/useReduxCachedValue';
import { useMemo } from 'react';
import { Party } from '../model/Party';
import {
  productRoles2ProductRolesList,
  ProductRolesLists,
  ProductsRolesMap,
} from '../model/ProductRole';
import { useAppSelector } from '../redux/hooks';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { RootState } from '../redux/store';
import { fetchProductRoles } from '../services/productService';

export const useProductsRolesMap = (): (() => Promise<ProductsRolesMap>) => {
  const party = useAppSelector(partiesSelectors.selectPartySelected);
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);
  const productsRolesMap = useAppSelector(partiesSelectors.selectPartySelectedProductsRolesMap);

  const activeProducts = useMemo(
    () =>
      products?.filter((p) =>
        party?.products.some(
          (us) => us.productId === p.id && us.productOnBoardingStatus === 'ACTIVE'
        )
      ),
    [products, party?.products]
  );

  const fetchProductRolesNotYetCached = async (): Promise<ProductsRolesMap> => {
    if (!activeProducts) {
      return new Promise((resolve) => resolve(productsRolesMap));
    }

    const promises: Array<Promise<[string, ProductRolesLists]>> = activeProducts
      .filter((p) => !productsRolesMap[p.id])
      .map((p) =>
        fetchProductRoles(p, party as Party).then((roles) => [p.id, productRoles2ProductRolesList(roles)])
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
