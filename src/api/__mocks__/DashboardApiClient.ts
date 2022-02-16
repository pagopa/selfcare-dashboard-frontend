import { PartyUserOnCreation } from '../../model/PartyUser';
import { IdentityTokenResource } from '../generated/b4f-dashboard/IdentityTokenResource';
import { InstitutionResource } from '../generated/b4f-dashboard/InstitutionResource';
import {
  InstitutionUserResource,
  RoleEnum,
} from '../generated/b4f-dashboard/InstitutionUserResource';
import { SelcRoleEnum } from '../generated/b4f-dashboard/ProductRoleInfoResource';
import { ProductsResource, StatusEnum } from '../generated/b4f-dashboard/ProductsResource';
import { ProductUserResource } from '../generated/b4f-dashboard/ProductUserResource';

export const mockedInstitutionResources: Array<InstitutionResource> = [
  {
    name: 'Comune di Bari',
    status: 'ACTIVE',
    id: '1',
    category: 'Ente locale',
    mailAddress: 'address',
    fiscalCode: 'fiscalCode',
    userRole: 'LIMITED',
  },
  {
    name: 'Comune di Milano',
    status: 'PENDING',
    id: '2',
    mailAddress: 'address',
    fiscalCode: 'fiscalCode',
    userRole: 'ADMIN',
    category: '',
  },
];

export const mockedProductResources: Array<ProductsResource> = [
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-io/logo.png',
    title: 'App IO',
    description: 'App IO description',
    id: '1',
    authorized: true,
    status: StatusEnum.ACTIVE,
    urlBO: 'http://appio/bo#<IdentityToken>',
    activatedAt: new Date(2021, 1, 1, 0, 0, 0, 0),
    urlPublic: 'http://appio/public',
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-pn/logo.png',
    id: '2',
    title: 'Piattaforma Notifiche',
    description: 'Piattaforma Notifiche description',
    authorized: false,
    status: StatusEnum.ACTIVE,
    urlBO: 'http://notifiche/bo?token=<IdentityToken>',
    activatedAt: new Date(2021, 1, 2, 0, 0, 0, 0),
    urlPublic: 'http://notifiche/public',
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-pagopa/logo.png',
    id: '3',
    title: 'Pagamenti pagoPA',
    description: 'Pagamenti pagoPA description',
    authorized: true,
    status: StatusEnum.ACTIVE,
    urlBO: 'http://pagopa/bo#token=<IdentityToken>',
    activatedAt: new Date(2021, 1, 3, 0, 0, 0, 0),
    urlPublic: 'http://pagopa/public',
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-ciban/logo.png',
    title: 'Check-IBAN',
    description: "Verifica l'abbinamento di un IBAN ad un CF di un cittadino o di un'impresa.",
    id: '4',
    authorized: true,
    status: StatusEnum.PENDING,
    urlPublic: 'http://www.google.it',
    urlBO: 'http://checkiban/bo#token=<IdentityToken>',
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-cgn/logo.png',
    id: '5',
    title: 'Carta Giovani',
    description: 'Richiedi la convenzione e gestisci i dati e le agevolazioni da offrire.',
    authorized: true,
    status: StatusEnum.ACTIVE,
    urlPublic: undefined,
    urlBO: 'http://cgn/bo#token=<IdentityToken>',
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-interop/logo.png',
    id: '6',
    title: 'PDND',
    description: 'Condividi dati con altri Enti in maniera semplice, sicura ed economica.',
    authorized: true,
    status: StatusEnum.INACTIVE,
    urlPublic: undefined,
    urlBO: 'http://PDND/bo#token=<IdentityToken>',
  },
];

export const mockedInstitutionUserResource: Array<InstitutionUserResource> = [
  {
    id: '1',
    name: 'Name',
    surname: 'Surname',
    status: 'PENDING',
    role: 'LIMITED' as RoleEnum,
    email: 'address',
    products: [
      {
        id: 'productId',
        title: 'productTitle',
        roleInfos: [
          {
            relationshipId: 'relId',
            role: 'incaricato-ente-creditore',
            selcRole: SelcRoleEnum.ADMIN,
            status: 'ACTIVE',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Name2',
    surname: 'Surname2',
    status: 'ACTIVE',
    role: 'ADMIN' as RoleEnum,
    email: 'address',
    products: [
      {
        id: 'productId2',
        title: 'productTitle2',
        roleInfos: [
          {
            relationshipId: 'relId',
            role: 'incaricato-ente-creditore',
            selcRole: SelcRoleEnum.ADMIN,
            status: 'ACTIVE',
          },
        ],
      },
    ],
  },
];

export const mockedProductUserResource: Array<ProductUserResource> = [
  {
    id: '1',
    // fiscalCode: "TAXCODE_1", TODO
    name: 'Name',
    surname: 'Surname',
    status: 'PENDING',
    role: 'LIMITED' as RoleEnum,
    email: 'address',
    product: {
      id: 'prod-io',
      title: 'App IO',
      roleInfos: [
        {
          relationshipId: 'relationshipId',
          role: 'incaricato-ente-creditore',
          selcRole: SelcRoleEnum.ADMIN,
          status: 'ACTIVE',
        },
      ],
    },
    certification: true,
  },
  {
    id: '2',
    // fiscalCode: "TAXCODE_1", TODO
    name: 'Name2',
    surname: 'Surname2',
    status: 'ACTIVE',
    role: 'ADMIN' as RoleEnum,
    email: 'address2',
    product: {
      id: 'prod-io',
      title: 'App IO',
      roleInfos: [
        {
          relationshipId: 'relationshipId2',
          role: 'incaricato-ente-creditore',
          selcRole: SelcRoleEnum.ADMIN,
          status: 'ACTIVE',
        },
      ],
    },
    certification: true,
  },
];

export const mockedProductRoles: Array<string> = [
  'Incaricato Ente Creditore',
  'Referente dei Pagamenti',
  'Referente Tecnico',
];

export const DashboardApi = {
  getInstitutions: async (): Promise<Array<InstitutionResource>> =>
    new Promise((resolve) => resolve(mockedInstitutionResources)),

  getInstitution: async (_institutionId: string): Promise<InstitutionResource> =>
    new Promise((resolve) => resolve(mockedInstitutionResources[0])),

  getProducts: async (): Promise<Array<ProductsResource>> =>
    new Promise((resolve) => resolve(mockedProductResources)),

  getTokenExchange: async (
    _hostname: string,
    _institutionId: string,
    _productId: string
  ): Promise<IdentityTokenResource> => new Promise((resolve) => resolve({ token: 'DUMMYTOKEN' })),

  getPartyUsers: async (
    _institutionId: string,
    _role?: string
  ): Promise<Array<InstitutionUserResource>> =>
    new Promise((resolve) => resolve(mockedInstitutionUserResource)),

  getPartyProductUsers: async (
    _institutionId: string,
    _productId: string,
    _role?: string
  ): Promise<Array<ProductUserResource>> =>
    new Promise((resolve) => resolve(mockedProductUserResource)),

  savePartyUser: async (
    _institutionId: string,
    _productId: string,
    _user: PartyUserOnCreation
  ): Promise<void> => new Promise((resolve) => resolve()),

  suspendPartyRelation: async (_relationshipId: string): Promise<void> =>
    new Promise((resolve) => resolve()),

  activatePartyRelation: async (_relationshipId: string): Promise<void> =>
    new Promise((resolve) => resolve()),

  getProductRoles: async (_productId: string): Promise<Array<string>> =>
    new Promise((resolve) => resolve(mockedProductRoles)),

  deletePartyRelation: async (_relationshipId: string): Promise<void> =>
    new Promise<void>((resolve) => resolve()),
};
