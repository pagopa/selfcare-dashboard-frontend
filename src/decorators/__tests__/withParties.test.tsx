import { render, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { storageDelete, storageWrite } from '../../utils/storage-utils';
import { STORAGE_KEY_USER, URL_FE_LOGIN } from '../../utils/constants';
import { User } from '../../model/User';
import { createStore } from '../../redux/store';
import withParties from '../withParties';
import { Party } from '../../model/Party';
import { mockedOnBoardingInfo } from '../../api/__mocks__/PartyProcessApiClient';

jest.mock('../../api/PartyProcessApiClient');

const renderApp = () => {
  const store = createStore();
  const Component = () => <></>;
  const DecoratedComponent = withParties(Component);
  render(
    <Provider store={store}>
      <DecoratedComponent />
    </Provider>
  );
  return store;
};

test('Test', async () => {
  const store = renderApp();
  await waitFor(() =>
    expect(store.getState().parties.list.length).toBe(mockedOnBoardingInfo.institutions.length)
  );
  const parties = store.getState().parties.list;
  expect(
    parties.map((p) => {
      const clone = Object.assign({}, p);
      delete clone.urlLogo;
      return clone;
    })
  ).toMatchObject(mockedOnBoardingInfo.institutions);

  store
    .getState()
    .parties.list.forEach((p) =>
      expect(p.urlLogo).toBe(
        `https://selcdcheckoutsa.z6.web.core.windows.net/institutions/${p.institutionId}/logo.png`
      )
    );
});
