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

jest.mock('../../services/tokenExchangeService');

let retrieveTokenExchangeSpy;

beforeEach(() => {
  retrieveTokenExchangeSpy = jest.spyOn(
    require('../../services/tokenExchangeService'),
    'retrieveTokenExchange'
  );
});

test('validateUrlBO', () => {
  expect(validateUrlBO('https://hostname/path[identityToken]')).toBe('hostname');
  expect(validateUrlBO('http://hostname/path[identityToken]')).toBe('hostname');

  const wrongProtocolError = validateUrlBO('wrongprotocolhttp://hostname/path[identityToken]');
  expect(wrongProtocolError instanceof Error).toBeTruthy();
  expect((wrongProtocolError as Error).message).toBe(
    'Cannot extract hostname from URL: wrongprotocolhttp://hostname/path[identityToken]'
  );

  const wrongUrlError = validateUrlBO('wrongUrl/[identityToken]');
  expect(wrongUrlError instanceof Error).toBeTruthy();
  expect((wrongUrlError as Error).message).toBe(
    'Cannot extract hostname from URL: wrongUrl/[identityToken]'
  );

  const missingTokenPlaceholderError = validateUrlBO('https://hostname/path');
  expect(missingTokenPlaceholderError instanceof Error).toBeTruthy();
  expect((missingTokenPlaceholderError as Error).message).toBe(
    "URL doesn't contain token placeholder [identityToken]: https://hostname/path"
  );
});

describe('useTokenExchange', () => {
  const renderApp = (urlBO: string, injectedStore?: ReturnType<typeof createStore>) => {
    const store = injectedStore ? injectedStore : createStore();

    const product: Product = {
      ...mockedPartyProducts[0],
      urlBO: urlBO,
    };
    const party: Party = mockedParties[0];

    const Component = () => {
      const { invokeProductBo } = useTokenExchange();
      useEffect(() => void invokeProductBo(product, party));
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

    expect(retrieveTokenExchangeSpy).toBeCalledTimes(0);
  });

  test('test redirect', async () => {
    const store = renderApp('https://hostname/path#[identityToken]');
    expect(store.getState().appState.errors.length).toBe(0);
    await waitFor(() => expect(store.getState().appState.loading.result).toBeFalsy());

    expect(retrieveTokenExchangeSpy).toBeCalledTimes(1);
    expect(retrieveTokenExchangeSpy).toBeCalledWith('hostname', mockedParties[0]);

    await waitFor(() =>
      expect(mockedLocation.assign).toBeCalledWith('https://hostname/path#DUMMYTOKEN')
    );
  });
});
