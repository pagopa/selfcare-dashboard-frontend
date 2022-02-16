import { roleLabels } from '@pagopa/selfcare-common-frontend/utils/constants';
import { UserRole } from './Party';

export type ProductRole = {
  selcRole: UserRole;
  productRole: string;
  title: string;
  description: string;
};

export type ProductRolesLists = {
  list: Array<ProductRole>;
  groupBySelcRole: ProductRolesBySelcRoleType;
  groupByProductRole: ProductRolesByProductRoleType;
};

export type ProductRolesByProductRoleType = { [productRole: string]: ProductRole };
export type ProductRolesBySelcRoleType = { [selcRole in UserRole]: Array<ProductRole> };

export type ProductsRolesMap = {
  [productId: string]: ProductRolesLists;
};

export const productRoles2ProductRolesList = (roles: Array<ProductRole>): ProductRolesLists => ({
  list: roles,
  groupBySelcRole: productRolesGroupBySelcRole(roles),
  groupByProductRole: productRolesGroupByProductRole(roles),
});

const productRolesGroupBySelcRole = (
  roles: Array<ProductRole>
): { [selcRole in UserRole]: Array<ProductRole> } =>
  roles.reduce((acc, r) => {
    // eslint-disable-next-line functional/immutable-data
    acc[r.selcRole] = acc[r.selcRole].concat([r]);
    return acc;
  }, Object.fromEntries(Object.keys(roleLabels).map((s) => [s, []])) as unknown as ProductRolesBySelcRoleType);

const productRolesGroupByProductRole = (
  roles: Array<ProductRole>
): { [productRole: string]: ProductRole } =>
  roles.reduce((acc: ProductRolesByProductRoleType, r) => {
    // eslint-disable-next-line functional/immutable-data
    acc[r.productRole] = r;
    return acc;
  }, {});
