import { PageRequest } from '@pagopa/selfcare-common-frontend/model/PageRequest';
import { PageResource } from '@pagopa/selfcare-common-frontend/model/PageResource';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { Party, UserRole } from '../../model/Party';
import { PartyUser, PartyUserOnCreation } from '../../model/PartyUser';
import { Product } from '../../model/Product';
import { ProductRole } from '../../model/ProductRole';

export const mockedUsers: Array<PartyUser> = [
  {
    id: 'uid',
    name: 'ELENA',
    surname: 'Verdi',
    email: 'simone.v@comune.milano.it ',
    userRole: 'ADMIN',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel1',
      },
    ],
    isCurrentUser: false,
  },
  {
    id: '0',
    name: 'loggedName',
    surname: 'loggedSurname',
    email: 'loggedName.b@email.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel2',
      },
    ],
    isCurrentUser: true,
  },
  {
    id: 'uid3',
    name: 'Simone',
    surname: 'Bianchi Verdi Verdi Verdi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel3',
      },
    ],
    isCurrentUser: false,
  },
  {
    id: 'uid4',
    name: 'Simone',
    surname: 'Simonetti',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel4',
      },
    ],
    isCurrentUser: false,
  },
  {
    id: 'uid5',
    name: 'Simone',
    surname: 'Franceschini Alberti',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel5',
      },
    ],
    isCurrentUser: false,
  },
  {
    id: 'uid6',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel6',
      },
    ],
    isCurrentUser: false,
  },
  {
    id: 'uid7',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel7',
      },
    ],
    isCurrentUser: false,
  },
  {
    id: 'uid8',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel8',
      },
    ],
    isCurrentUser: false,
  },
  {
    id: 'uid9',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel9',
      },
    ],
    isCurrentUser: false,
  },
  {
    id: 'uid10',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel10',
      },
    ],
    isCurrentUser: false,
  },
  {
    id: 'uid11',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel11',
      },
    ],
    isCurrentUser: false,
  },
  {
    id: 'uid12',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel12',
      },
    ],
    isCurrentUser: false,
  },
  {
    id: 'uid13',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel13',
      },
    ],
    isCurrentUser: false,
  },
  {
    id: 'uid14',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel14',
      },
    ],
    isCurrentUser: false,
  },
  {
    id: 'uid15',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel15',
      },
    ],
    isCurrentUser: false,
  },
  {
    id: 'uid16',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel16',
      },
    ],
    isCurrentUser: false,
  },
  {
    id: 'uid17',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel17',
      },
    ],
    isCurrentUser: false,
  },
  {
    id: 'uid18',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel18',
      },
    ],
    isCurrentUser: false,
  },
  {
    id: 'uid19',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel19',
      },
    ],
    isCurrentUser: false,
  },
  {
    id: 'uid20',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel20',
      },
    ],
    isCurrentUser: false,
  },
  {
    id: 'uid21',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel21',
      },
    ],
    isCurrentUser: false,
  },
];

export const mockedProductRoles = [
  {
    productRole: 'Incaricato Ente Creditore',
  },
  {
    productRole: 'Referente dei Pagamenti',
  },
  {
    productRole: 'Referente Tecnico',
  },
];

export const fetchPartyUsers = (
  pageRequest: PageRequest,
  _party: Party,
  _currentUser: User,
  _checkPermission: boolean,
  product?: Product,
  role?: UserRole
): Promise<PageResource<PartyUser>> => {
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
};

export const fetchProductRoles = (_product: Product): Promise<Array<ProductRole>> =>
  new Promise((resolve) => resolve(mockedProductRoles));

export const savePartyUser = (
  _party: Party,
  _product: Product,
  _user: PartyUserOnCreation
): Promise<any> => new Promise((resolve) => resolve(200));

export const fetchPartyUser = (_institutionId:string, _userId: string): Promise<PartyUser | null> => new Promise((resolve) => resolve(mockedUsers[0]));