import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { PageResource } from '@pagopa/selfcare-common-frontend/model/PageResource';
import { PageRequest } from '@pagopa/selfcare-common-frontend/model/PageRequest';
import {
  applySort,
  extractPageRequest,
} from '@pagopa/selfcare-common-frontend/hooks/useFakePagination';
import { Party } from '../../model/Party';
import { PartyUser } from '../../model/PartyUser';
import { Product, ProductsMap } from '../../model/Product';
import {
  PartyGroup,
  PartyGroupExt,
  PartyGroupOnCreation,
  PartyGroupOnEdit,
  PartyGroupStatus,
} from '../../model/PartyGroup';
import { mockedUsers } from './usersService';

export const mockedGroups: Array<PartyGroup> = [
  {
    id: 'groupId1',
    name: 'Gruppo1',
    description:
      'groupId1: use case ACTIVE group having 1 user on product in which loggedUser is ADMIN',
    institutionId: 'onboarded',
    productId: 'prod-io',
    status: 'ACTIVE',
    membersIds: ['uid'],
    createdAt: new Date('2022-01-01'),
    createdByUserId: 'uid',
    modifiedAt: new Date('2022-01-01 16:00'),
    modifiedByUserId: 'uid',
  },
  {
    id: 'groupId2',
    name: 'Gruppo2',
    description:
      'groupId2: use case ACTIVE group having 1 user on product in which loggedUser is LIMITED',
    institutionId: 'onboarded',
    productId: 'prod-pn',
    status: 'ACTIVE',
    membersIds: ['uid7'],
    createdAt: new Date('2022-01-10'),
    createdByUserId: 'uid7',
    modifiedAt: new Date('2022-01-21 10:00'),
    modifiedByUserId: 'uid7',
  },
  {
    id: 'groupId3',
    name: 'Gruppo3',
    description:
      'groupId3: use case SUSPENDED group having 2 users on product in which loggedUser is ADMIN',
    institutionId: 'onboarded',
    productId: 'prod-io',
    status: 'SUSPENDED',
    membersIds: ['uid', 'loggedUser'],
    createdAt: new Date('2022-02-01'),
    createdByUserId: 'loggedUser',
    modifiedAt: new Date('2022-02-08 16:00'),
    modifiedByUserId: 'uid',
  },
  {
    id: 'groupId4',
    name: 'Gruppo4',
    description:
      'groupId4: use case SUSPENDED group having 2 user on product in which loggedUser is LIMITED',
    institutionId: 'onboarded',
    productId: 'prod-pn',
    status: 'SUSPENDED',
    membersIds: ['uid6', 'uid7'],
    createdAt: new Date('2022-03-01'),
    createdByUserId: 'uid7',
    modifiedAt: new Date('2022-03-01'),
    modifiedByUserId: 'uid7',
  },

  {
    id: 'groupId5',
    name: 'Gruppo5',
    description: 'Group to have a significant number on prod-io',
    institutionId: 'onboarded',
    productId: 'prod-io',
    status: 'ACTIVE',
    membersIds: ['uid'],
    createdAt: new Date('2022-01-01'),
    createdByUserId: 'uid',
    modifiedAt: new Date('2022-01-01 16:00'),
    modifiedByUserId: 'uid',
  },
  {
    id: 'groupId6',
    name: 'Gruppo6',
    description: 'Group to have a significant number on prod-io',
    institutionId: 'onboarded',
    productId: 'prod-io',
    status: 'ACTIVE',
    membersIds: ['uid'],
    createdAt: new Date('2022-01-01'),
    createdByUserId: 'uid',
    modifiedAt: new Date('2022-01-01 16:00'),
    modifiedByUserId: 'uid',
  },
  {
    id: 'groupId7',
    name: 'Gruppo7',
    description: 'Group to have a significant number on prod-io',
    institutionId: 'onboarded',
    productId: 'prod-io',
    status: 'ACTIVE',
    membersIds: ['uid'],
    createdAt: new Date('2022-01-01'),
    createdByUserId: 'uid',
    modifiedAt: new Date('2022-01-01 16:00'),
    modifiedByUserId: 'uid',
  },
  {
    id: 'groupId8',
    name: 'Gruppo8',
    description: 'Group to have a significant number on prod-io',
    institutionId: 'onboarded',
    productId: 'prod-io',
    status: 'ACTIVE',
    membersIds: ['uid'],
    createdAt: new Date('2022-01-01'),
    createdByUserId: 'uid',
    modifiedAt: new Date('2022-01-01 16:00'),
    modifiedByUserId: 'uid',
  },
  {
    id: 'groupId9',
    name: 'Gruppo9',
    description: 'Group to have a significant number on prod-io',
    institutionId: 'onboarded',
    productId: 'prod-io',
    status: 'ACTIVE',
    membersIds: ['uid'],
    createdAt: new Date('2022-01-01'),
    createdByUserId: 'uid',
    modifiedAt: new Date('2022-01-01 16:00'),
    modifiedByUserId: 'uid',
  },
  {
    id: 'groupId10',
    name: 'Gruppo10',
    description: 'Group to have a significant number on prod-io',
    institutionId: 'onboarded',
    productId: 'prod-io',
    status: 'ACTIVE',
    membersIds: ['uid'],
    createdAt: new Date('2022-01-01'),
    createdByUserId: 'uid',
    modifiedAt: new Date('2022-01-01 16:00'),
    modifiedByUserId: 'uid',
  },
  {
    id: 'groupId11',
    name: 'Gruppo11',
    description: 'Group to have a significant number on prod-io',
    institutionId: 'onboarded',
    productId: 'prod-io',
    status: 'ACTIVE',
    membersIds: ['uid'],
    createdAt: new Date('2022-01-01'),
    createdByUserId: 'uid',
    modifiedAt: new Date('2022-01-01 16:00'),
    modifiedByUserId: 'uid',
  },
  {
    id: 'groupId12',
    name: 'Gruppo12',
    description: 'Group to have a significant number on prod-io',
    institutionId: 'onboarded',
    productId: 'prod-io',
    status: 'ACTIVE',
    membersIds: ['uid'],
    createdAt: new Date('2022-01-01'),
    createdByUserId: 'uid',
    modifiedAt: new Date('2022-01-01 16:00'),
    modifiedByUserId: 'uid',
  },
  {
    id: 'groupId13',
    name: 'Gruppo13',
    description: 'Group to have a significant number on prod-io',
    institutionId: 'onboarded',
    productId: 'prod-io',
    status: 'ACTIVE',
    membersIds: ['uid'],
    createdAt: new Date('2022-01-01'),
    createdByUserId: 'uid',
    modifiedAt: new Date('2022-01-01 16:00'),
    modifiedByUserId: 'uid',
  },
];

export const fetchPartyGroups = (
  party: Party,
  product: Product,
  _currentUser: User,
  pageRequest: PageRequest
): Promise<PageResource<PartyGroup>> => {
  const filteredContent = mockedGroups
    .slice()
    .filter((u) => {
      if (u.institutionId !== party.institutionId) {
        return false;
      }
      return product.id.indexOf(u.productId) > -1;
    })
    .map((u) => JSON.parse(JSON.stringify(u)));

  if (pageRequest.sort) {
    applySort(filteredContent, pageRequest.sort);
  }
  return new Promise((resolve) =>
    setTimeout(() => resolve(extractPageRequest(filteredContent, pageRequest)), 100)
  );
};

export const savePartyGroup = (
  _party: Party,
  _product: Product,
  group: PartyGroupOnCreation
): Promise<any> => {
  const clone: PartyGroup = {
    ...group,
    id: `${Date.now()}`,
    status: 'ACTIVE',
    membersIds: group.members.map((m) => m.id),
    createdAt: new Date(),
    createdByUserId: '0',
    modifiedAt: new Date(),
    modifiedByUserId: '0',
  };
  // eslint-disable-next-line functional/immutable-data
  mockedGroups.push(clone);
  return new Promise((resolve) => resolve(200));
};

export const updatePartyGroup = (_party: Party, group: PartyGroupOnEdit): Promise<any> => {
  const updatingGroupIndex = mockedGroups.findIndex((u) => u.id === group.id);
  const clone: PartyGroup = {
    ...mockedGroups[updatingGroupIndex],
    ...group,
    membersIds: group.members.map((m) => m.id),
    modifiedAt: new Date(),
    modifiedByUserId: '0',
  };
  // eslint-disable-next-line functional/immutable-data
  mockedGroups.splice(updatingGroupIndex, 1, clone);
  return new Promise((resolve) => resolve(200));
};

export const fetchPartyGroup = (
  _institutionId: string,
  groupId: string,
  _currentUser: User,
  _productsMap: ProductsMap
): Promise<PartyGroupExt | null> => {
  const mockedGroup = mockedGroups.find((u) => u.id === groupId) ?? null;
  const clone: PartyGroupExt = JSON.parse(JSON.stringify(mockedGroup));
  // eslint-disable-next-line functional/immutable-data
  clone.members = clone.membersIds.map((m) => mockedUsers.find((u) => u.id === m) as PartyUser);
  // eslint-disable-next-line functional/immutable-data
  clone.createdBy = mockedUsers.find((u) => u.id === clone.createdByUserId) as PartyUser;
  // eslint-disable-next-line functional/immutable-data
  clone.modifiedBy = mockedUsers.find((u) => u.id === clone.modifiedByUserId) as PartyUser;
  return new Promise((resolve) => resolve(mockedGroup ? clone : null));
};

export const updatePartyGroupStatus = (
  _party: Party,
  _product: Product,
  group: PartyGroup,
  status: PartyGroupStatus
): Promise<any> => {
  if (status === 'ACTIVE' || status === 'SUSPENDED') {
    const clone = { ...group, status };
    // eslint-disable-next-line functional/immutable-data
    mockedGroups.splice(
      mockedGroups.findIndex((u) => u.id === group.id),
      1,
      clone
    );

    return new Promise<void>((resolve) => resolve());
  } else {
    throw new Error(`Not allowed next status: ${status}`);
  }
};

export const deletePartyGroup = (
  _party: Party,
  _product: Product,
  group: PartyGroup
): Promise<any> => {
  // eslint-disable-next-line functional/immutable-data
  mockedGroups.splice(
    mockedGroups.findIndex((u) => u.id === group.id),
    1
  );
  return new Promise<void>((resolve) => resolve());
};
