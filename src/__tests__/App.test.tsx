import { render, screen } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux';
import { createStore } from '../redux/store';
import { appStateActions } from '../redux/slices/appStateSlice';
import { verifyMockExecution as verifyLoginMockExecution } from '../decorators/__mocks__/withLogin';
import { verifyMockExecution as verifyPartiesMockExecution } from '../decorators/__mocks__/withParties';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import routes from '../routes';

jest.mock('../decorators/withLogin');
jest.mock('../decorators/withParties');

const renderApp = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Router history={history}>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  );
  return { store, history };
};

test('Test rendering', () => {
  const { store } = renderApp();
  verifyLoginMockExecution(store.getState());
  verifyPartiesMockExecution(store.getState());
});

test('Test rendering dashboard no parties loaded', () => {
  const history = createMemoryHistory();
  history.push('/dashboard/1');

  const { store } = renderApp(undefined, history);

  verifyLoginMockExecution(store.getState());
  expect(store.getState().parties.list).toBeUndefined();
});

test('Test loading', () => {
  const { store } = renderApp();
  checkLoading(false);
  dispatchLoadingTask(store.dispatch, 't1', true);
  checkLoading(true);
  dispatchLoadingTask(store.dispatch, 't2', true);
  checkLoading(true);
  dispatchLoadingTask(store.dispatch, 't1', false);
  checkLoading(true);
  dispatchLoadingTask(store.dispatch, 't2', false);
  checkLoading(false);
});

const dispatchLoadingTask = (dispatch, task, loading) => {
  dispatch(appStateActions.setLoading({ task, loading }));
};

const checkLoading = (expectedLoading: boolean) => {
  if (expectedLoading) {
    screen.getByRole('loadingSpinner');
  } else {
    expect(screen.queryByRole('loadingSpinner')).toBeNull();
  }
};

test('Test routing', () => {
  const { history } = renderApp();
  expect(history.location.pathname).toBe('/dashboard');

  history.push('/dashboard/1');
  expect(history.location.pathname).toBe('/dashboard/1');

  history.push('/dashboard/13/2');
  expect(history.location.pathname).toBe('/dashboard/13');
});
