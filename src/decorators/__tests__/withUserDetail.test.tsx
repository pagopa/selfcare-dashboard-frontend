import { createStore } from './../../redux/store';
import withUserDetail from '../withUserDetail';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

jest.mock('../../services/usersService');

const renderApp = (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const Component = () => <></>;
  const DecoratedComponent = withUserDetail(Component);
  render(<Provider store={store}>{/* <DecoratedComponent /> */}</Provider>);
  return store;
};
