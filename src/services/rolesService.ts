import { PageRequest } from '../model/PageRequest';
import { PageResource } from '../model/PageResource';
import { UserRole } from '../model/Party';
import { Product } from '../model/Product';
import { Role } from '../model/Role';
import { mockedUsers } from './__mocks__/rolesService';

export const fetchPartyRoles = (
  pageRequest: PageRequest,
  _institutionId: string,
  product?: Product,
  role?: UserRole
): Promise<PageResource<Role>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_ROLES === 'true') {
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
