import { PageRequest } from '../model/PageRequest';
import { PageResource } from '../model/PageResource';
import { Party, UserRole, UserStatus } from '../model/Party';
import { Product } from '../model/Product';
import { PartyUser, PartyUserOnCreation } from '../model/PartyUser';
import { ProductRole } from '../model/ProductRole';
import { fetchPartyUsers as fetchPartyUsersMocked, mockedProductRoles } from './__mocks__/usersService';

export const fetchPartyUsers = (
  pageRequest: PageRequest,
  party: Party,
  product?: Product,
  role?: UserRole
): Promise<PageResource<PartyUser>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_USERS === 'true') {
    return fetchPartyUsersMocked(pageRequest, party, product, role);
  } else {
    return new Promise((_, error) => error('TODO'));
  }
};

export const savePartyUser = (
  _party: Party,
  _product: Product,
  _user: PartyUserOnCreation
): Promise<any> => new Promise((_, error) => error('TODO'));

export const updatePartyUserStatus = (
  _party: Party,
  _product: Product,
  _user: PartyUser,
  _status: UserStatus
): Promise<any> => new Promise((resolve) => resolve('ok')); // TODO

export const fetchProductRoles = (
  _product?: Product,
): Promise<Array<ProductRole>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_USERS === 'true') {
    return new Promise((resolve)=> resolve(mockedProductRoles));
  } else {
    return new Promise((_, error) => error('TODO'));
  }
}; 