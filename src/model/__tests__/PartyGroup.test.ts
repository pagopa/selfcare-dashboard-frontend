import {
  usersGroupPlainResource2PartyGroup,
  usersGroupResource2PartyGroupExt,
} from '../PartyGroup';
import {
  StatusEnum,
  UserGroupPlainResource,
} from '../../api/generated/b4f-dashboard/UserGroupPlainResource';
import { UserGroupResource } from '../../api/generated/b4f-dashboard/UserGroupResource';
import { mockedUser } from '../../__mocks__/@pagopa/selfcare-common-frontend/decorators/withLogin';
import { mockedPartyProducts } from './../../services/__mocks__/productService';
import { RoleEnum } from '../../api/generated/b4f-dashboard/InstitutionUserResource';
import { SelcRoleEnum } from '../../api/generated/b4f-dashboard/ProductRoleInfoResource';

test('Test usersGroupPlainResource2PartyGroup', () => {
  const userGroupPlainResource: UserGroupPlainResource = {
    description: 'groupId1: descriptoion',
    id: 'groupId1',
    institutionId: 'onboarded',
    membersCount: 1,
    name: 'Gruppo1',
    productId: 'prod-io',
    status: StatusEnum.ACTIVE,
    createdAt: new Date('2022-01-01'),
    createdBy: 'uid',
    modifiedAt: new Date('2022-01-01 16:00'),
    modifiedBy: 'uid',
  };

  const partyGroup = usersGroupPlainResource2PartyGroup(userGroupPlainResource);
  expect(partyGroup).toStrictEqual({
    id: 'groupId1',
    institutionId: 'onboarded',
    productId: 'prod-io',
    name: 'Gruppo1',
    description: 'groupId1: descriptoion',
    status: 'ACTIVE',
    membersCount: 1,
    createdAt: new Date('2022-01-01'),
    modifiedAt: new Date('2022-01-01 16:00'),
  });
});

test('Test usersGroupResource2PartyGroupExt', () => {
  const usersGroupResource: UserGroupResource = {
    description: 'groupId1: descriptoion',
    id: 'groupId1',
    institutionId: 'onboarded',
    members: [
      {
        certification: true,
        email: 'address',
        fiscalCode: 'fiscalCode',
        id: '1',
        name: 'Name',
        product: {
          id: 'productId',
          roleInfos: [
            {
              relationshipId: 'relationshipId',
              role: RoleEnum.ADMIN,
              selcRole: SelcRoleEnum.ADMIN,
              status: 'ACTIVE',
            },
          ],
        },
        role: RoleEnum.ADMIN,
        status: 'PENDING',
        surname: 'LIMITED',
      },
    ],
    name: 'Gruppo1',
    productId: 'prod-io',
    status: StatusEnum.ACTIVE,
  };

  const partyGroup = usersGroupResource2PartyGroupExt(
    usersGroupResource,
    mockedUser,
    mockedPartyProducts[0]
  );
  expect(partyGroup).toStrictEqual({
    id: 'groupId1',
    institutionId: 'onboarded',
    productId: 'prod-io',
    name: 'Gruppo1',
    description: 'groupId1: descriptoion',
    status: 'ACTIVE',
    membersCount: 1,
    createdAt: undefined,
    modifiedAt: undefined,
    members: [
      {
        certification: true,
        email: 'address',
        taxCode: 'fiscalCode',
        id: '1',
        isCurrentUser: false,
        name: 'Name',
        products: [
          {
            id: 'productId',
            roles: [
              {
                relationshipId: 'relationshipId',
                role: 'ADMIN',
                selcRole: 'ADMIN',
                status: 'ACTIVE',
              },
            ],
            title: 'App IO',
          },
        ],
        userRole: 'ADMIN',
        status: 'PENDING',
        surname: 'LIMITED',
      },
    ],
    createdBy: undefined,
    modifiedBy: undefined,
  });
});
