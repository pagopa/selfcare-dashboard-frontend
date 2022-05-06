import { ProductsResource, StatusEnum } from '../../api/generated/b4f-dashboard/ProductsResource';
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
    urlBO: 'http://pagopa/bo',
    activatedAt: date,
    urlPublic: 'http://pagopa/public',
    userRole: 'LIMITED',
  };

  const product = productResource2Product(productResource);
  expect(product).toStrictEqual({
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-pagopa/logo.png',
    id: '3',
    title: 'Pagamenti pagoPA',
    description: 'Pagamenti pagoPA description',
    authorized: true,
    status: 'ACTIVE',
    urlBO: 'http://pagopa/bo',
    activationDateTime: date,
    urlPublic: 'http://pagopa/public',
    tag: undefined,
    userRole: 'LIMITED',
    imageUrl: 'TODO',
  });
});
