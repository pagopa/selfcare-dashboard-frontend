import { PageRequest } from '../../model/PageRequest';
import { PageResource } from '../../model/PageResource';
import { Party, UserRole } from '../../model/Party';
import { PartyUser } from '../../model/PartyUser';
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
  },
  {
    id: 'uid2',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: '1',
        relationshipId: 'rel2',
      },
    ],
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
  product?: Product,
  role?: UserRole
): Promise<PageResource<PartyUser>> => {
  const content = pageRequest.page === 9 ? mockedUsers.slice(1, 5) : mockedUsers;
  const filteredContent = content.map((u) =>
    Object.assign({}, u, product ? { products: u.products } : {}, role ? { userRole: role } : {})
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
