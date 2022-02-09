import { UserRole } from '../../../../model/Party';
import { ProductRole } from '../../../../model/ProductRole';

export type UsersTableFilterConfig = {
  /** If the roles configuration imply a set of products, this will be considered as filter */
  productIds: Array<string>;
  /** The selc roles selected as filter */
  selcRole: Array<UserRole>;
  /** The product roles selected as filter */
  productRoles: Array<ProductRole>;
};
