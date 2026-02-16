import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { StatusEnum } from '../../../../../../api/generated/b4f-dashboard/SubProductResource';
import { mockedParties } from '../../../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../../../services/__mocks__/productService';
import './../../../../../../locale';
import { createStore } from './../../../../../../redux/store';
import NotActiveProductCardContainer from './../NotActiveProductCardContainer';

const oldWindowLocation = global.window.location;
const mockedLocation = {
  assign: vi.fn(),
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

const mockedProduct = { ...mockedPartyProducts[0] };

const renderCard = (
  status: StatusEnum.ACTIVE | StatusEnum,
  urlPublic?: string,
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ?? createStore();
  const history = injectedHistory ?? createMemoryHistory();

  mockedProduct.status = status;
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
    renderCard(StatusEnum.INACTIVE);

    checkBaseFields();
    expect(screen.queryByText('Scopri di più')).toBeNull();
  });

  test('test render product with public url', async () => {
    renderCard(StatusEnum.INACTIVE, 'http://publicUrl');

    checkBaseFields();
    screen.getByText('Scopri di più');
  });
});

describe('test onboarding', () => {
  test('test inactive product', () => {
    renderCard(StatusEnum.INACTIVE);

    checkBaseFields();

    const button = screen.getByText('Aderisci');

    fireEvent.click(button);
    /*
    expect(mockedLocation.assign).toBeCalledWith(
      `http://selfcare/onboarding/${mockedProduct.id}?partyExternalId=${mockedParties[0].externalId}`
    );
    */
  });
});
