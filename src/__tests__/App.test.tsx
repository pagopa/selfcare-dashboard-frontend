import { render, screen } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux';
import { createStore } from '../redux/store';
import { appStateActions } from '../redux/slices/appStateSlice';
import { mockedUser } from '../decorators/__mocks__/withLogin';
import { mockedParties } from '../decorators/__mocks__/withParties';

jest.mock('../decorators/withLogin');
jest.mock('../decorators/withParties');

const renderApp = () => {
  const store = createStore();
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  return store;
};

test('Test rendering', () => {
  const store = renderApp();
  expect(store.getState().user.logged).toMatchObject(mockedUser);
  expect(store.getState().parties.list).toMatchObject(mockedParties);
});

test('Test loading', () => {
  const store = renderApp();
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
