import { UserRole } from './Party';

export type ProductRole = {
  selcRole: UserRole;
  productRole: string;
  displayableProductRole: string;
};

export type ProductsRolesMap = { [productId: string]: Array<ProductRole> };
