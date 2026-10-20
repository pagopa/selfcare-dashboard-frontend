/* eslint-disable functional/no-let, functional/immutable-data */
import { render, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { createStore } from '../../redux/store';
import { useTokenExchange, validateUrlBO } from '../useTokenExchange';
import { mockedPartyProducts } from '../../services/__mocks__/productService';
import { mockedParties } from '../../services/__mocks__/partyService';
// 1. Import the module namespace directly
import * as tokenExchangeService from '../../services/tokenExchangeService';

const oldWindowLocation = globalThis.window.location;
const mockedLocation = {
  assign: vi.fn(),
  hostname: 'localhost',
  pathname: '',
  origin: 'MOCKED_ORIGIN',
  search: '',
  hash: '',
};

beforeAll(() => {
  Object.defineProperty(globalThis, 'location', { value: mockedLocation });
});

afterAll(() => {
  Object.defineProperty(globalThis, 'location', { value: oldWindowLocation });
});

vi.mock('../../services/tokenExchangeService');

let retrieveBackOfficeUrlSpy: any;

beforeEach(() => {
  // 3. Spy on the imported ES module
  retrieveBackOfficeUrlSpy = vi.spyOn(tokenExchangeService, 'retrieveBackOfficeUrl');
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
      urlBO,
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

describe('useTokenExchange with environment and errors', () => {
  const party: Party = mockedParties[0];

  const renderInvoke = (product: Product, environment?: string) => {
    const store = createStore();
    const Component = () => {
      const { invokeProductBo } = useTokenExchange();
      useEffect(() => void invokeProductBo(product, party, environment, 'it'), []);
      return <></>;
    };
    render(
      <Provider store={store}>
        <Component />
      </Provider>
    );
    return store;
  };

  const productWithEnv: Product = {
    ...mockedPartyProducts[0],
    urlBO: 'https://prod-host/path',
    backOfficeEnvironmentConfigurations: [
      { environment: 'Collaudo', url: 'https://test-host/path' },
    ],
  };

  beforeEach(() => {
    mockedLocation.assign.mockClear();
  });

  test('uses the selected environment url and redirects', async () => {
    const store = renderInvoke(productWithEnv, 'collaudo');

    await waitFor(() =>
      expect(mockedLocation.assign).toHaveBeenCalledWith('https://hostname/path?id=DUMMYTOKEN')
    );
    expect(retrieveBackOfficeUrlSpy).toHaveBeenCalledWith(party, productWithEnv, 'collaudo', 'it');
    expect(store.getState().appState.errors).toHaveLength(0);
  });

  test('adds an error when the selected environment has an invalid url', () => {
    const store = renderInvoke(
      {
        ...productWithEnv,
        backOfficeEnvironmentConfigurations: [{ environment: 'Collaudo', url: 'invalid' }],
      },
      'Collaudo'
    );

    expect(store.getState().appState.errors[0].id).toMatch(
      new RegExp(`^ValidationUrlError-${productWithEnv.id}`)
    );
    expect(retrieveBackOfficeUrlSpy).not.toHaveBeenCalled();
  });

  test.each([
    ['test', 'collaudo'],
    ['prod', undefined],
  ])('adds an error when token exchange fails (%s)', async (_label, environment) => {
    retrieveBackOfficeUrlSpy.mockRejectedValueOnce(new Error('exchange failed'));

    const store = renderInvoke(productWithEnv, environment);

    await waitFor(() => expect(store.getState().appState.errors).toHaveLength(1));
    const error = store.getState().appState.errors[0];
    expect(error.id).toMatch(new RegExp(`^TokenExchangeError-${productWithEnv.id}`));
    expect(error.techDescription).toContain(environment ? 'of test environment' : 'for product');
    expect(mockedLocation.assign).not.toHaveBeenCalled();
    expect(store.getState().appState.loading.result).toBeFalsy();
  });
});
