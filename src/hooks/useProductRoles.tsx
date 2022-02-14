import useReduxCachedValue from '@pagopa/selfcare-common-frontend/hooks/useReduxCachedValue';
import { Product } from '../model/Product';
import { ProductRole } from '../model/ProductRole';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { fetchProductRoles } from '../services/usersService';

export const useProductRoles = (product: Product): (() => Promise<Array<ProductRole>>) =>
  useReduxCachedValue(
    `PRODUCT_ROLES_${product.title}`,
    () => fetchProductRoles(product),
    (state) => partiesSelectors.selectPartySelectedProductRoles(state, product.id),
    (roles) => partiesActions.setPartySelectedProductRoles({ productId: product.id, roles })
  );
