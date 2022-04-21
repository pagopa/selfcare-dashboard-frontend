import { useReduxCachedValueParametricRetrieverTranscoded } from '@pagopa/selfcare-common-frontend/hooks/useReduxCachedValue';
import { Product } from '../model/Product';
import {
  productRoles2ProductRolesList,
  ProductRolesLists,
  ProductsRolesMap,
} from '../model/ProductRole';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { fetchProductRoles } from '../services/productService';

export const useProductRoles = (): ((product: Product) => Promise<ProductRolesLists>) =>
  useReduxCachedValueParametricRetrieverTranscoded(
    'PRODUCT_ROLES',
    (product: Product) =>
      fetchProductRoles(product).then((roles) => productRoles2ProductRolesList(roles)),
    partiesSelectors.selectPartySelectedProductsRolesMap,
    (roles: ProductRolesLists, product: Product) =>
      partiesActions.addPartySelectedProductRoles({ [product.id]: roles }),
    (productsRolesMap: ProductsRolesMap, product: Product) => productsRolesMap[product.id],
    (productsRolesMap: ProductsRolesMap, product: Product) => !productsRolesMap[product.id]
  );
