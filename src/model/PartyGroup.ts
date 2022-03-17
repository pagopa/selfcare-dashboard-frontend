import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { UserGroupPlainResource } from '../api/generated/b4f-dashboard/UserGroupPlainResource';
import { UserGroupResource } from '../api/generated/b4f-dashboard/UserGroupResource';
import { PartyUser, PartyUserSimple, productUserResource2PartyUser } from './PartyUser';
import { Product } from './Product';

export type PartyGroupStatus = 'ACTIVE' | 'SUSPENDED';

export type PartyGroup = {
  id: string;
  institutionId: string;
  productId: string;
  name: string;
  description: string;
  status: PartyGroupStatus;
  membersCount: number;
  createdAt?: Date;
  modifiedAt?: Date;
};

export type PartyGroupExt = PartyGroup & {
  members: Array<PartyUser>;
  createdBy?: PartyUserSimple;
  modifiedBy?: PartyUserSimple;
};

export type PartyGroupOnCreation = {
  institutionId: string;
  productId: string;
  name: string;
  description: string;
  members: Array<PartyUser>;
};

export type PartyGroupOnEdit = {
  id: string;
  institutionId: string;
  productId: string;
  name: string;
  description: string;
  members: Array<PartyUser>;
};

export const usersGroupPlainResource2PartyGroup = (
  resource: UserGroupPlainResource
): PartyGroup => ({
  id: resource.id,
  institutionId: resource.institutionId,
  productId: resource.productId,
  name: resource.name,
  description: resource.description,
  status: resource.status,
  membersCount: resource.membersCount,
  createdAt: resource.createdAt,
  modifiedAt: resource.modifiedAt,
});

export const usersGroupResource2PartyGroupExt = (
  resource: UserGroupResource,
  currentUser: User,
  product: Product
): PartyGroupExt => ({
  id: resource.id,
  institutionId: resource.institutionId,
  productId: resource.productId,
  name: resource.name,
  description: resource.description,
  status: resource.status,
  membersCount: resource.members.length,
  members: resource.members.map((u) => productUserResource2PartyUser(u, product, currentUser)),
  createdAt: resource.createdAt,
  createdBy: resource.createdBy,
  modifiedAt: resource.modifiedAt,
  modifiedBy: resource.modifiedBy,
});
