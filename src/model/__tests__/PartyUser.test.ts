import {
  InstitutionUserResource,
  RoleEnum,
} from '../../api/generated/b4f-dashboard/InstitutionUserResource';
import { SelcRoleEnum } from '../../api/generated/b4f-dashboard/ProductRoleInfoResource';
import { ProductUserResource } from '../../api/generated/b4f-dashboard/ProductUserResource';
import { mockedPartyProducts } from '../../services/__mocks__/productService';
import { mockedUser } from '../../__mocks__/@pagopa/selfcare-common-frontend/decorators/withLogin';
import { institutionUserResource2PartyUser, productUserResource2PartyUser } from '../PartyUser';

test('Test institutionUserResource2PartyUser', () => {
  const institutionUserResource: InstitutionUserResource = {
    id: '1',
    // fiscalCode: "fiscalCode" TODO
    name: 'Name',
    surname: 'Surname',
    status: 'PENDING',
    role: 'LIMITED' as RoleEnum,
    email: 'address',
    // certification: true, TODO
    products: [
      {
        id: 'productId',
        title: 'productTitle',
        roleInfos: [
          {
            relationshipId: 'relationshipId',
            role: 'productRole',
            selcRole: SelcRoleEnum.ADMIN,
            status: 'ACTIVE',
          },
        ],
      },
    ],
  };

  const partyUser = institutionUserResource2PartyUser(institutionUserResource, mockedUser);
  expect(partyUser).toStrictEqual({
    id: '1',
    taxCode: 'TODO',
    name: 'Name',
    surname: 'Surname',
    status: 'PENDING',
    userRole: 'LIMITED',
    email: 'address',
    certification: false, // TODO
    products: [
      {
        id: 'productId',
        title: 'productTitle',
        roles: [
          {
            relationshipId: 'relationshipId',
            role: 'productRole',
            selcRole: 'ADMIN',
            status: 'ACTIVE',
          },
        ],
      },
    ],
    isCurrentUser: false,
  });

  institutionUserResource.id = mockedUser.uid;
  expect(
    institutionUserResource2PartyUser(institutionUserResource, mockedUser).isCurrentUser
  ).toBeTruthy();
});

test('Test productUserResource2PartyUser', () => {
  const productUserResource: ProductUserResource = {
    id: '1',
    // fiscalCode: "fiscalCode", TODO
    name: 'Name',
    surname: 'Surname',
    status: 'PENDING',
    role: 'LIMITED' as RoleEnum,
    email: 'address',
    certification: true,
    product: {
      id: 'productId',
      title: 'productTitle',
      roleInfos: [
        {
          relationshipId: 'relationshipId',
          role: 'productRole',
          selcRole: SelcRoleEnum.ADMIN,
          status: 'ACTIVE',
        },
      ],
    },
  };

  const partyUser = productUserResource2PartyUser(productUserResource, mockedUser);
  expect(partyUser).toStrictEqual({
    id: '1',
    taxCode: 'TODO',
    name: 'Name',
    surname: 'Surname',
    status: 'PENDING',
    userRole: 'LIMITED',
    email: 'address',
    certification: true,
    products: [
      {
        id: 'productId',
        title: 'productTitle',
        roles: [
          {
            relationshipId: 'relationshipId',
            role: 'productRole',
            selcRole: 'ADMIN',
            status: 'ACTIVE',
          },
        ],
      },
    ],
    isCurrentUser: false,
  });

  productUserResource.id = mockedUser.uid;
  expect(productUserResource2PartyUser(productUserResource, mockedUser).isCurrentUser).toBeTruthy();
});
