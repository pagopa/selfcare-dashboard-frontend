import { useReduxCachedValueParametricRetrieverTranscoded } from '@pagopa/selfcare-common-frontend/hooks/useReduxCachedValue';
import { Product } from '../model/Product';
import { ProductRole, ProductsRolesMap } from '../model/ProductRole';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { fetchProductRoles } from '../services/usersService';

export const useProductRoles = (): ((product: Product) => Promise<Array<ProductRole>>) =>
  useReduxCachedValueParametricRetrieverTranscoded(
    'PRODUCT_ROLES',
    (product: Product) => fetchProductRoles(product),
    partiesSelectors.selectPartySelectedProductsRolesMap,
    (roles: Array<ProductRole>, product: Product) =>
      partiesActions.addPartySelectedProductRoles({ [product.id]: roles }),
    (productsRolesMap: ProductsRolesMap, product: Product) => productsRolesMap[product.id],
    (productsRolesMap: ProductsRolesMap, product: Product) => !productsRolesMap[product.id]
  );
