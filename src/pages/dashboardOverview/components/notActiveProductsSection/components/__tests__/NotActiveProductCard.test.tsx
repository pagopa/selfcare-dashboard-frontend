import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { mockedParties } from '../../../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../../../services/__mocks__/productService';
import './../../../../../../locale';
import { createStore } from './../../../../../../redux/store';
import NotActiveProductCardContainer from './../NotActiveProductCardContainer';

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
  i18n.changeLanguage('it');
});

afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

const mockedProduct = Object.assign({}, mockedPartyProducts[0]);

const renderCard = (
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING',
  urlPublic?: string,
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  mockedProduct.productOnBoardingStatus = status;
  mockedProduct.urlPublic = urlPublic;
  render(
    <Router history={history}>
      <Provider store={store}>
        <NotActiveProductCardContainer party={mockedParties[0]} product={mockedProduct} />{' '}
      </Provider>
    </Router>
  );
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
    expect(screen.queryByText('Scopri di più')).toBeNull();
  });

  test('test render product with public url', async () => {
    renderCard('INACTIVE', 'http://publicUrl');

    checkBaseFields();
    screen.getByText('Scopri di più');
  });
});

describe('test onboarding', () => {
  test('test inactive product', () => {
    renderCard('INACTIVE');

    checkBaseFields();

    const button = screen.getByText('Aderisci');

    fireEvent.click(button);
    /*
    expect(mockedLocation.assign).toBeCalledWith(
      `http://selfcare/onboarding/${mockedProduct.id}?partyExternalId=${mockedParties[0].externalId}`
    );
    */
  });

  test('test PENDING product', async () => {
    renderCard('PENDING');

    checkBaseFields();

    const button = screen.getByText('Aderisci');

    fireEvent.click(button);

    waitFor(() => screen.getByText('Adesione in corso'));
    waitFor(() =>
      screen.getByText(
        'Per questo prodotto c’è già una richiesta di adesione in corso. Vuoi procedere lo stesso?'
      )
    );
    waitFor(() => screen.getByText('Procedi con una nuova adesione'));

    waitFor(() => fireEvent.click(screen.getByText('Esci')));

    await waitFor(() => expect(screen.queryByText('Adesione in corso')).toBeNull());

    fireEvent.click(button);

    waitFor(() => fireEvent.click(screen.getByText('Procedi con una nuova adesione')));

    waitFor(() =>
      expect(mockedLocation.assign).toBeCalledWith(
        `http://selfcare/onboarding/${mockedProduct.id}?partyExternalId=${mockedParties[0].externalId}`
      )
    );
  });
});

