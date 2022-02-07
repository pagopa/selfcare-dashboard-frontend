import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { InstitutionUserResource } from '../api/generated/b4f-dashboard/InstitutionUserResource';
import { ProductUserResource } from '../api/generated/b4f-dashboard/ProductUserResource';
import { UserRole, UserStatus } from './Party';
import { Product } from './Product';

export type PartyUser = {
  id: string;
  name: string;
  surname: string;
  email: string;
  userRole: UserRole;
  products: Array<{ id: string; title: string; relationshipId?: string }>;
  status: UserStatus;
  isCurrentUser: boolean;
};

export type PartyUserOnCreation = {
  name: string;
  surname: string;
  taxCode: string;
  email: string;
  confirmEmail: string;
  productRole: string;
  certification: boolean;
};

export const institutionUserResource2PartyUser = (
  resource: InstitutionUserResource,
  currentUser: User
): PartyUser => ({
  id: resource.id,
  name: resource.name,
  surname: resource.surname,
  email: resource.email,
  userRole: resource.role,
  products: ([] as Array<{ id: string; title: string }>).concat(resource.products),
  status: resource.status as UserStatus,
  isCurrentUser: currentUser.uid === resource.id,
});

export const productUserResource2PartyUser = (
  product: Product,
  resource: ProductUserResource,
  currentUser: User
): PartyUser => ({
  id: resource.id,
  name: resource.name,
  surname: resource.surname,
  email: resource.email,
  userRole: resource.role,
  products: [{ id: product.id, title: product.title, relationshipId: resource.relationshipId }],
  status: resource.status as UserStatus,
  isCurrentUser: currentUser.uid === resource.id,
});
