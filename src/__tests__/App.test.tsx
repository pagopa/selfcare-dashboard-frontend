import { render } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { storageDelete } from '../utils/storage-utils';
import { STORAGE_KEY_USER } from '../utils/constants';

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

// clean storage after each test
afterEach(() => {
  storageDelete(STORAGE_KEY_USER);
  mockedLocation.assign.mockReset();
});

test('Test session', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  // TODO
});
