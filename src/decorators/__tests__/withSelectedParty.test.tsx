import { render, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '../../redux/store';
import withSelectedParty from '../withSelectedParty';
import { mockedOnBoardingInfo } from '../../api/__mocks__/PartyProcessApiClient';
import { PartyProcessApi } from '../../api/PartyProcessApiClient';

jest.mock('../../api/PartyProcessApiClient');

const renderApp = (injectedStore?: any) => {
  const store = injectedStore ? injectedStore : createStore();
  const Component = () => <></>;
  const DecoratedComponent = withSelectedParty(Component);
  render(
    <Provider store={store}>
      <DecoratedComponent />
    </Provider>
  );
  return store;
};

beforeEach(() => {
  jest.spyOn(PartyProcessApi, 'getOnBoardingInfo');
});
// TODO to complete
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

  renderApp(store);

  expect(PartyProcessApi.getOnBoardingInfo).toBeCalledTimes(1);
});
