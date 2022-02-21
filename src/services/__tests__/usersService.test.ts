import {
  mockedInstitutionUserResource,
  mockedProductUserResource,
  mockedProductRoles,
} from '../../api/__mocks__/DashboardApiClient';
import { DashboardApi } from '../../api/DashboardApiClient';
import {
  fetchPartyUsers,
  savePartyUser,
  updatePartyUserStatus,
  fetchProductRoles,
  deletePartyUser,
} from '../usersService';
import { mockedParties } from '../__mocks__/partyService';
import { mockedPartyProducts } from '../__mocks__/productService';
import { mockedUser } from '../../__mocks__/@pagopa/selfcare-common-frontend/decorators/withLogin';
import {
  institutionUserResource2PartyUser,
  PartyUser,
  PartyUserOnCreation,
  productUserResource2PartyUser,
} from '../../model/PartyUser';
import { mockedUsers } from '../__mocks__/usersService';

jest.mock('../../api/DashboardApiClient');

beforeEach(() => {
  jest.spyOn(DashboardApi, 'getPartyUsers');
  jest.spyOn(DashboardApi, 'getPartyProductUsers');
  jest.spyOn(DashboardApi, 'savePartyUser');
  jest.spyOn(DashboardApi, 'suspendPartyRelation');
  jest.spyOn(DashboardApi, 'activatePartyRelation');
  jest.spyOn(DashboardApi, 'getProductRoles');
  jest.spyOn(DashboardApi, 'deletePartyRelation');
});

describe('Test fetchPartyUsers', () => {
  const testNoProductFilter = async (checkPermission: boolean) => {
    const partyUsers = await fetchPartyUsers(
      { page: 0, size: 20 },
      mockedParties[0],
      mockedUser,
      checkPermission,
      undefined,
      ['ADMIN']
    );

    expect(partyUsers).toMatchObject({
      page: {
        number: 0,
        size: mockedInstitutionUserResource.length,
        totalElements: mockedInstitutionUserResource.length,
        totalPages: 1,
      },
      content: mockedInstitutionUserResource.map((u) =>
        institutionUserResource2PartyUser(u, mockedUser)
      ),
    });

    expect(DashboardApi.getPartyUsers).toBeCalledTimes(1);
    expect(DashboardApi.getPartyUsers).toBeCalledWith(
      mockedParties[0].institutionId,
      undefined,
      'ADMIN'
    );
    expect(DashboardApi.getPartyProductUsers).toBeCalledTimes(0);
  };

  test('Test CheckPermission True', async () => {
    await testNoProductFilter(true);

    const partyProductUsers = await fetchPartyUsers(
      { page: 0, size: 20 },
      mockedParties[0],
      mockedUser,
      true,
      mockedPartyProducts[0],
      ['LIMITED']
    );

    expect(partyProductUsers).toMatchObject({
      page: {
        number: 0,
        size: mockedProductUserResource.length,
        totalElements: mockedProductUserResource.length,
        totalPages: 1,
      },
      content: mockedProductUserResource.map((r) => productUserResource2PartyUser(r, mockedUser)),
    });

    expect(DashboardApi.getPartyUsers).toBeCalledTimes(1);
    expect(DashboardApi.getPartyProductUsers).toBeCalledTimes(1);
    expect(DashboardApi.getPartyProductUsers).toBeCalledWith(
      mockedParties[0].institutionId,
      mockedPartyProducts[0].id,
      'LIMITED'
    );
  });

  test('Test CheckPermission False', async () => {
    await testNoProductFilter(false);

    const partyProductUsers = await fetchPartyUsers(
      { page: 0, size: 20 },
      mockedParties[0],
      mockedUser,
      false,
      mockedPartyProducts[0],
      ['LIMITED']
    );

    expect(partyProductUsers).toMatchObject({
      page: {
        number: 0,
        size: mockedProductUserResource.length,
        totalElements: mockedProductUserResource.length,
        totalPages: 1,
      },
      content: mockedInstitutionUserResource.map((u) =>
        institutionUserResource2PartyUser(u, mockedUser)
      ),
    });

    expect(DashboardApi.getPartyUsers).toBeCalledTimes(2);
    expect(DashboardApi.getPartyUsers).toBeCalledWith(
      mockedParties[0].institutionId,
      mockedPartyProducts[0].id,
      'LIMITED'
    );
    expect(DashboardApi.getPartyProductUsers).toBeCalledTimes(0);
  });
});

test('Test fetchProductRoles', async () => {
  const productRoles = await fetchProductRoles(mockedPartyProducts[0]);

  expect(productRoles).toStrictEqual([
    {
      productId: mockedPartyProducts[0].id,
      partyRole: 'SUB_DELEGATE',
      selcRole: 'ADMIN',
      multiroleAllowed: false,
      productRole: 'incaricato-ente-creditore',
      title: 'Incaricato Ente Creditore',
      description: 'Descrizione incaricato-ente-creditore',
    },
    {
      productId: mockedPartyProducts[0].id,
      partyRole: 'OPERATOR',
      selcRole: 'LIMITED',
      multiroleAllowed: true,
      productRole: 'referente-dei-pagamenti',
      title: 'Referente dei Pagamenti',
      description: 'Descrizione referente-dei-pagamenti',
    },
    {
      productId: mockedPartyProducts[0].id,
      partyRole: 'OPERATOR',
      selcRole: 'LIMITED',
      multiroleAllowed: true,
      productRole: 'referente-tecnico',
      title: 'Referente Tecnico',
      description: 'Descrizione referente-tecnico',
    },
  ]);

  expect(DashboardApi.getProductRoles).toBeCalledWith(mockedPartyProducts[0].id);
});

test('Test savePartyUser', async () => {
  const user: PartyUserOnCreation = {
    name: 'Name',
    surname: 'Surname',
    taxCode: 'fiscalCode',
    email: 'email',
    confirmEmail: 'email',
    productRole: 'role',
  };

  await savePartyUser(mockedParties[0], mockedPartyProducts[0], user);

  expect(DashboardApi.savePartyUser).toBeCalledWith(
    mockedParties[0].institutionId,
    mockedPartyProducts[0].id,
    user
  );
});

describe('Test updatePartyUserStatus', () => {
  test('Test updatePartyUserStatus', async () => {
    const partyUser: PartyUser = {
      id: 'id',
      taxCode: 'taxCode',
      name: 'Name',
      surname: 'Surname',
      email: 'email',
      userRole: 'ADMIN',
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
      status: 'ACTIVE',
      isCurrentUser: false,
      certification: true,
    };

    await updatePartyUserStatus(
      mockedParties[0],
      partyUser,
      partyUser.products[0],
      partyUser.products[0].roles[0],
      'SUSPENDED'
    );

    expect(DashboardApi.suspendPartyRelation).toBeCalledWith('relationshipId');
    expect(DashboardApi.activatePartyRelation).toBeCalledTimes(0);

    await updatePartyUserStatus(
      mockedParties[0],
      partyUser,
      partyUser.products[0],
      partyUser.products[0].roles[0],
      'ACTIVE'
    );

    expect(DashboardApi.suspendPartyRelation).toBeCalledTimes(1);
    expect(DashboardApi.activatePartyRelation).toBeCalledWith('relationshipId');
  });
});

test('Test deletePartyUser', async () => {
  await deletePartyUser(
    mockedParties[0],
    mockedUsers[0],
    mockedUsers[0].products[0],
    mockedUsers[0].products[0].roles[0]
  );

  expect(DashboardApi.deletePartyRelation).toBeCalledWith(
    mockedUsers[0].products[0].roles[0].relationshipId
  );
});
