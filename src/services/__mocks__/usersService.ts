import { PageRequest } from '@pagopa/selfcare-common-frontend/model/PageRequest';
import { PageResource } from '@pagopa/selfcare-common-frontend/model/PageResource';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { Party, UserRole, UserStatus } from '../../model/Party';
import {
  PartyUser,
  PartyUserOnCreation,
  PartyUserProduct,
  PartyUserProductRole,
} from '../../model/PartyUser';
import { Product } from '../../model/Product';
import { ProductRole } from '../../model/ProductRole';

export const mockedUsers: Array<PartyUser> = [
  {
    id: 'uid',
    taxCode: 'TAXCODE_uid',
    name: 'ELENA',
    surname: 'Verdi',
    email: 'simone.v@comune.milano.it ',
    userRole: 'ADMIN',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel1',
            role: 'incaricato-ente-creditore',
            selcRole: 'ADMIN',
            status: 'ACTIVE',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
  {
    id: '0',
    taxCode: 'TAXCODE_0',
    name: 'loggedName',
    surname: 'loggedSurname',
    email: 'loggedName.b@email.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel2',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'ACTIVE',
          },
        ],
      },
    ],
    isCurrentUser: true,
    certification: true,
  },
  {
    id: 'uid3',
    taxCode: 'TAXCODE_uid3',
    name: 'Simone',
    surname: 'Bianchi Verdi Verdi Verdi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel3',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'SUSPENDED',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
  {
    id: 'uid4',
    taxCode: 'TAXCODE_uid4',
    name: 'Simone',
    surname: 'Simonetti',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel4',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'ACTIVE',
          },
          {
            relationshipId: 'rel4_2',
            role: 'operatore-sicurezza',
            selcRole: 'LIMITED',
            status: 'SUSPENDED',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
  {
    id: 'uid5',
    taxCode: 'TAXCODE_uid5',
    name: 'Simone',
    surname: 'Franceschini Alberti',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel4',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'SUSPENDED',
          },
          {
            relationshipId: 'rel4_2',
            role: 'operatore-sicurezza',
            selcRole: 'LIMITED',
            status: 'SUSPENDED',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
  {
    id: 'uid6',
    taxCode: 'TAXCODE_uid6',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel6',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'ACTIVE',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
  {
    id: 'uid7',
    taxCode: 'TAXCODE_uid7',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel7',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'ACTIVE',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
  {
    id: 'uid8',
    taxCode: 'TAXCODE_uid8',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel8',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'SUSPENDED',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
  {
    id: 'uid9',
    taxCode: 'TAXCODE_uid9',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel9',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'ACTIVE',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
  {
    id: 'uid10',
    taxCode: 'TAXCODE_uid10',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel10',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'ACTIVE',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
  {
    id: 'uid11',
    taxCode: 'TAXCODE_uid11',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel11',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'SUSPENDED',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
  {
    id: 'uid12',
    taxCode: 'TAXCODE_uid12',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel12',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'SUSPENDED',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
  {
    id: 'uid13',
    taxCode: 'TAXCODE_uid13',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel13',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'SUSPENDED',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
  {
    id: 'uid14',
    taxCode: 'TAXCODE_uid14',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel14',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'SUSPENDED',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
  {
    id: 'uid15',
    taxCode: 'TAXCODE_uid15',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel15',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'SUSPENDED',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
  {
    id: 'uid16',
    taxCode: 'TAXCODE_uid16',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel16',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'ACTIVE',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
  {
    id: 'uid17',
    taxCode: 'TAXCODE_uid17',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel17',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'SUSPENDED',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
  {
    id: 'uid18',
    taxCode: 'TAXCODE_uid18',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel18',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'ACTIVE',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
  {
    id: 'uid19',
    taxCode: 'TAXCODE_uid19',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel19',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'ACTIVE',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
  {
    id: 'uid20',
    taxCode: 'TAXCODE_uid20',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel20',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'ACTIVE',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
  {
    id: 'uid21',
    taxCode: 'TAXCODE_uid21',
    name: 'Simone',
    surname: 'Bianchi',
    email: 'giuseppe.b@comune.milano.it ',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: '1',
        roles: [
          {
            relationshipId: 'rel21',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'ACTIVE',
          },
        ],
      },
    ],
    isCurrentUser: false,
    certification: true,
  },
];

export const mockedProductRoles: Array<ProductRole> = [
  {
    productId: 'PRODID',
    selcRole: 'ADMIN',
    productRole: 'incaricato-ente-creditore',
    title: 'Incaricato Ente Creditore',
    description: 'Descrizione ruolo Incaricato Ente Creditore',
  },
  {
    productId: 'PRODID',
    selcRole: 'LIMITED',
    productRole: 'referente-tecnico',
    title: 'Referente Tecnico',
    description: 'Descrizione ruolo Referente Tecnico',
  },
  {
    productId: 'PRODID',
    selcRole: 'LIMITED',
    productRole: 'operatore-sicurezza',
    title: 'Operatore sicurezza',
    description: 'Descrizione ruolo Operatore sicurezza',
  },
];

export const fetchPartyUsers = (
  pageRequest: PageRequest,
  _party: Party,
  _currentUser: User,
  _checkPermission: boolean,
  product?: Product,
  selcRoles?: Array<UserRole>,
  productRoles?: Array<ProductRole>
): Promise<PageResource<PartyUser>> => {
  const content = pageRequest.page === 9 ? mockedUsers.slice(1, 5) : mockedUsers;
  const filteredContent = content.map((u) =>
    Object.assign(
      {},
      u,
      product
        ? {
            products: [
              {
                title: product.title,
                id: product.id,
                roles:
                  productRoles && productRoles.length > 0
                    ? productRoles.map((r, i) => ({
                        relationshipId: `rel_${i}`,
                        role: r.productRole,
                        selcRole: selcRoles ? selcRoles[0] : r.selcRole,
                        status: u.products[0].roles[0].status,
                      }))
                    : u.products[0].roles,
              },
            ],
          }
        : {},
      selcRoles && selcRoles.length > 0 ? { userRole: selcRoles[0] } : {}
    )
  );
  const page = {
    number: pageRequest.page,
    size: pageRequest.size,
    totalElements: 195,
    totalPages: 10,
  };
  return new Promise((resolve) =>
    setTimeout(() => resolve({ content: filteredContent, page }), 100)
  );
};

export const fetchProductRoles = (_product: Product): Promise<Array<ProductRole>> =>
  new Promise((resolve) => resolve(mockedProductRoles));

export const savePartyUser = (
  _party: Party,
  _product: Product,
  _user: PartyUserOnCreation
): Promise<any> => new Promise((resolve) => resolve(200));

export const updatePartyUserStatus = (
  _party: Party,
  _user: PartyUser,
  _product: PartyUserProduct,
  role: PartyUserProductRole,
  status: UserStatus
): Promise<any> => {
  if (status === 'ACTIVE' || status === 'SUSPENDED') {
    // eslint-disable-next-line functional/immutable-data
    role.status = status;
    return new Promise<void>((resolve) => resolve());
  } else {
    throw new Error(`Not allowed next status: ${status}`);
  }
};

export const deletePartyUser = (
  _party: Party,
  user: PartyUser,
  product: PartyUserProduct,
  role: PartyUserProductRole
): Promise<any> => {
  if (product.roles.length === 1) {
    // eslint-disable-next-line functional/immutable-data
    mockedUsers.splice(
      mockedUsers.findIndex((u) => u === user),
      1
    );
  } else {
    // eslint-disable-next-line functional/immutable-data
    product.roles.splice(
      product.roles.findIndex((r) => r === role),
      1
    );
  }
  return new Promise<void>((resolve) => resolve());
};
