import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { InstitutionUserResource } from '../api/generated/b4f-dashboard/InstitutionUserResource';
import { ProductInfoResource } from '../api/generated/b4f-dashboard/ProductInfoResource';
import { ProductUserResource } from '../api/generated/b4f-dashboard/ProductUserResource';
import { UserRole, UserStatus } from './Party';

export type PartyUser = {
  id: string;
  taxCode: string;
  name: string;
  surname: string;
  email: string;
  userRole: UserRole;
  products: Array<PartyUserProduct>;
  status: UserStatus;
  isCurrentUser: boolean;
  certification: boolean;
};

export type PartyUserProduct = {
  id: string;
  title: string;
  roles: Array<PartyUserProductRole>;
};

export type PartyUserProductRole = {
  relationshipId: string;
  role: string;
  selcRole: UserRole;
  status: UserStatus;
};

export type PartyUserOnCreation = {
  name: string;
  surname: string;
  taxCode: string;
  email: string;
  confirmEmail: string;
  productRoles: Array<string>;
  certification: boolean;
};

export type PartyUserOnEdit = {
  id: string;
  taxCode: string;
  name: string;
  surname: string;
  email: string;
  confirmEmail: string;
  certification: boolean;
};

export const institutionUserResource2PartyUser = (
  resource: InstitutionUserResource,
  currentUser: User
): PartyUser => ({
  id: resource.id,
  taxCode: resource.fiscalCode,
  name: resource.name,
  surname: resource.surname,
  email: resource.email,
  userRole: resource.role,
  products: ([] as Array<PartyUserProduct>).concat(
    resource.products.map(productInfoResource2PartyUserProduct)
  ),
  status: resource.status as UserStatus,
  isCurrentUser: currentUser.uid === resource.id,
  certification: resource.certification,
});

export const productInfoResource2PartyUserProduct = (
  productInfo: ProductInfoResource
): PartyUserProduct => ({
  id: productInfo.id,
  title: productInfo.title,
  roles: productInfo.roleInfos.map((r) => ({
    relationshipId: r.relationshipId,
    role: r.role,
    selcRole: r.selcRole as UserRole,
    status: r.status as UserStatus,
  })),
});

export const productUserResource2PartyUser = (
  resource: ProductUserResource,
  currentUser: User
): PartyUser => ({
  id: resource.id,
  taxCode: resource.fiscalCode,
  name: resource.name,
  surname: resource.surname,
  email: resource.email,
  userRole: resource.role,
  products: [productInfoResource2PartyUserProduct(resource.product)],
  status: resource.status as UserStatus,
  isCurrentUser: currentUser.uid === resource.id,
  certification: resource.certification,
});
