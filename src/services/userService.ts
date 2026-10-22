import { DashboardApi } from '../api/DashboardApiClient';
import { ProductUser, productUserResource2ProductUser } from '../model/ProductUser';
import { mockedLocalProductAdmins } from './__mocks__/userService';

// Party roles of the users that can be listed as admins in a contract update
export const PRODUCT_ADMIN_ROLES = ['DELEGATE', 'SUB_DELEGATE', 'MANAGER', 'ADMIN_EA', 'ADMIN_EA_IO'];

export const fetchProductAdmins = (
  institutionId: string,
  productId: string
): Promise<Array<ProductUser>> => {
  /* istanbul ignore if */
  if (import.meta.env.VITE_API_MOCK_PARTIES === 'true') {
    return Promise.resolve(mockedLocalProductAdmins);
  }
  return DashboardApi.getProductUsers(institutionId, productId, PRODUCT_ADMIN_ROLES).then((users) =>
    users.map(productUserResource2ProductUser)
  );
};
