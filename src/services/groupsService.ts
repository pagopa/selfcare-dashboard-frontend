import { PageRequest } from '@pagopa/selfcare-common-frontend/model/PageRequest';
import { PageResource } from '@pagopa/selfcare-common-frontend/model/PageResource';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { Party } from '../model/Party';
import {
  PartyGroup,
  PartyGroupExt,
  PartyGroupOnCreation,
  PartyGroupOnEdit,
  PartyGroupStatus,
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
  pageRequest: PageRequest,
  party: Party,
  productsMap: ProductsMap,
  currentUser: User,
  checkPermission: boolean,
  product?: Product
): Promise<PageResource<PartyGroup>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_GROUPS === 'true') {
    return fetchPartyGroupsMocked(
      pageRequest,
      party,
      productsMap,
      currentUser,
      checkPermission,
      product
    );
  } else {
    throw new Error('TODO');
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
    throw new Error('TODO');
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
    throw new Error('TODO');
  }
};

export const updatePartyGroup = (party: Party, group: PartyGroupOnEdit): Promise<any> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_GROUPS === 'true') {
    return updatePartyGroupMocked(party, group);
  } else {
    throw new Error('TODO');
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
    throw new Error('TODO');
  } else if (status === 'SUSPENDED') {
    trackEvent('GROUP_SUSPEND', {
      party_id: party.institutionId,
      product: product.id,
    });
    throw new Error('TODO');
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
    throw new Error('TODO');
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
    throw new Error('TODO');
  }
};
