import { ProductsResource, StatusEnum } from '../../api/generated/b4f-dashboard/ProductsResource';
import { productResource2Product } from '../Product';

test('Test institutionInfo2Party', () => {

  const productResource: ProductsResource = {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-pagopa/logo.png',
    id: '3',
    title: 'Pagamenti pagoPA',
    description: 'Pagamenti pagoPA description',
    status: StatusEnum.ACTIVE,
    urlBO: 'http://pagopa/bo',
    backOfficeEnvironmentConfigurations: undefined,
    urlPublic: 'http://pagopa/public',
    children: [
      {
        id: 'subProductId',
        title: 'Premium',
        status: StatusEnum.ACTIVE,
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
    status: 'ACTIVE',
    urlBO: 'http://pagopa/bo',
    backOfficeEnvironmentConfigurations: undefined,
    urlPublic: 'http://pagopa/public',
    tag: undefined,
    subProducts: [{ id: 'subProductId', title: 'Premium', status: 'ACTIVE' }],
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
    logoBgColor: '#0066CC',
    delegable: true,
    invoiceable: false,
  });
});
