import { useReduxCachedValueParametricRetrieverTranscoded } from '@pagopa/selfcare-common-frontend/lib/hooks/useReduxCachedValue';
import { Party } from '../model/Party';
import { Product } from '../model/Product';
import {
  productRoles2ProductRolesList,
  ProductRolesLists,
  ProductsRolesMap,
} from '../model/ProductRole';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { fetchProductRoles } from '../services/productService';

export const useProductRoles = (): ((args: { product: Product; party: Party }) => Promise<ProductRolesLists>) =>
  useReduxCachedValueParametricRetrieverTranscoded(
    'PRODUCT_ROLES',
    ({ product, party }: { product: Product; party: Party }) =>
      fetchProductRoles(product, party).then((roles) => productRoles2ProductRolesList(roles)),
    partiesSelectors.selectPartySelectedProductsRolesMap,
    (roles: ProductRolesLists, { product }: { product: Product }) =>
      partiesActions.addPartySelectedProductRoles({ [product.id]: roles }),
    (productsRolesMap: ProductsRolesMap, { product }: { product: Product }) => productsRolesMap[product.id],
    (productsRolesMap: ProductsRolesMap, { product }: { product: Product }) => !productsRolesMap[product.id]
  );

