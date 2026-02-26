import { usePermissions } from '@pagopa/selfcare-common-frontend';
import useReduxCachedValue from '@pagopa/selfcare-common-frontend/hooks/useReduxCachedValue';
import { Actions, PRODUCT_IDS } from '@pagopa/selfcare-common-frontend/utils/constants';
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
  const { hasPermission } = usePermissions();

  const activeAndAccessibleProducts = useMemo(
    () =>
      products?.filter((p) =>
        party?.products.some(
          (us) =>
            us.productId === p.id &&
            us.productOnBoardingStatus === 'ACTIVE' &&
            hasPermission(us.productId ?? '', Actions.AccessProductBackoffice)
        )
      ),
    [products, party?.products]
  );

  const fetchProductRolesNotYetCached = async (): Promise<ProductsRolesMap> => {
    if (!activeAndAccessibleProducts) {
      return Promise.resolve(productsRolesMap);
    }

    const promises: Array<Promise<[string, ProductRolesLists]>> = activeAndAccessibleProducts
      .filter((p) => !productsRolesMap[p.id] || productsRolesMap[PRODUCT_IDS.PAGOPA])
      .map((p) =>
        fetchProductRoles(p, party as Party).then((roles) => [
          p.id,
          productRoles2ProductRolesList(roles),
        ])
      );
    const fetched: Array<[string, ProductRolesLists]> = await Promise.all(promises);

    return Object.fromEntries(Object.entries(productsRolesMap).concat(fetched));
  };

  return useReduxCachedValue(
    'PRODUCTS_ROLES',
    fetchProductRolesNotYetCached,
    (state: RootState) =>
      !activeAndAccessibleProducts ||
        (state.parties.selectedProductsRolesMap &&
          !activeAndAccessibleProducts.find(
            (p) =>
              !state.parties.selectedProductsRolesMap?.[p.id] || productsRolesMap[PRODUCT_IDS.PAGOPA]
          ))
        ? state.parties.selectedProductsRolesMap
        : undefined,
    partiesActions.setPartySelectedProductsRolesMap
  );
};
