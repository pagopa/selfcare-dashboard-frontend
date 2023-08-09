import { ProductsResource, StatusEnum } from '../../api/generated/b4f-dashboard/ProductsResource';
import { ProductOnBoardingStatusEnum } from '../../api/generated/b4f-dashboard/SubProductResource';
import { productResource2Product } from '../Product';

test('Test institutionInfo2Party', () => {
  const date = new Date();

  const productResource: ProductsResource = {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-pagopa/logo.png',
    id: '3',
    title: 'Pagamenti pagoPA',
    description: 'Pagamenti pagoPA description',
    authorized: true,
    status: StatusEnum.ACTIVE,
    productOnBoardingStatus: ProductOnBoardingStatusEnum.ACTIVE,
    urlBO: 'http://pagopa/bo',
    backOfficeEnvironmentConfigurations: undefined,
    activatedAt: date,
    urlPublic: 'http://pagopa/public',
    userRole: 'LIMITED',
    children: [
      {
        id: 'subProductId',
        title: 'Premium',
        status: StatusEnum.ACTIVE,
        productOnBoardingStatus: ProductOnBoardingStatusEnum.ACTIVE,
      },
    ],
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
    logoBgColor: '#0066CC',
    delegable: true,
  };

  const product = productResource2Product(productResource);
  expect(product).toStrictEqual({
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-pagopa/logo.png',
    id: '3',
    title: 'Pagamenti pagoPA',
    description: 'Pagamenti pagoPA description',
    authorized: true,
    productOnBoardingStatus: 'ACTIVE',
    status: 'ACTIVE',
    urlBO: 'http://pagopa/bo',
    backOfficeEnvironmentConfigurations: undefined,
    activationDateTime: date,
    urlPublic: 'http://pagopa/public',
    tag: undefined,
    userRole: 'LIMITED',
    subProducts: [
      { id: 'subProductId', title: 'Premium', status: 'ACTIVE', productOnBoardingStatus: 'ACTIVE' },
    ],
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
    logoBgColor: '#0066CC',
    delegable: true,
  });
});
