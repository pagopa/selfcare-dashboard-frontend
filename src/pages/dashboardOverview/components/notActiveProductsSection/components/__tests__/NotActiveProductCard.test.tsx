import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Product } from '../../../../../../model/Product';
import { mockedParties } from '../../../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../../../services/__mocks__/productService';
import NotActiveProductCard from '../NotActiveProductCard';

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

const mockedProduct = Object.assign({}, mockedPartyProducts[0]);

const renderCard = (status: 'ACTIVE' | 'INACTIVE' | 'PENDING', urlPublic?: string) => {
  mockedProduct.status = status;
  mockedProduct.urlPublic = urlPublic;
  render(<NotActiveProductCard party={mockedParties[0]} product={mockedProduct} />);
};

const checkBaseFields = () => {
  screen.getByText(mockedProduct.title);
  screen.getByText(mockedProduct.description);
  screen.getByText('Aderisci');
};

describe('test public url', () => {
  test('test render product WITHOUT public url', () => {
    renderCard('INACTIVE');

    checkBaseFields();
    expect(screen.queryByText('SCOPRI DI PIÙ →')).toBeNull();
  });

  test('test render product with public url', async () => {
    renderCard('INACTIVE', 'http://publicUrl');

    checkBaseFields();
    screen.getByText('SCOPRI DI PIÙ →');
  });
});

describe('test onboarding', () => {
  test('test inactive product', () => {
    renderCard('INACTIVE');

    checkBaseFields();

    const button = screen.getByText('Aderisci');

    fireEvent.click(button);

    expect(mockedLocation.assign).toBeCalledWith(
      `http://selfcare/onboarding/${mockedProduct.id}?institutionId=${mockedParties[0].institutionId}`
    );
  });

  test('test PENDING product', async () => {
    renderCard('PENDING');

    checkBaseFields();

    const button = screen.getByText('Aderisci');

    fireEvent.click(button);

    screen.getByText('Adesione in corso');
    screen.getByText(
      'Per questo prodotto c’è già una richiesta di adesione in corso. Vuoi procedere lo stesso?'
    );
    screen.getByText('Procedi con una nuova adesione');

    const cancelButton = screen.getByText('Esci');

    fireEvent.click(cancelButton);

    await waitFor(() => expect(screen.queryByText('Adesione in corso')).toBeNull());

    fireEvent.click(button);

    fireEvent.click(screen.getByText('Procedi con una nuova adesione'));

    expect(mockedLocation.assign).toBeCalledWith(
      `http://selfcare/onboarding/${mockedProduct.id}?institutionId=${mockedParties[0].institutionId}`
    );
  });
});
