import useReduxCachedValue from '@pagopa/selfcare-common-frontend/hooks/useReduxCachedValue';
import { ProductRole, ProductsRolesMap } from '../model/ProductRole';
import { useAppSelector } from '../redux/hooks';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { RootState } from '../redux/store';
import { fetchProductRoles } from '../services/usersService';

export const useProductsRolesMap = (): (() => Promise<ProductsRolesMap>) => {
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);
  const productsRolesMap = useAppSelector(partiesSelectors.selectPartySelectedProductsRolesMap);

  const fetchProductRolesNotYetCached = async (): Promise<ProductsRolesMap> => {
    if (!products) {
      return new Promise((resolve) => resolve(productsRolesMap));
    }

    const promises: Array<Promise<[string, Array<ProductRole>]>> = products
      .filter((p) => !productsRolesMap[p.id])
      .map((p) => fetchProductRoles(p).then((roles) => [p.id, roles]));
    const fetched: Array<[string, Array<ProductRole>]> = await Promise.all(promises);

    return Object.fromEntries(Object.entries(productsRolesMap).concat(fetched));
  };

  return useReduxCachedValue(
    'PRODUCTS_ROLES',
    fetchProductRolesNotYetCached,
    (state: RootState) =>
      !products ||
      (state.parties.selectedProductsRolesMap &&
        !products.find((p) => !(state.parties.selectedProductsRolesMap as ProductsRolesMap)[p.id]))
        ? state.parties.selectedProductsRolesMap
        : undefined,
    partiesActions.setPartySelectedProductsRolesMap
  ) as () => Promise<ProductsRolesMap>;
};
