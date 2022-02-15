import { fireEvent, getByText, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import AddUserContainer from '../AddUserContainer';
import { createStore, store } from '../../../redux/store';
import { mockedParties } from '../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../services/__mocks__/productService';
import { Route, Router, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { verifyMockExecution as verifyLoginMockExecution } from '../../../__mocks__/@pagopa/selfcare-common-frontend/decorators/withLogin';

jest.mock('@pagopa/selfcare-common-frontend/decorators/withLogin');
jest.mock('../../../services/usersService');

const fieldsValue = {
  taxCode: 'AAAAAA22A22A234O',
  name: 'NAME',
  surname: 'SURNAME',
  email: 'NAME@SURNAME.COM',
  confirmEmail: 'NAME@SURNAME.COM',
};

const renderApp = (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  verifyLoginMockExecution(store.getState());
  const history = createMemoryHistory();
  history.push('/1/prod-io');
  render(
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route path="/:institutionId/:productId" exact={true}>
            <AddUserContainer party={mockedParties[0]} products={mockedPartyProducts} />
          </Route>
          <Route path="/dashboard/1/prod-io/roles" exact={true}>
            Test Completato
          </Route>
          <Route path="*"> {history.location.pathname}</Route>
        </Switch>
      </Router>
    </Provider>
  );
  return { history, store };
};

test('test with empty fields, so disabled button', () => {
  renderApp();

  const button = screen.getByRole('button', { name: 'Conferma' });

  expect(button).toBeDisabled();
});

test('test with fields that respect rules, so enabled button', async () => {
  const { history, store } = renderApp();

  const taxCode = document.querySelector('#taxCode');
  const name = document.querySelector('#name');
  const surname = document.querySelector('#surname');
  const email = document.querySelector('#email');
  const confirmEmail = document.querySelector('#confirmEmail');

  fireEvent.change(taxCode, { target: { value: fieldsValue.taxCode } });
  fireEvent.change(name, { target: { value: fieldsValue.name } });
  fireEvent.change(surname, { target: { value: fieldsValue.surname } });
  fireEvent.change(email, { target: { value: fieldsValue.email } });
  fireEvent.change(confirmEmail, { target: { value: fieldsValue.confirmEmail } });

  await waitFor(() => {
    const checkbox = document.querySelector('input[name="productRole"]');
    expect(checkbox).not.toBeNull();
    fireEvent.click(checkbox);
  });

  const button = screen.getByRole('button', { name: 'Conferma' });
  await waitFor(() => expect(button).toBeEnabled());

  screen.getByText('Conferma');
  fireEvent.click(button);

  await waitFor(() => expect(history.location.pathname).toBe('/dashboard/1/prod-io/roles'));
  await waitFor(() => screen.getByText('Test Completato'));
  const notifies = store.getState().appState.userNotifies;
  expect(notifies).toHaveLength(1);
  expect(notifies[0]).toMatchObject({
    component: 'Toast',
    title: 'REFERENTE AGGIUNTO',
    message: (
      <>
        {'Hai aggiunto correttamente '}
        <strong>NAME SURNAME</strong>
        {'.'}
      </>
    ),
  });
});
