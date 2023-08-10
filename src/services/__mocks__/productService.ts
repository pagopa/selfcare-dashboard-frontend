import { StatusEnum } from '../../api/generated/b4f-dashboard/SubProductResource';
import { Product } from '../../model/Product';
import { ProductRole } from '../../model/ProductRole';

export const mockedPartyProducts: Array<Product> = [
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-io/logo.svg',
    title: 'App IO',
    description: 'App IO description',
    id: 'prod-io',
    status: StatusEnum.ACTIVE,
    activationDateTime: new Date(2021, 1, 1),
    urlPublic: 'https://io.italia.it/ ',
    urlBO: 'https://io.selfcare.pagopa.it/path/acs?token=<IdentityToken>',
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
    subProducts: [
      {
        id: 'prod-io-premium',
        title: 'Premium',
        status: StatusEnum.PHASE_OUT,
      },
    ],
    logoBgColor: 'primary.main',
    delegable: true,
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-pn/logo.svg',
    id: 'prod-pn',
    title: 'Piattaforma Notifiche',
    description: 'Piattaforma Notifiche description',
    status: StatusEnum.ACTIVE,
    urlBO: 'http://notifiche/bo?token=<IdentityToken>',
    activationDateTime: new Date(2021, 1, 2),
    urlPublic: 'http://notifiche/public',
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
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
    subProducts: [],
    logoBgColor: 'pagoPA.main',
    delegable: false,
  },
  {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-pagopa/logo.svg',
    id: 'prod-pagopa',
    title: 'Pagamenti pagoPA',
    description: 'Pagamenti pagoPA description',
    tag: 'Vecchio Portale',
    status: StatusEnum.ACTIVE,
    urlBO: 'http://pagopa/bo#token=<IdentityToken>',
    activationDateTime: new Date(2021, 1, 3),
    urlPublic: 'http://pagopa/public',
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
    subProducts: [],
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
    title: 'Amministratore',
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

export const verifyFetchPartyProductsMockExecution = (partyProducts: Array<Product>) => {
  expect(partyProducts).toStrictEqual(mockedPartyProducts);
};

export const fetchProducts = () => new Promise((resolve) => resolve(mockedPartyProducts));

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
