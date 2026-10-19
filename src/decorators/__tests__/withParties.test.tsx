/* eslint-disable functional/no-let, functional/immutable-data */
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MockInstance } from 'vitest';
import { createStore } from '../../redux/store';
import { verifyFetchPartiesMockExecution } from '../../services/__mocks__/partyService';
import withParties from '../withParties';
import * as partyService from '../../services/partyService';

vi.mock('../../services/partyService');

const renderApp = (injectedStore?: any) => {
  const store = injectedStore || createStore();
  const Component = () => <></>;
  const DecoratedComponent = withParties(Component);
  render(
    <Provider store={store}>
      <DecoratedComponent />
    </Provider>
  );
  return store;
};

let fetchPartiesSpy:
  | MockInstance<(this: unknown, ...args: Array<unknown>) => unknown>
  | MockInstance<any>;

beforeEach(() => {
  fetchPartiesSpy = vi.spyOn(partyService, 'fetchParties');
});

test('Test', async () => {
  const store = renderApp();
  await waitFor(() => verifyFetchPartiesMockExecution(store.getState().parties.list));

  renderApp(store);

  // waitFor also lets the second mount settle before the test ends
  await waitFor(() => expect(fetchPartiesSpy).toBeCalledTimes(1));
});

test('returns the wrapped component as is for PagoPA users', async () => {
  const { storageUserOps } = await import('@pagopa/selfcare-common-frontend/lib/utils/storage');
  const readSpy = vi.spyOn(storageUserOps, 'read').mockReturnValue({ iss: 'PAGOPA' } as any);
  const Component = () => <></>;

  expect(withParties(Component)).toBe(Component);
  readSpy.mockRestore();
});
