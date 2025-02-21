import { StatusEnum } from '../../api/generated/b4f-dashboard/SubProductResource';
import { Party } from '../../model/Party';
import { Product, ProductInstitutionMap } from '../../model/Product';
import { ProductRole } from '../../model/ProductRole';

export const mockedPartyProducts: Array<Product> = [
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-io/logo.svg',
    title: 'IO',
    description: 'IO description',
    id: 'prod-io',
    status: StatusEnum.ACTIVE,
    urlPublic: 'https://io.italia.it/ ',
    urlBO: 'https://io.selfcare.pagopa.it/path/acs?token=<IdentityToken>',
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
    subProducts: [
      {
        id: 'prod-io-premium',
        title: 'IO Premium',
        status: StatusEnum.ACTIVE,
        delegable: false,
        imageUrl:
          'https://selcucheckoutsa.z6.web.core.windows.net/resources/products/prod-io-premium/depict-image.jpeg',
        logo: 'https://selcucheckoutsa.z6.web.core.windows.net/resources/products/prod-io-premium/logo.svg',
        logoBgColor: '#0073E6',
        description: "Accedi alle funzionalità avanzate per i messaggi dell'app IO",
        urlPublic: 'https://io.italia.it/',
      },
    ],
    logoBgColor: 'primary.main',
    delegable: true,
    invoiceable: false,
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-pn/logo.svg',
    id: 'prod-pn',
    title: 'SEND - Servizio Notifiche Digitali',
    description: 'Piattaforma Notifiche description',
    status: StatusEnum.ACTIVE,
    urlBO: 'http://notifiche/bo?token=<IdentityToken>',
    urlPublic: 'http://notifiche/public',
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
    backOfficeEnvironmentConfigurations: [],
    subProducts: [],
    logoBgColor: 'pagoPA.main',
    delegable: false,
    invoiceable: true,
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-pagopa/logo.svg',
    id: 'prod-pagopa',
    title: 'Pagamenti pagoPA',
    description: 'Pagamenti pagoPA description',
    tag: 'Vecchio Portale',
    status: StatusEnum.ACTIVE,
    urlBO: 'http://pagopa/bo#token=<IdentityToken>',
    urlPublic: 'http://pagopa/public',
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
    subProducts: [
      {
        id: 'prod-dashboard-psp',
        title: 'Servizio di dashboarding pagoPA per PSP',
        status: StatusEnum.ACTIVE,
        delegable: false,
        imageUrl:
          'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
        logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-pagopa/logo.svg',
        logoBgColor: '#0073E6',
        description:
          'Accedi ai dati transazionali della piattaforma pagoPA e analizzali con una dashboard dinamica e intuitiva, aggiornata quotidianamente, ottimizzando il monitoraggio e la gestione delle tue attività.',
        urlPublic: 'http://pagopa/public',
      },
    ],
    logoBgColor: 'pagoPA.main',
    backOfficeEnvironmentConfigurations: [
      {
        environment: 'test1',
        url: 'www.test1.com',
      },
      {
        environment: 'test2',
        url: 'www.test2.com',
      },
    ],
    delegable: true,
    invoiceable: false,
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-ciban/logo.svg',
    title: 'Check-IBAN',
    description: "Verifica l'abbinamento di un IBAN ad un CF di un cittadino o di un'impresa.",
    id: 'prod-ciban',
    status: StatusEnum.ACTIVE,
    urlBO: 'http://checkiban/bo#token=<IdentityToken>',
    urlPublic: 'http://www.google.it',
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
    subProducts: [],
    logoBgColor: 'checkIban.main',
    delegable: false,
    invoiceable: false,
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-cgn/logo.png',
    id: 'prod-cgn',
    title: 'Carta Giovani',
    description: 'Richiedi la convenzione e gestisci i dati e le agevolazioni da offrire.',
    urlBO: 'http://cgn/bo#token=<IdentityToken>',
    status: StatusEnum.ACTIVE,
    urlPublic: undefined,
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
    subProducts: [],
    logoBgColor: undefined,
    delegable: false,
    invoiceable: false,
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-interop/logo.svg',
    id: 'prod-interop',
    title: 'Interoperabilità',
    description: 'Condividi dati con altri Enti in maniera semplice, sicura ed economica.',
    urlBO: 'http://PDND/bo#token=<IdentityToken>',
    status: StatusEnum.ACTIVE,
    urlPublic: undefined,
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
    subProducts: [],
    logoBgColor: undefined,
    delegable: false,
    invoiceable: false,
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-interop/logo.svg',
    id: 'prod-interop-coll',
    title: 'Interoperabilità Collaudo',
    description: 'Condividi dati con altri Enti in maniera semplice, sicura ed economica.',
    urlBO: 'http://COLL/bo#token=<IdentityToken>',
    status: StatusEnum.TESTING,
    urlPublic: undefined,
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
    subProducts: [],
    logoBgColor: undefined,
    delegable: false,
    invoiceable: false,
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-interop/logo.svg',
    id: 'prod-interop-atst',
    title: 'Interoperabilità Attestazioni',
    description: 'Condividi dati con altri Enti in maniera semplice, sicura ed economica.',
    urlBO: 'http://ATT/bo#token=<IdentityToken>',
    status: StatusEnum.TESTING,
    urlPublic: undefined,
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
    subProducts: [],
    logoBgColor: undefined,
    delegable: false,
    invoiceable: false,
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
    phasesAdditionAllowed: ['dashboard'],
  },
  {
    productId: 'PRODID',
    partyRole: 'DELEGATE',
    selcRole: 'ADMIN',
    multiroleAllowed: false,
    productRole: 'referente-amministrativo',
    title: 'Amministratore',
    description: 'Descrizione referente-amministrativo',
    phasesAdditionAllowed: ['dashboard'],
  },
  {
    productId: 'PRODID',
    partyRole: 'SUB_DELEGATE',
    selcRole: 'ADMIN',
    multiroleAllowed: false,
    productRole: 'incaricato-ente-creditore',
    title: 'Incaricato Ente Creditore',
    description: 'Descrizione incaricato-ente-creditore',
    phasesAdditionAllowed: ['dashboard-async'],
  },
  {
    productId: 'PRODID',
    partyRole: 'OPERATOR',
    selcRole: 'LIMITED',
    multiroleAllowed: true,
    productRole: 'referente-dei-pagamenti',
    title: 'Referente dei Pagamenti',
    description: 'Descrizione referente-dei-pagamenti',
    phasesAdditionAllowed: ['dashboard'],
  },
  {
    productId: 'PRODID',
    partyRole: 'OPERATOR',
    selcRole: 'LIMITED',
    multiroleAllowed: true,
    productRole: 'referente-tecnico',
    title: 'Referente Tecnico',
    description: 'Descrizione referente-tecnico',
    phasesAdditionAllowed: ['dashboard'],
  },
  {
    productId: 'PRODID',
    partyRole: 'ADMIN_EA_IO',
    selcRole: 'ADMIN_EA',
    multiroleAllowed: true,
    productRole: 'Amministratore-ea-io',
    title: 'Amministratore Ea IO',
    description: 'Descrizione amministratore-ea-io',
    phasesAdditionAllowed: ['dashboard'],
  },
];

export const mockedCategories: ProductInstitutionMap = {
  'prod-interop': {
    PA: {},
    GSP: {},
    SA: {},
    SCP: {},
    AS: {},
    PRV: {},
  },
  'prod-pn': {
    PA: {
      categories: 'L6,L4,L45,L35,L5,L17,L15,L7,L22',
    },
  },
  'prod-idpay': {
    PA: {},
  },
  'prod-io': {
    PA: {},
    GSP: {},
    PT: {},
  },
  'prod-pagopa': {
    PA: {},
    GSP: {},
    PSP: {},
    PT: {},
    PRV: {},
    GPU: {},
  },
  'prod-io-sign': {
    PA: {},
    GSP: {},
  },
  default: {
    PA: {
      categories:
        'C17,C16,L10,L19,L13,L2,C10,L20,L21,L22,L15,L1,C13,C5,L40,L11,L39,L46,L8,L34,L7,L35,L45,L47,L6,L12,L24,L28,L42,L36,L44,C8,C3,C7,C14,L16,C11,L33,C12,L43,C2,L38,C1,L5,L4,L31,L18,L17,S01,SA',
    },
    GSP: {
      categories: 'L37,SAG',
    },
    SCP: {},
  },
};

export const verifyFetchPartyProductsMockExecution = (partyProducts: Array<Product>) => {
  expect(partyProducts).toStrictEqual(mockedPartyProducts);
};

export const fetchProducts = () => Promise.resolve(mockedPartyProducts);

export const fetchProductRoles = (product: Product, _party: Party): Promise<Array<ProductRole>> => {
  const out = mockedProductRoles.map((r) =>
    Object.assign(
      {},
      r,
      { productId: product.id },
      { multiroleAllowed: product.id === 'prod-interop' && r.partyRole === 'OPERATOR' }
    )
  );
  return Promise.resolve(out);
};
