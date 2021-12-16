import {
  InstitutionUserResource,
  RoleEnum,
} from '../../api/generated/b4f-dashboard/InstitutionUserResource';
import { ProductUserResource } from '../../api/generated/b4f-dashboard/ProductUserResource';
import { mockedPartyProducts } from '../../services/__mocks__/productService';
import { institutionUserResource2PartyUser, productUserResource2PartyUser } from '../PartyUser';

test('Test institutionUserResource2PartyUser', () => {
  const institutionUserResource: InstitutionUserResource = {
    id: '1',
    name: 'Name',
    surname: 'Surname',
    status: 'PENDING',
    role: 'LIMITED' as RoleEnum,
    email: 'address',
    products: [{ id: 'productId', title: 'productTitle' }],
  };

  const partyUser = institutionUserResource2PartyUser(institutionUserResource);
  expect(partyUser).toStrictEqual({
    id: '1',
    name: 'Name',
    surname: 'Surname',
    status: 'PENDING',
    userRole: 'LIMITED',
    email: 'address',
    products: [{ id: 'productId', title: 'productTitle' }],
  });
});

test('Test productUserResource2PartyUser', () => {
  const productUserResource: ProductUserResource = {
    id: '1',
    name: 'Name',
    surname: 'Surname',
    status: 'PENDING',
    role: 'LIMITED' as RoleEnum,
    email: 'address',
    relationshipId: 'relationshipId',
  };

  const partyUser = productUserResource2PartyUser(mockedPartyProducts[0], productUserResource);
  expect(partyUser).toStrictEqual({
    id: '1',
    name: 'Name',
    surname: 'Surname',
    status: 'PENDING',
    userRole: 'LIMITED',
    email: 'address',
    products: [
      {
        id: mockedPartyProducts[0].id,
        title: mockedPartyProducts[0].title,
        relationshipId: 'relationshipId',
      },
    ],
  });
});
