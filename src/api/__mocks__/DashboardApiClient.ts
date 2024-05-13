import { EmailString } from '@pagopa/ts-commons/lib/strings';
import { BrokerResource } from '../generated/b4f-dashboard/BrokerResource';
import { IdentityTokenResource } from '../generated/b4f-dashboard/IdentityTokenResource';
import { InstitutionBaseResource } from '../generated/b4f-dashboard/InstitutionBaseResource';
import {
  InstitutionResource,
  InstitutionTypeEnum,
} from '../generated/b4f-dashboard/InstitutionResource';
import {
  InstitutionUserResource,
  RoleEnum,
} from '../generated/b4f-dashboard/InstitutionUserResource';
import { SelcRoleEnum } from '../generated/b4f-dashboard/ProductRoleInfoResource';
import {
  PartyRoleEnum,
  ProductRoleMappingsResource,
} from '../generated/b4f-dashboard/ProductRoleMappingsResource';
import { ProductsResource, StatusEnum } from '../generated/b4f-dashboard/ProductsResource';
import { ProductUserResource } from '../generated/b4f-dashboard/ProductUserResource';
import { UserResource } from '../generated/b4f-dashboard/UserResource';

export const mockedInstitutionResources: Array<InstitutionResource> = [
  {
    name: 'Comune di Bari',
    id: '1',
    externalId: 'externalId1',
    originId: 'originId1',
    origin: 'IPA',
    category: 'Ente locale',
    mailAddress: 'address',
    fiscalCode: 'fiscalCode',
    institutionType: InstitutionTypeEnum.PA,
    delegation: false,
    address: 'Piazza della Scala, 2',
    zipCode: '20121',
    geographicTaxonomies: undefined,
    recipientCode: '4GBCSDA1',
  },
  {
    name: 'Comune di Milano',
    id: '2',
    externalId: 'externalId2',
    originId: 'originId2',
    origin: 'IPA',
    mailAddress: 'address',
    fiscalCode: 'fiscalCode',
    category: '',
    institutionType: InstitutionTypeEnum.PA,
    delegation: true,
    address: 'Piazza della Scala, 2',
    zipCode: '20121',
    geographicTaxonomies: [],
    recipientCode: '4GBCSDA1',
  },
];

export const mockedProductResources: Array<ProductsResource> = [
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-io/logo.png',
    title: 'App IO',
    description: 'App IO description',
    id: '1',
    status: StatusEnum.ACTIVE,
    urlBO: 'http://appio/bo#<IdentityToken>',
    activatedAt: new Date(2021, 1, 1, 0, 0, 0, 0),
    urlPublic: 'http://appio/public',
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-pn/logo.png',
    id: '2',
    title: 'Piattaforma Notifiche',
    description: 'Piattaforma Notifiche description',
    status: StatusEnum.ACTIVE,
    urlBO: 'http://notifiche/bo?token=<IdentityToken>',
    activatedAt: new Date(2021, 1, 2, 0, 0, 0, 0),
    urlPublic: 'http://notifiche/public',
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-pagopa/logo.png',
    id: '3',
    title: 'Pagamenti pagoPA',
    description: 'Pagamenti pagoPA description',
    status: StatusEnum.ACTIVE,
    urlBO: 'http://pagopa/bo#token=<IdentityToken>',
    activatedAt: new Date(2021, 1, 3, 0, 0, 0, 0),
    urlPublic: 'http://pagopa/public',
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-ciban/logo.png',
    title: 'Check-IBAN',
    description: "Verifica l'abbinamento di un IBAN ad un CF di un cittadino o di un'impresa.",
    id: '4',
    status: StatusEnum.ACTIVE,
    urlPublic: 'http://www.google.it',
    urlBO: 'http://checkiban/bo#token=<IdentityToken>',
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-cgn/logo.png',
    id: '5',
    title: 'Carta Giovani',
    description: 'Richiedi la convenzione e gestisci i dati e le agevolazioni da offrire.',
    status: StatusEnum.ACTIVE,
    urlPublic: undefined,
    urlBO: 'http://cgn/bo#token=<IdentityToken>',
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-interop/logo.png',
    id: '6',
    title: 'PDND',
    description: 'Condividi dati con altri Enti in maniera semplice, sicura ed economica.',
    status: StatusEnum.INACTIVE,
    urlPublic: undefined,
    urlBO: 'http://PDND/bo#token=<IdentityToken>',
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
  },
];

export const mockedInstitutionUserResource: Array<InstitutionUserResource> = [
  {
    id: '1',
    name: 'Name',
    surname: 'Surname',
    status: 'PENDING',
    role: 'LIMITED' as RoleEnum,
    email: 'address' as EmailString,
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
    email: 'address' as EmailString,
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
    name: 'Name',
    surname: 'Surname',
    status: 'PENDING',
    role: 'LIMITED' as RoleEnum,
    email: 'address' as EmailString,
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
  },
  {
    id: '2',
    name: 'Name2',
    surname: 'Surname2',
    status: 'ACTIVE',
    role: 'ADMIN' as RoleEnum,
    email: 'address2' as EmailString,
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
  },
];

export const mockedProductRoles: Array<ProductRoleMappingsResource> = [
  {
    partyRole: PartyRoleEnum.SUB_DELEGATE,
    selcRole: SelcRoleEnum.ADMIN,
    multiroleAllowed: false,
    productRoles: [
      {
        code: 'incaricato-ente-creditore',
        description: 'Descrizione incaricato-ente-creditore',
        label: 'Incaricato Ente Creditore',
      },
    ],
  },
  {
    partyRole: PartyRoleEnum.OPERATOR,
    selcRole: SelcRoleEnum.LIMITED,
    multiroleAllowed: true,
    productRoles: [
      {
        code: 'referente-dei-pagamenti',
        description: 'Descrizione referente-dei-pagamenti',
        label: 'Referente dei Pagamenti',
      },
      {
        code: 'referente-tecnico',
        description: 'Descrizione referente-tecnico',
        label: 'Referente Tecnico',
      },
    ],
  },
];

export const mockedUserResource: UserResource = {
  id: 'id1',
  fiscalCode: 'AAAAAA11A11A123K',
  name: { certified: true, value: 'Gigi' },
  familyName: { certified: true, value: 'Verdi' },
  email: { certified: true, value: 'gigi.v@email.com' },
};

export const mockedBrokerResource: Array<BrokerResource> = [
  {
    code: '12345678914',
    description: 'Agenzia per La Rappresentanza Negoziale della Regione Siciliana',
    enabled: true,
  },
  {
    code: '12345678915',
    description: 'Maggioli S.p.A.',
    enabled: true,
  },
  {
    code: '12345678916',
    description: 'E_broke--r04',
    enabled: true,
  },
  {
    code: '12345678917',
    description: 'agenzia er01',
    enabled: true,
  },
  {
    code: '12345678918',
    description: 'D_bro.k.er06',
    enabled: true,
  },
  {
    code: '12345678919',
    description: 'F_broker03',
    enabled: true,
  },
  {
    code: '12345678910',
    description: 'S_broker03',
    enabled: true,
  },
  {
    code: '12345678911',
    description: 'K_broker03',
    enabled: true,
  },
];

export const DashboardApi = {
  getInstitutions: async (): Promise<Array<InstitutionBaseResource>> =>
    new Promise((resolve) => resolve(mockedInstitutionResources)),

  getInstitution: async (_partyId: string): Promise<InstitutionResource> =>
    new Promise((resolve) => resolve(mockedInstitutionResources[0])),

  getProducts: async (): Promise<Array<ProductsResource>> =>
    new Promise((resolve) => resolve(mockedProductResources)),

  getTokenExchange: async (
    _partyId: string,
    _productId: string,
    _environment?: string
  ): Promise<IdentityTokenResource> => new Promise((resolve) => resolve({ token: 'DUMMYTOKEN' })),

  getBillingToken: async (_partyId: string, _environment?: string): Promise<string> =>
    new Promise((resolve) => resolve('DUMMYTOKEN')),

  getProductRoles: async (_productId: string): Promise<Array<ProductRoleMappingsResource>> =>
    new Promise((resolve) => resolve(mockedProductRoles)),

  getProductBrokers: async (
    _productId: string,
    _institutionType: InstitutionTypeEnum
  ): Promise<Array<BrokerResource>> => new Promise((resolve) => resolve(mockedProductRoles)),
};
