import { PageRequest } from '@pagopa/selfcare-common-frontend/model/PageRequest';
import { PageResource } from '@pagopa/selfcare-common-frontend/model/PageResource';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { Party, UserRole, UserStatus } from '../model/Party';
import { Product } from '../model/Product';
import {
  institutionUserResource2PartyUser,
  PartyUser,
  PartyUserOnCreation,
  PartyUserProduct,
  PartyUserProductRole,
  productUserResource2PartyUser,
} from '../model/PartyUser';
import { ProductRole } from '../model/ProductRole';
import { DashboardApi } from '../api/DashboardApiClient';
import {
  fetchPartyUsers as fetchPartyUsersMocked,
  savePartyUser as savePartyUserMocked,
  updatePartyUserStatus as updatePartyUserStatusMocked,
  deletePartyUser as deletePartyUserMocked,
  fetchPartyUser as fetchPartyUserMocked,
  mockedProductRoles,
} from './__mocks__/usersService';

const toFakePagination = <T>(content: Array<T>): PageResource<T> => ({
  content,
  page: {
    number: 0,
    size: content.length,
    totalElements: content.length,
    totalPages: 1,
  },
});

export const fetchPartyUsers = (
  pageRequest: PageRequest,
  party: Party,
  currentUser: User,
  checkPermission: boolean,
  product?: Product,
  selcRoles?: Array<UserRole>,
  productRoles?: Array<ProductRole>
): Promise<PageResource<PartyUser>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_USERS === 'true') {
    return fetchPartyUsersMocked(
      pageRequest,
      party,
      currentUser,
      checkPermission,
      product,
      selcRoles,
      productRoles
    );
  } else {
    if (product && checkPermission) {
      return DashboardApi.getPartyProductUsers(
        party.institutionId,
        product.id,
        selcRoles && selcRoles.length > 0 ? selcRoles[0] : undefined
      ).then(
        (
          r // TODO fixme when API will support pagination
        ) => toFakePagination(r.map((u) => productUserResource2PartyUser(u, currentUser)))
      );
    } else {
      return DashboardApi.getPartyUsers(
        party.institutionId,
        product?.id,
        selcRoles && selcRoles.length > 0 ? selcRoles[0] : undefined
      ).then(
        (
          r // TODO fixme when API will support pagination
        ) => toFakePagination(r.map((u) => institutionUserResource2PartyUser(u, currentUser)))
      );
    }
  }
};

export const fetchPartyUser = (
  institutionId: string,
  userId: string,
  currentUser: User
): Promise<PartyUser | null> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_USERS === 'true') {
    return fetchPartyUserMocked(institutionId, userId, currentUser);
  } else {
    return DashboardApi.getPartyUser(institutionId, userId).then((u) => {
      if (u) {
        return institutionUserResource2PartyUser(u, currentUser);
      } else {
        return null;
      }
    });
  }
};

export const savePartyUser = (
  party: Party,
  product: Product,
  user: PartyUserOnCreation
): Promise<any> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_USERS === 'true') {
    return savePartyUserMocked(party, product, user);
  } else {
    return DashboardApi.savePartyUser(party.institutionId, product.id, user);
  }
};

export const updatePartyUserStatus = (
  party: Party,
  user: PartyUser,
  product: PartyUserProduct,
  role: PartyUserProductRole,
  status: UserStatus
): Promise<any> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_USERS === 'true') {
    return updatePartyUserStatusMocked(party, user, product, role, status);
  }
  if (status === 'ACTIVE') {
    return DashboardApi.activatePartyRelation(role.relationshipId);
  } else if (status === 'SUSPENDED') {
    return DashboardApi.suspendPartyRelation(role.relationshipId);
  } else {
    throw new Error(`Not allowed next status: ${status}`);
  }
};

export const deletePartyUser = (
  party: Party,
  user: PartyUser,
  product: PartyUserProduct,
  role: PartyUserProductRole
): Promise<any> => {
  trackEvent('USER_DELETE', {
    party_id: party.institutionId,
    product: product.id,
    product_role: role.role,
  });
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_USERS === 'true') {
    return deletePartyUserMocked(party, user, product, role);
  } else {
    return DashboardApi.deletePartyRelation(role.relationshipId);
  }
};

export const fetchProductRoles = (product: Product): Promise<Array<ProductRole>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_USERS === 'true') {
    return new Promise((resolve) => resolve(mockedProductRoles));
  } else {
    return DashboardApi.getProductRoles(product.id).then(
      (roles) =>
        roles.map((r) => ({
          productId: product.id,
          productRole: r,
          selcRole: 'ADMIN',
          title: r,
          description: `TODO Descrizione ruolo ${r}`,
        })) // TODO fixme
    );
  }
};
