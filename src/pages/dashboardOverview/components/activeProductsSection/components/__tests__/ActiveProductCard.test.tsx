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

// product with custom modal
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
//produt with generic modal
const appIoProduct: Product = {
  logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-io/logo.svg',
  title: 'App IO',
  description: 'App IO description',
  id: 'prod-io',
  authorized: true,
  productOnBoardingStatus: ProductOnBoardingStatusEnum.ACTIVE,
  userRole: 'ADMIN',
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
      status: StatusEnum.ACTIVE,
      productOnBoardingStatus: ProductOnBoardingStatusEnum.ACTIVE,
    },
  ],
  logoBgColor: 'primary.main',
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
};
//product without modal
const cibanProduct: Product = {
  logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-ciban/logo.svg',
  title: 'Check-IBAN',
  description: "Verifica l'abbinamento di un IBAN ad un CF di un cittadino o di un'impresa.",
  id: 'prod-ciban',
  userRole: 'ADMIN',
  authorized: true,
  productOnBoardingStatus: ProductOnBoardingStatusEnum.ACTIVE,
  status: StatusEnum.ACTIVE,
  urlBO: 'http://checkiban/bo#token=<IdentityToken>',
  urlPublic: 'http://www.google.it',
  imageUrl:
    'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
  subProducts: [],
  logoBgColor: 'checkIban.main',
};
const renderCardInterop = (authorized: boolean, tag?: string, activationDateTime?: Date) => {
  interopProduct.authorized = authorized;
  interopProduct.tag = tag;
  interopProduct.activationDateTime = activationDateTime;
  render(
    <Provider store={createStore()}>
      <ActiveProductCardContainer party={mockedParties[1]} product={interopProduct} />
    </Provider>
  );
};
const renderCardAppIo = (authorized: boolean, tag?: string, activationDateTime?: Date) => {
  appIoProduct.authorized = authorized;
  appIoProduct.tag = tag;
  appIoProduct.activationDateTime = activationDateTime;
  render(
    <Provider store={createStore()}>
      <ActiveProductCardContainer party={mockedParties[0]} product={appIoProduct} />
    </Provider>
  );
};
const renderCardCiban = (authorized: boolean, tag?: string, activationDateTime?: Date) => {
  cibanProduct.authorized = authorized;
  cibanProduct.tag = tag;
  cibanProduct.activationDateTime = activationDateTime;
  render(
    <Provider store={createStore()}>
      <ActiveProductCardContainer party={mockedParties[0]} product={cibanProduct} />
    </Provider>
  );
};
const enviroment = Object.assign(
  {},
  mockedPartyProducts[0].backOfficeEnvironmentConfigurations?.[0]
);

test('test render with optional text', () => {
  renderCardAppIo(false, 'PROVA TAG', new Date('2022-01-01'));
  expect(screen.getByText('Per gestire questo prodotto, chiedi a uno dei suoi', { exact: false }));
});

test('test retrieveBackOfficeUrl call without modal and behavior without modal ', async () => {
  renderCardCiban(true);
  const button = await waitFor(() => document.getElementById('forward_prod-ciban'));
  expect(button).toBeEnabled;

  fireEvent.click(button);

  await waitFor(() => expect(retrieveBackOfficeUrl).toBeCalledWith(mockedParties[0], cibanProduct));

  expect(mockedLocation.assign).toBeCalledWith('https://hostname/path?id=DUMMYTOKEN');
});

test('test retrieveBackOfficeUrl call with modal and behavior without modal ', async () => {
  renderCardAppIo(true);
  const button = await waitFor(() => document.getElementById('forward_prod-io'));
  expect(button).toBeEnabled;

  fireEvent.click(button);

  const buttonEnvProduction = screen.getByText('Produzione');
  fireEvent.click(buttonEnvProduction);

  await waitFor(() => expect(retrieveBackOfficeUrl).toBeCalledWith(mockedParties[0], appIoProduct));

  expect(mockedLocation.assign).toBeCalledWith('https://hostname/path?id=DUMMYTOKEN');
});

test('test render and behavior with custom interop modal', async () => {
  renderCardInterop(true);
  const button = await waitFor(() => document.getElementById('forward_prod-interop'));
  expect(button).toBeEnabled;

  fireEvent.click(button);

  const modalTitle = screen.queryByText('In quale ambiente vuoi entrare?');
  expect(modalTitle).not.toBeNull();
});

test('test render and behavior with generic product modal', async () => {
  renderCardAppIo(true);
  const button = await waitFor(() => document.getElementById('forward_prod-io'));
  expect(button).toBeEnabled;

  fireEvent.click(button);

  const modalTitle = screen.queryByText('In quale ambiente vuoi entrare?');
  expect(modalTitle).not.toBeNull();
});

test('test render and behavior without modal', async () => {
  renderCardCiban(true);
  const button = await waitFor(() => document.getElementById('forward_prod-ciban'));
  expect(button).toBeEnabled;

  fireEvent.click(button);

  const modalTitle = screen.queryByText('In quale ambiente vuoi entrare?');
  expect(modalTitle).toBeNull();
});
