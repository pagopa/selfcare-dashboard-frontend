import { PageRequest } from '@pagopa/selfcare-common-frontend/model/PageRequest';
import { PageResource } from '@pagopa/selfcare-common-frontend/model/PageResource';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import {
  applySort,
  extractPageRequest,
} from '@pagopa/selfcare-common-frontend/hooks/useFakePagination';
import { Party, UserRole, UserStatus } from '../../model/Party';
import {
  PartyUser,
  PartyUserOnCreation,
  PartyUserOnEdit,
  PartyUserProduct,
  PartyUserProductRole,
} from '../../model/PartyUser';
import { Product } from '../../model/Product';
import { ProductRole } from '../../model/ProductRole';
import { UserRegistry } from '../../model/UserRegistry';

export const mockedUsers: Array<PartyUser> = [
  {
    id: 'uid',
    taxCode: 'AAAAAA11A11A123K',
    name: 'Elena',
    surname: 'Verdi',
    email: 'simone.v@comune.milano.it',
    userRole: 'ADMIN',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
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
    taxCode: 'AAAAAA11A11A124A',
    name: 'loggedName',
    surname: 'loggedSurname',
    email: 'loggedName.b@email.it',
    userRole: 'ADMIN',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
        roles: [
          {
            relationshipId: 'rel2',
            role: 'incaricato-ente-creditore',
            selcRole: 'ADMIN',
            status: 'ACTIVE',
          },
        ],
      },
      {
        title: 'Piattaforma Notifiche',
        id: 'prod-pn',
        roles: [
          {
            relationshipId: 'rel2',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'ACTIVE',
          },
        ],
      },
      {
        title: 'App IO',
        id: 'prod-pagopa',
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
    taxCode: 'TAXCOD03A00A123P',
    name: 'Simone3',
    surname: 'Bianchi3 Verdi Verdi Verdi',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
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
    taxCode: 'TAXCOD04A00A123P',
    name: 'Simone',
    surname: 'Simonetti',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
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
    taxCode: 'TAXCOD05A00A123P',
    name: 'Simone',
    surname: 'Franceschini Alberti',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
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
    taxCode: 'TAXCOD06A00A123P',
    name: 'Simone6',
    surname: 'Bianchi6',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
        roles: [
          {
            relationshipId: 'rel6',
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
    id: 'uid7',
    taxCode: 'TAXCOD07A00A123P',
    name: 'Simone7',
    surname: 'Bianchi7',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'Piattaforma Notifiche',
        id: 'prod-pn',
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
    taxCode: 'TAXCOD08A00A123P',
    name: 'Simone8',
    surname: 'Bianchi8',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
        roles: [
          {
            relationshipId: 'rel8',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'ACTIVE',
          },
          {
            relationshipId: 'rel8_2',
            role: 'operatore-sicurezza',
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
    id: 'uid9',
    taxCode: 'TAXCOD09A00A123P',
    name: 'Simone9',
    surname: 'Bianchi9',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
        roles: [
          {
            relationshipId: 'rel9',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'ACTIVE',
          },
          {
            relationshipId: 'rel9_2',
            role: 'operatore-sicurezza',
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
    taxCode: 'TAXCOD10A00A123P',
    name: 'Simone10',
    surname: 'Bianchi10',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
        roles: [
          {
            relationshipId: 'rel10',
            role: 'referente-tecnico',
            selcRole: 'LIMITED',
            status: 'ACTIVE',
          },
          {
            relationshipId: 'rel10_2',
            role: 'operatore-sicurezza',
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
    taxCode: 'TAXCOD11A00A123P',
    name: 'Simone11',
    surname: 'Bianchi11',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
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
    taxCode: 'TAXCOD12A00A123P',
    name: 'Simone12',
    surname: 'Bianchi12',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
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
    taxCode: 'TAXCOD13A00A123P',
    name: 'Simone13',
    surname: 'Bianchi13',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
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
    taxCode: 'TAXCOD14A00A123P',
    name: 'Simone14',
    surname: 'Bianchi14',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
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
    taxCode: 'TAXCOD15A00A123P',
    name: 'Simone15',
    surname: 'Bianchi15',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
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
    taxCode: 'TAXCOD16A00A123P',
    name: 'Simone16',
    surname: 'Bianchi16',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
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
    taxCode: 'TAXCOD17A00A123P',
    name: 'Simone17',
    surname: 'Bianchi17',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'SUSPENDED',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
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
    taxCode: 'TAXCOD18A00A123P',
    name: 'Simone18',
    surname: 'Bianchi18',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
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
    taxCode: 'TAXCOD19A00A123P',
    name: 'Simone19',
    surname: 'Bianchi19',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
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
    taxCode: 'TAXCOD20A00A123P',
    name: 'Simone20',
    surname: 'Bianchi20',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
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
    taxCode: 'TAXCOD21A00A123P',
    name: 'Simone21',
    surname: 'Bianchi21',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
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
  {
    id: 'uid22',
    taxCode: 'TAXCOD22A00A123P',
    name: 'Simone22',
    surname: 'Bianchi22',
    email: 'giuseppe.b@comune.milano.it',
    userRole: 'LIMITED',
    status: 'ACTIVE',
    products: [
      {
        title: 'App IO',
        id: 'prod-io',
        roles: [
          {
            relationshipId: 'rel22',
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
    partyRole: 'MANAGER',
    selcRole: 'ADMIN',
    multiroleAllowed: false,
    productRole: 'referente-legale',
    title: 'Referente Legale',
    description: 'Descrizione referente-legale',
  },
  {
    productId: 'PRODID',
    partyRole: 'DELEGATE',
    selcRole: 'ADMIN',
    multiroleAllowed: false,
    productRole: 'referente-amministrativo',
    title: 'Referente Amministrativo',
    description: 'Descrizione referente-amministrativo',
  },
  {
    productId: 'PRODID',
    partyRole: 'SUB_DELEGATE',
    selcRole: 'ADMIN',
    multiroleAllowed: false,
    productRole: 'incaricato-ente-creditore',
    title: 'Incaricato Ente Creditore',
    description: 'Descrizione incaricato-ente-creditore',
  },
  {
    productId: 'PRODID',
    partyRole: 'OPERATOR',
    selcRole: 'LIMITED',
    multiroleAllowed: true,
    productRole: 'referente-dei-pagamenti',
    title: 'Referente dei Pagamenti',
    description: 'Descrizione referente-dei-pagamenti',
  },
  {
    productId: 'PRODID',
    partyRole: 'OPERATOR',
    selcRole: 'LIMITED',
    multiroleAllowed: true,
    productRole: 'referente-tecnico',
    title: 'Referente Tecnico',
    description: 'Descrizione referente-tecnico',
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
  selcRoles?: Array<UserRole>,
  productRoles?: Array<ProductRole>
): Promise<PageResource<PartyUser>> => {
  const filteredContent = mockedUsers
    .filter((u) => {
      if (
        selcRoles &&
        selcRoles.length > 0 &&
        !u.products.find((p) => p.roles.find((r) => selcRoles.indexOf(r.selcRole) > -1))
      ) {
        return false;
      }
      if (
        productRoles &&
        productRoles.length > 0 &&
        !u.products.find((p) =>
          p.roles.find((r) => productRoles.map((r) => r.productRole).indexOf(r.role) > -1)
        )
      ) {
        return false;
      }
      if (product && !u.products.find((p) => p.id === product.id)) {
        return false;
      }
      return u;
    })
    .map((u) => JSON.parse(JSON.stringify(u)));

  if (pageRequest.sort) {
    applySort(filteredContent, pageRequest.sort);
  }
  return new Promise((resolve) =>
    setTimeout(() => resolve(extractPageRequest(filteredContent, pageRequest)), 100)
  );
};

export const fetchProductRoles = (product: Product): Promise<Array<ProductRole>> => {
  const out = mockedProductRoles.map((r) =>
    Object.assign(
      {},
      r,
      { productId: product.id },
      { multiroleAllowed: product.id === 'prod-interop' && r.partyRole === 'OPERATOR' }
    )
  );
  return new Promise((resolve) => resolve(out));
};

export const savePartyUser = (
  _party: Party,
  _product: Product,
  _user: PartyUserOnCreation
): Promise<any> => new Promise((resolve) => resolve(200));

export const updatePartyUser = (_party: Party, _user: PartyUserOnEdit): Promise<any> =>
  new Promise((resolve) => resolve(200));

export const fetchUserRegistryByFiscalCode = (_taxCode: string): Promise<UserRegistry> =>
  new Promise((resolve) => resolve(mockedUserRegistry));

export const fetchPartyUser = (
  _institutionId: string,
  userId: string,
  _currentUser: User
): Promise<PartyUser | null> => {
  const mockedUser = mockedUsers.find((u) => u.id === userId) ?? null;
  return new Promise((resolve) =>
    resolve(mockedUser ? JSON.parse(JSON.stringify(mockedUser)) : null)
  );
};

export const updatePartyUserStatus = (
  _party: Party,
  user: PartyUser,
  _product: PartyUserProduct,
  role: PartyUserProductRole,
  status: UserStatus
): Promise<any> => {
  if (status === 'ACTIVE' || status === 'SUSPENDED') {
    // eslint-disable-next-line functional/immutable-data
    role.status = status;
    if (user.status !== status) {
      if (status === 'ACTIVE') {
        // eslint-disable-next-line functional/immutable-data
        user.status = 'ACTIVE';
      } else if (!user.products.find((p) => p.roles.find((r) => r.status === 'ACTIVE'))) {
        // eslint-disable-next-line functional/immutable-data
        user.status = 'SUSPENDED';
      }
    }
    // eslint-disable-next-line functional/immutable-data
    mockedUsers.splice(
      mockedUsers.findIndex((u) => u.id === user.id),
      1,
      user
    );

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
  if (user.products.length === 1 && product.roles.length === 1) {
    // eslint-disable-next-line functional/immutable-data
    mockedUsers.splice(
      mockedUsers.findIndex((u) => u.id === user.id),
      1
    );
  } else {
    // eslint-disable-next-line functional/immutable-data
    product.roles.splice(
      product.roles.findIndex((r) => r.relationshipId === role.relationshipId),
      1
    );
    const mockedUser = mockedUsers.find((u) => u.id === user.id);
    const mockedProductIndex = mockedUser?.products.findIndex((p) => p.id === product.id) ?? -1;
    if (mockedProductIndex > -1) {
      const mockedProduct = mockedUser?.products[mockedProductIndex];
      if (mockedProduct?.roles.length === 1) {
        // eslint-disable-next-line functional/immutable-data
        mockedUser?.products.splice(mockedProductIndex, 1);
      } else {
        const mockedRoleIndex =
          mockedProduct?.roles.findIndex((r) => r.relationshipId === role.relationshipId) ?? -1;
        if (mockedRoleIndex > -1) {
          // eslint-disable-next-line functional/immutable-data
          mockedProduct?.roles.splice(mockedRoleIndex, 1);
        }
      }
    }
  }
  return new Promise<void>((resolve) => resolve());
};
