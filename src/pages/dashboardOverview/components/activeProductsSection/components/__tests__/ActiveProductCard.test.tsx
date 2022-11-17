import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
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
  return screen.getByText('Gestisci');
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
