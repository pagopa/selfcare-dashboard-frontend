import { PageRequest } from '@pagopa/selfcare-common-frontend/model/PageRequest';
import { PageResource } from '@pagopa/selfcare-common-frontend/model/PageResource';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { Party, UserRole, UserStatus } from '../model/Party';
import { Product } from '../model/Product';
import {
  institutionUserResource2PartyUser,
  PartyUser,
  PartyUserOnCreation,
  productUserResource2PartyUser,
} from '../model/PartyUser';
import { ProductRole } from '../model/ProductRole';
import { DashboardApi } from '../api/DashboardApiClient';
import {
  fetchPartyUsers as fetchPartyUsersMocked,
  savePartyUser as savePartyUserMocked,
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
          r // TODO fixme
        ) => toFakePagination(r.map((u) => productUserResource2PartyUser(product, u, currentUser)))
      );
    } else {
      return DashboardApi.getPartyUsers(
        party.institutionId,
        product?.id,
        selcRoles && selcRoles.length > 0 ? selcRoles[0] : undefined
      ).then(
        (
          r // TODO fixme
        ) => toFakePagination(r.map((u) => institutionUserResource2PartyUser(u, currentUser)))
      );
    }
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

export const updatePartyUserStatus = (user: PartyUser, status: UserStatus): Promise<any> => {
  if (user.products.length !== 1) {
    throw new Error(
      `Updated allowed only for users having selected only 1 product: ${user.products.length}`
    );
  }
  if (!user.products[0].relationshipId) {
    throw new Error(
      `Updated allowed only for users retrieved using getPartyProductUsers (no relationshipId): ${JSON.stringify(
        user.products[0]
      )}`
    );
  }
  if (status === 'ACTIVE') {
    return DashboardApi.activatePartyRelation(user.products[0].relationshipId);
  } else if (status === 'SUSPENDED') {
    return DashboardApi.suspendPartyRelation(user.products[0].relationshipId);
  } else {
    throw new Error(`Not allowed next status: ${status}`);
  }
};

export const fetchProductRoles = (product: Product): Promise<Array<ProductRole>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_USERS === 'true') {
    return new Promise((resolve) => resolve(mockedProductRoles));
  } else {
    return DashboardApi.getProductRoles(product.id).then((roles) =>
      roles.map((r) => ({ productRole: r }))
    );
  }
};
