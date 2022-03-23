import { PageRequest } from '@pagopa/selfcare-common-frontend/model/PageRequest';
import { PageResource } from '@pagopa/selfcare-common-frontend/model/PageResource';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { DashboardApi } from '../api/DashboardApiClient';
import { Party } from '../model/Party';
import {
  PartyGroup,
  PartyGroupExt,
  PartyGroupOnCreation,
  PartyGroupOnEdit,
  PartyGroupStatus,
  usersGroupPlainResource2PartyGroup,
  usersGroupResource2PartyGroupExt,
} from '../model/PartyGroup';
import { Product, ProductsMap } from '../model/Product';
import {
  fetchPartyGroups as fetchPartyGroupsMocked,
  savePartyGroup as savePartyGroupMocked,
  updatePartyGroup as updatePartyGroupMocked,
  updatePartyGroupStatus as updatePartyGroupStatusMocked,
  deletePartyGroup as deletePartyGroupMocked,
  fetchPartyGroup as fetchPartyGroupMocked,
  deleteGroupRelation as deleteGroupRelationMocked,
} from './__mocks__/groupsService';

export const fetchPartyGroups = (
  party: Party,
  product: Product,
  currentUser: User,
  pageRequest: PageRequest
): Promise<PageResource<PartyGroup>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_GROUPS === 'true') {
    return fetchPartyGroupsMocked(party, product, currentUser, pageRequest);
  } else {
    return DashboardApi.fetchPartyGroups(product.id, party.institutionId, pageRequest).then(
      (resources) => ({
        content: resources?.map(usersGroupPlainResource2PartyGroup) ?? [],
        page: {
          number: pageRequest.page,
          size: Math.min(pageRequest.size, resources?.length ?? 0),
          totalElements: -1,
          totalPages: -1,
        },
      })
    );
  }
};

export const fetchPartyGroup = (
  institutionId: string,
  groupId: string,
  currentUser: User,
  productsMap: ProductsMap
): Promise<PartyGroupExt | null> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_GROUPS === 'true') {
    return fetchPartyGroupMocked(institutionId, groupId, currentUser, productsMap);
  } else {
    return DashboardApi.fetchPartyGroup(groupId, institutionId).then((resource) =>
      resource
        ? usersGroupResource2PartyGroupExt(resource, currentUser, productsMap[resource.productId])
        : null
    );
  }
};

export const savePartyGroup = (
  party: Party,
  product: Product,
  group: PartyGroupOnCreation
): Promise<any> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_GROUPS === 'true') {
    return savePartyGroupMocked(party, product, group);
  } else {
    return DashboardApi.savePartyGroup(group);
  }
};

export const updatePartyGroup = (
  party: Party,
  product: Product,
  group: PartyGroupOnEdit
): Promise<any> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_GROUPS === 'true') {
    return updatePartyGroupMocked(party, product, group);
  } else {
    return DashboardApi.updatePartyGroup(group.id, group);
  }
};

export const updatePartyGroupStatus = (
  party: Party,
  product: Product,
  group: PartyGroup,
  status: PartyGroupStatus
): Promise<any> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_GROUPS === 'true') {
    return updatePartyGroupStatusMocked(party, product, group, status);
  }
  if (status === 'ACTIVE') {
    trackEvent('GROUP_RESUME', {
      party_id: party.institutionId,
      product: product.id,
    });
    return DashboardApi.updatePartyGroupStatusActivate(group.id);
  } else if (status === 'SUSPENDED') {
    trackEvent('GROUP_SUSPEND', {
      party_id: party.institutionId,
      product: product.id,
    });
    return DashboardApi.updatePartyGroupStatusSuspend(group.id);
  } else {
    throw new Error(`Not allowed next status: ${status}`);
  }
};

export const deletePartyGroup = (
  party: Party,
  product: Product,
  group: PartyGroup
): Promise<any> => {
  trackEvent('GROUP_DELETE', {
    party_id: party.institutionId,
    product: product.id,
  });
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_GROUPS === 'true') {
    return deletePartyGroupMocked(party, product, group);
  } else {
    return DashboardApi.deletePartyGroup(group.id);
  }
};

export const deleteGroupRelation = (
  party: Party,
  product: Product,
  group: PartyGroupExt,
  userId: string
): Promise<any> => {
  trackEvent('RELATION_GROUP_USER_DELETE', {
    party_id: party.institutionId,
    product: product.id,
  });
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_GROUPS === 'true') {
    return deleteGroupRelationMocked(party, product, group, userId);
  } else {
    return DashboardApi.deleteGroupRelation(group.id, userId);
  }
};
