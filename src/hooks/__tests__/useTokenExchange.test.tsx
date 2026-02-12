import { render, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { createStore } from '../../redux/store';
import { useTokenExchange, validateUrlBO } from '../useTokenExchange';
import { mockedPartyProducts } from '../../services/__mocks__/productService';
import { mockedParties } from '../../services/__mocks__/partyService';

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
});
afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

vi.mock('../../services/tokenExchangeService');

let retrieveBackOfficeUrlSpy;

beforeEach(() => {
  retrieveBackOfficeUrlSpy = vi.spyOn(
    require('../../services/tokenExchangeService'),
    'retrieveBackOfficeUrl'
  );
});

test('validateUrlBO', () => {
  expect(validateUrlBO('https://hostname/path?id=<IdentityToken>')).toBe('hostname');
  expect(validateUrlBO('http://hostname/path?id=<IdentityToken>')).toBe('hostname');

  const wrongProtocolError = validateUrlBO('wrongprotocolhttp://hostname/path?id=<IdentityToken>');
  expect(wrongProtocolError instanceof Error).toBeTruthy();
  expect((wrongProtocolError as Error).message).toBe(
    'Cannot extract hostname from URL: wrongprotocolhttp://hostname/path?id=<IdentityToken>'
  );

  const wrongUrlError = validateUrlBO('wrongUrl/?id=<IdentityToken>');
  expect(wrongUrlError instanceof Error).toBeTruthy();
  expect((wrongUrlError as Error).message).toBe(
    'Cannot extract hostname from URL: wrongUrl/?id=<IdentityToken>'
  );
});

describe('useTokenExchange', () => {
  let expectedProduct: Product;
  const expectedParty: Party = mockedParties[0];

  const renderApp = (urlBO: string, injectedStore?: ReturnType<typeof createStore>) => {
    const store = injectedStore ? injectedStore : createStore();

    expectedProduct = {
      ...mockedPartyProducts[0],
      urlBO: urlBO,
    };

    const Component = () => {
      const { invokeProductBo } = useTokenExchange();
      useEffect(() => void invokeProductBo(expectedProduct, expectedParty));
      return <></>;
    };
    render(
      <Provider store={store}>
        <Component />
      </Provider>
    );
    return store;
  };

  test('not valid product urlBO', () => {
    const store = renderApp('wrongUrl');
    expect(store.getState().appState.errors.length).toBe(1);
    expect(store.getState().appState.errors[0].onRetry).toBeUndefined();

    expect(retrieveBackOfficeUrlSpy).toBeCalledTimes(0);
  });

  test('test redirect', async () => {
    const store = renderApp('https://hostname/path?id=<IdentityToken>');
    expect(store.getState().appState.errors.length).toBe(0);
    await waitFor(() => expect(store.getState().appState.loading.result).toBeFalsy());

    expect(retrieveBackOfficeUrlSpy).toBeCalledTimes(1);
    expect(retrieveBackOfficeUrlSpy).toBeCalledWith(
      expectedParty,
      expectedProduct,
      undefined,
      undefined
    );

    await waitFor(() =>
      expect(mockedLocation.assign).toBeCalledWith('https://hostname/path?id=DUMMYTOKEN')
    );
  });
});
