import { filterProducts } from '../productFilters';
import { StatusEnum } from '../../../../../../api/generated/b4f-dashboard/ProductsResource';
import { Product, ProductInstitutionMap } from '../../../../../../model/Product';
import { OnboardedProductResource } from '../../../../../../api/generated/b4f-dashboard/OnboardedProductResource';

enum ProductOnBoardingStatusEnum {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
}

enum Actions {
  AccessProductBackoffice = 'AccessProductBackoffice',
  ListActiveProducts = 'ListActiveProducts',
  ViewBilling = 'ViewBilling',
}

describe('filterProducts', () => {
  const allowedInstitutionTypes: ProductInstitutionMap = {
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
    'prod-idpay': { PA: {} },
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

  const onboardedProducts: Array<OnboardedProductResource> = [
    {
      productId: 'prod-pagopa',
      authorized: true,
      productOnBoardingStatus: ProductOnBoardingStatusEnum.PENDING,
      userRole: 'ADMIN',
      billing: {
        vatNumber: '81001510528',
        recipientCode: 'FLGKROWP',
        publicServices: true,
      },
      userProductActions: [Actions.AccessProductBackoffice],
    },
    {
      productId: 'prod-pn',
      authorized: true,
      productOnBoardingStatus: ProductOnBoardingStatusEnum.ACTIVE,
      userRole: 'ADMIN',
      billing: {
        vatNumber: '66554328912',
        recipientCode: 'cccc',
        publicServices: true,
      },
      userProductActions: [
        Actions.ListActiveProducts,
        Actions.AccessProductBackoffice,
        Actions.ViewBilling,
      ],
    },
  ];

  it('should filter products based on allowed institution types and onboarded products', () => {
    const productsWithStatusActive: Array<Product> = [
      {
        id: 'prod-pagopa',
        subProducts: [
          { id: 'sub1', status: StatusEnum.ACTIVE },
          { id: 'sub2', status: StatusEnum.INACTIVE },
        ],
        description: '',
        logo: '',
        title: '',
        urlBO: '',
        status: StatusEnum.ACTIVE,
        imageUrl: '',
        delegable: false,
      },
      {
        id: 'prod-pn',
        subProducts: [],
        status: StatusEnum.ACTIVE,
        description: '',
        logo: '',
        title: '',
        urlBO: '',
        imageUrl: '',
        delegable: false,
      },
      {
        id: 'prod-idpay',
        subProducts: [],
        status: StatusEnum.ACTIVE,
        description: '',
        logo: '',
        title: '',
        urlBO: '',
        imageUrl: '',
        delegable: false,
      },
    ];

    const config = {
      institutionType: 'PA',
      categoryCode: 'L6',
      allowedInstitutionTypes,
    };

    const result = filterProducts(productsWithStatusActive, config, onboardedProducts);

    expect(result).toEqual([
      {
        id: 'prod-pagopa',
        subProducts: [
          { id: 'sub1', status: StatusEnum.ACTIVE },
          {
            id: 'sub2',
            status: StatusEnum.INACTIVE,
          },
        ],
        description: '',
        logo: '',
        title: '',
        urlBO: '',
        status: StatusEnum.ACTIVE,
        imageUrl: '',
        delegable: false,
      },
      {
        id: 'prod-idpay',
        subProducts: [],
        status: StatusEnum.ACTIVE,
        description: '',
        logo: '',
        title: '',
        urlBO: '',
        imageUrl: '',
        delegable: false,
      },
    ]);
  });

  it('should exclude products that are already onboarded', () => {
    const productsWithStatusActive: Array<Product> = [
      {
        id: 'prod-pn',
        subProducts: [],
        status: StatusEnum.ACTIVE,
        description: '',
        logo: '',
        title: '',
        urlBO: '',
        imageUrl: '',
        delegable: false,
      },
      {
        id: 'prod-io',
        subProducts: [],
        status: StatusEnum.ACTIVE,
        description: '',
        logo: '',
        title: '',
        urlBO: '',
        imageUrl: '',
        delegable: false,
      },
    ];

    const config = {
      institutionType: 'PA',
      allowedInstitutionTypes,
    };

    const result = filterProducts(productsWithStatusActive, config, onboardedProducts);

    expect(result).toEqual([
      {
        id: 'prod-io',
        subProducts: [],
        status: StatusEnum.ACTIVE,
        description: '',
        logo: '',
        title: '',
        urlBO: '',
        imageUrl: '',
        delegable: false,
      },
    ]);
  });
});
