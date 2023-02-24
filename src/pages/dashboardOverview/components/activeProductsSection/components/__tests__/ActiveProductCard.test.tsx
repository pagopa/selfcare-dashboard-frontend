import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import {
  ProductOnBoardingStatusEnum,
  StatusEnum,
} from '../../../../../../api/generated/b4f-dashboard/SubProductResource';
import { Product } from '../../../../../../model/Product';
import { createStore } from '../../../../../../redux/store';
import { retrieveBackOfficeUrl } from '../../../../../../services/tokenExchangeService';
import { mockedParties } from '../../../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../../../services/__mocks__/productService';
import './../../../../../../locale';
import ActiveProductCardContainer from './../ActiveProductCardContainer';

const oldWindowLocation = global.window.location;
const mockedLocation = {
  assign: jest.fn(),
  pathname: '',
  origin: 'MOCKED_ORIGIN',
  search: '',
  hash: '',
};

beforeAll(() => {
  Object.defineProperty(window, 'location', { value: mockedLocation });
});
afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

jest.mock('../../../../../../services/tokenExchangeService');

beforeEach(() => {
  jest.spyOn(require('../../../../../../services/tokenExchangeService'), 'retrieveBackOfficeUrl');
});

const mockedProduct = Object.assign({}, mockedPartyProducts[0]);

const renderCard = (authorized: boolean, tag?: string, activationDateTime?: Date) => {
  mockedProduct.authorized = authorized;
  mockedProduct.tag = tag;
  mockedProduct.activationDateTime = activationDateTime;
  render(
    <Provider store={createStore()}>
      <ActiveProductCardContainer party={mockedParties[0]} product={mockedProduct} />
    </Provider>
  );
};

const checkBaseFields = () => {
  screen.getByText(mockedProduct.title);
  return document.getElementById(`forward_${mockedProduct.id}`);
};

test('test render with optional text', () => {
  renderCard(false, 'PROVA TAG', new Date('2022-01-01'));
  expect(screen.getByText('Per gestire questo prodotto, chiedi a uno dei suoi', { exact: false }));
});

test('test render and behavior', async () => {
  renderCard(true);

  const button = checkBaseFields();
  expect(button).toBeEnabled();

  // screen.getByText('Attivo');

  fireEvent.click(button);

  await waitFor(() =>
    expect(retrieveBackOfficeUrl).toBeCalledWith(mockedParties[0], mockedProduct)
  );

  expect(mockedLocation.assign).toBeCalledWith('https://hostname/path?id=DUMMYTOKEN');
});

const interopProduct: Product = {
  logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-interop/logo.svg',
  id: 'prod-interop',
  title: 'Interoperabilità',
  description: 'Condividi dati con altri Enti in maniera semplice, sicura ed economica.',
  urlBO: 'http://PDND/bo#token=<IdentityToken>',
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
  authorized: true,
  userRole: 'ADMIN',
  productOnBoardingStatus: ProductOnBoardingStatusEnum.ACTIVE,
  status: StatusEnum.ACTIVE,
  urlPublic: undefined,
  imageUrl:
    'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
  subProducts: [],
  logoBgColor: undefined,
};

const renderCardInterop = (authorized: boolean, tag?: string, activationDateTime?: Date) => {
  mockedProduct.authorized = authorized;
  mockedProduct.tag = tag;
  mockedProduct.activationDateTime = activationDateTime;
  render(
    <Provider store={createStore()}>
      <ActiveProductCardContainer party={mockedParties[0]} product={interopProduct} />
    </Provider>
  );
};

test('test render and behavior', async () => {
  renderCardInterop(true);
  const buttonInterop = document.getElementById('forward_prod-interop');
  expect(buttonInterop).toBeEnabled;

  fireEvent.click(buttonInterop);

  const modalTitle = screen.queryByText('In quale ambiente vuoi entrare?');
  expect(modalTitle).toBeNull();
});
