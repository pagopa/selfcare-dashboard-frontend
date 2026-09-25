import { mockedProductRoles } from '../../services/__mocks__/productService';
import { productRoles2ProductRolesList } from '../ProductRole';

test('builds product role lists and indexes', () => {
  const rolesList = productRoles2ProductRolesList(mockedProductRoles);

  expect(rolesList.list).toEqual(mockedProductRoles);
  expect(rolesList.groupBySelcRole.ADMIN).toHaveLength(3);
  expect(rolesList.groupBySelcRole.LIMITED).toHaveLength(2);
  expect(rolesList.groupBySelcRole.ADMIN_EA).toHaveLength(1);
  expect(rolesList.groupByPartyRole.MANAGER).toHaveLength(1);
  expect(rolesList.groupByPartyRole.DELEGATE).toHaveLength(1);
  expect(rolesList.groupByPartyRole.OPERATOR).toHaveLength(2);
  expect(rolesList.groupByPartyRole.SUB_DELEGATE).toHaveLength(1);
  expect(rolesList.groupByPartyRole.ADMIN_EA_IO).toHaveLength(1);
  expect(rolesList.groupByProductRole['referente-legale']).toEqual(mockedProductRoles[0]);
  expect(rolesList.groupByProductRole['referente-tecnico']).toEqual(mockedProductRoles[4]);
});
