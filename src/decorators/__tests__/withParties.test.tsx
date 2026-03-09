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
  | MockInstance<(this: unknown, ...args: unknown[]) => unknown>
  | MockInstance<any>;

beforeEach(() => {
  fetchPartiesSpy = vi.spyOn(partyService, 'fetchParties');
});

test('Test', async () => {
  const store = renderApp();
  await waitFor(() => verifyFetchPartiesMockExecution(store.getState().parties.list));

  renderApp(store);

  expect(fetchPartiesSpy).toBeCalledTimes(1);
});
