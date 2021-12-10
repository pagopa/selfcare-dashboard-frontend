import { PageRequest } from '../model/PageRequest';
import { PageResource } from '../model/PageResource';
import { Party, UserRole, UserStatus } from '../model/Party';
import { Product } from '../model/Product';
import { PartyUser, PartyUserOnCreation } from '../model/PartyUser';
import { mockedUsers } from './__mocks__/rolesService';

export const fetchPartyUsers = (
  pageRequest: PageRequest,
  _party: Party,
  product?: Product,
  role?: UserRole
): Promise<PageResource<PartyUser>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_USERS === 'true') {
    const content = pageRequest.page === 9 ? mockedUsers.slice(1, 5) : mockedUsers;
    const filteredContent = content.map((u) =>
      Object.assign({}, u, product ? { products: [product] } : {}, role ? { userRole: role } : {})
    );
    const page = {
      number: pageRequest.page,
      size: pageRequest.size,
      totalElements: 195,
      totalPages: 10,
    };
    return new Promise((resolve) => resolve({ content: filteredContent, page }));
  } else {
    throw new Error('TODO');
  }
};

export const savePartyUser = (
  _party: Party,
  _product: Product,
  _user: PartyUserOnCreation
): Promise<any> => {
  throw new Error('TODO');
};

export const updatePartyUserStatus = (
  _party: Party,
  _product: Product,
  _user: PartyUser,
  _status: UserStatus
): Promise<any> => new Promise((resolve) => resolve('ok')); // TODO
