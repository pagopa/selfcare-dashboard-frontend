import { PageRequest } from '@pagopa/selfcare-common-frontend/model/PageRequest';
import { PageResource } from '@pagopa/selfcare-common-frontend/model/PageResource';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { Party, UserRole } from '../../model/Party';
import { PartyUser, PartyUserOnCreation, PartyUserOnEdit } from '../../model/PartyUser';
import { Product } from '../../model/Product';
import { ProductRole } from '../../model/ProductRole';
import { UserRegistry } from '../../model/UserRegistry';

export const mockedUsers: Array<PartyUser> = [
  {
    id: 'uid',
    taxCode: 'AAAAAA11A11A123A',
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
    certification: true,
  },
  {
    id: '0',
    taxCode: 'ASDFGH12W22S546G',
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
    certification: true,
  },
  {
    id: 'uid3',
    taxCode: 'UERWQA99Z11A543K',
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
    certification: true,
  },
  {
    id: 'uid4',
    taxCode: 'IERKME22D55B45J',
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
    certification: false,
  },
  {
    id: 'uid5',
    taxCode: 'IERKME22D55B45J',
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
    certification: false,
  },
  {
    id: 'uid6',
    taxCode: 'IERKME22D55B45J',
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
    certification: true,
  },
  {
    id: 'uid7',
    taxCode: 'IERKME22D55B45E',
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
    certification: false,
  },
  {
    id: 'uid8',
    taxCode: 'IERKME22D55B45E',
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
    certification: false,
  },
  {
    id: 'uid9',
    taxCode: 'IERKME22D55B45S',
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
    certification: true,
  },
  {
    id: 'uid10',
    taxCode: 'IERKME22D55B45Q',
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
    certification: true,
  },
  {
    id: 'uid11',
    taxCode: 'IERKME22D55B455L',
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
    certification: true,
  },
  {
    id: 'uid12',
    taxCode: 'IERKME22D55B23Y',
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
    certification: true,
  },
  {
    id: 'uid13',
    taxCode: 'IERKME22D55B92K',
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
    certification: true,
  },
  {
    id: 'uid14',
    taxCode: 'IERKME22D55B342Q',
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
    certification: false,
  },
  {
    id: 'uid15',
    taxCode: 'JUZOPQ22D55B45E',
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
    certification: false,
  },
  {
    id: 'uid16',
    taxCode: 'GURTTB22D55B45E',
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
    certification: false,
  },
  {
    id: 'uid17',
    taxCode: 'POEFFC54D55B45E',
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
    certification: false,
  },
  {
    id: 'uid18',
    taxCode: 'MAJERV76D55B45E',
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
    certification: true,
  },
  {
    id: 'uid19',
    taxCode: 'TRWCVB12D55B45E',
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
    certification: true,
  },
  {
    id: 'uid20',
    taxCode: 'MJROIW52D55B45E',
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
    certification: true,
  },
  {
    id: 'uid21',
    taxCode: 'EIIRTY22C64B239R',
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
    certification: true,
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

export const mockedUserRegistry: UserRegistry = {
  taxCode: 'AAAAAA11A11A234S',
  name: 'franco',
  surname: 'rossi',
  email: 'f@r.com',
  certification: true,
};

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

export const updatePartyUser = (_party: Party, _user: PartyUserOnEdit): Promise<any> =>
  new Promise((resolve) => resolve(200));

export const fetchUserRegistryByFiscalCode = (_taxCode: string): Promise<UserRegistry> =>
  new Promise((resolve) => resolve(mockedUserRegistry));

export const fetchUserRegistryByUserID = (_uid: string): Promise<UserRegistry> =>
  new Promise((resolve) => resolve(mockedUserRegistry));
