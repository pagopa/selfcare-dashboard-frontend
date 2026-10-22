import { appStateSelectors } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import { userActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/userSlice';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Route } from 'react-router-dom';
import type { Mock } from 'vitest';
import { mockedUser } from '../../../../../__mocks__/@pagopa/selfcare-common-frontend/decorators/withLogin';
import { Product } from '../../../../../model/Product';
import { partiesActions } from '../../../../../redux/slices/partiesSlice';
import { createStore } from '../../../../../redux/store';
import { mockedProductAdmins } from '../../../../../services/__mocks__/userService';
import { fetchProductAdmins } from '../../../../../services/userService';
import { renderWithProviders } from '../../../../../utils/test-utils';
import {
  ContractUpdateWizardProvider,
  initialWizardState,
} from '../../../ContractUpdateWizardContext';
import { AddUsersStep } from '../AddUsersStep';

vi.mock('../../../../../services/userService', () => ({ fetchProductAdmins: vi.fn() }));

const legalRepresentative = {
  name: 'Mario',
  surname: 'Rossi',
  taxCode: 'RSSMRA80A01H501U',
  email: 'mario.rossi@comune.it',
};

const renderStep = () => {
  const store = createStore();
  store.dispatch(userActions.setLoggedUser(mockedUser));
  store.dispatch(
    partiesActions.setPartySelectedProducts([{ id: 'prod-io', title: 'IO' } as Product])
  );
  renderWithProviders(
    <Route path="/:partyId/:productId">
      <ContractUpdateWizardProvider
        initialState={{
          ...initialWizardState,
          activeStep: 2,
          draft: { ...initialWizardState.draft, legalRepresentative },
        }}
      >
        <AddUsersStep />
      </ContractUpdateWizardProvider>
    </Route>,
    store,
    createMemoryHistory({ initialEntries: ['/party-1/prod-io'] })
  );
  return { store, user: userEvent.setup({ delay: null }) };
};

const adminCard = (index: number) =>
  screen.getByRole('region', { name: `Amministratore ${index}` });
const addButton = () => screen.getByRole('button', { name: 'Aggiungi amministratore' });
const removedToasts = (store: ReturnType<typeof createStore>) =>
  appStateSelectors
    .selectNotifies(store.getState())
    .filter((notify) => notify.id.startsWith('CONTRACT_UPDATE_ADMIN_REMOVED'));

beforeEach(() => {
  (fetchProductAdmins as Mock).mockResolvedValue(mockedProductAdmins);
});

test('shows the Legal Representative and the current admins, without the Legal Representative', async () => {
  renderStep();

  expect(await screen.findByRole('region', { name: 'Amministratore 2' })).toBeInTheDocument();
  expect(fetchProductAdmins).toHaveBeenCalledTimes(1);
  expect(fetchProductAdmins).toHaveBeenCalledWith('party-1', 'prod-io');
  expect(screen.getByText(/gestione di IO e presenti nel contratto/)).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { level: 2, name: 'Legale Rappresentante e Amministratore' })
  ).toBeInTheDocument();
  expect(screen.getByText('RSSMRA80A01H501U')).toBeInTheDocument();
  expect(screen.queryByRole('region', { name: 'Amministratore 3' })).not.toBeInTheDocument();
  expect(screen.queryByDisplayValue('RSSMRA80A01H501U')).not.toBeInTheDocument();
  expect(within(adminCard(2)).getByLabelText('Nome')).toHaveValue('Giulio');
});

test('lets the logged user edit only their email and never remove themselves', async () => {
  const { user } = renderStep();
  const loggedUserCard = await screen.findByRole('region', { name: 'Amministratore 1' });

  ['Nome', 'Cognome', 'Codice Fiscale'].forEach((label) =>
    expect(within(loggedUserCard).getByLabelText(label)).toHaveAttribute('readonly')
  );
  const email = within(loggedUserCard).getByLabelText('Email istituzionale');
  expect(email).not.toHaveAttribute('readonly');
  await user.clear(email);
  await user.type(email, 'laura.neri@nuova.comune.it');
  expect(email).toHaveValue('laura.neri@nuova.comune.it');
  expect(within(loggedUserCard).queryByRole('button', { name: /Rimuovi/ })).not.toBeInTheDocument();
  expect(
    within(adminCard(2)).getByRole('button', { name: 'Rimuovi Amministratore 2' })
  ).toBeInTheDocument();
});

test('adds an empty admin card and removes it without confirmation while it is empty', async () => {
  const { store, user } = renderStep();
  await screen.findByRole('region', { name: 'Amministratore 2' });

  await user.click(addButton());
  const newCard = adminCard(3);
  expect(within(newCard).getByLabelText('Nome')).toHaveFocus();
  ['Nome', 'Cognome', 'Codice Fiscale', 'Email istituzionale'].forEach((label) =>
    expect(within(newCard).getByLabelText(label)).toHaveValue('')
  );

  await user.click(within(newCard).getByRole('button', { name: 'Rimuovi Amministratore 3' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.queryByRole('region', { name: 'Amministratore 3' })).not.toBeInTheDocument();
  expect(addButton()).toHaveFocus();
  expect(removedToasts(store)).toHaveLength(1);
});

test('asks for confirmation before removing a filled admin card', async () => {
  const { store, user } = renderStep();
  await screen.findByRole('region', { name: 'Amministratore 2' });

  await user.click(within(adminCard(2)).getByRole('button', { name: 'Rimuovi Amministratore 2' }));
  const dialog = screen.getByRole('dialog', { name: 'Desideri rimuovere questo amministratore?' });
  expect(dialog).toHaveAccessibleDescription(
    'Tutti i relativi dati inseriti verranno eliminati e non risulteranno nel contratto.'
  );
  await user.click(within(dialog).getByRole('button', { name: 'Indietro' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(adminCard(2)).toBeInTheDocument();
  expect(removedToasts(store)).toHaveLength(0);

  await user.click(within(adminCard(2)).getByRole('button', { name: 'Rimuovi Amministratore 2' }));
  await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Rimuovi' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(screen.queryByRole('region', { name: 'Amministratore 2' })).not.toBeInTheDocument();
  expect(screen.queryByDisplayValue('Giulio')).not.toBeInTheDocument();
  expect(addButton()).toHaveFocus();
  expect(removedToasts(store)).toEqual([
    expect.objectContaining({ component: 'Toast', title: 'Hai rimosso un amministratore' }),
  ]);
});

test('shows live validation errors on the admin fields', async () => {
  const { user } = renderStep();
  await screen.findByRole('region', { name: 'Amministratore 2' });
  await user.click(addButton());
  const newCard = adminCard(3);

  await user.type(within(newCard).getByLabelText('Codice Fiscale'), 'bncgli80a01h501y');
  expect(within(newCard).getByLabelText('Codice Fiscale')).toHaveValue('BNCGLI80A01H501Y');
  expect(
    within(newCard).getByText('Il Codice Fiscale inserito è già presente')
  ).toBeInTheDocument();
  expect(
    within(adminCard(2)).getByText('Il Codice Fiscale inserito è già presente')
  ).toBeInTheDocument();

  await user.type(within(newCard).getByLabelText('Nome'), 'Paolo');
  expect(
    within(newCard).getByText('Nome non corretto o diverso dal Codice Fiscale')
  ).toBeInTheDocument();
  // "required" errors are shown only after a continue attempt
  expect(within(newCard).queryByText('Campo obbligatorio')).not.toBeInTheDocument();
});

test('notifies the error and lets the user add admins when the users cannot be loaded', async () => {
  (fetchProductAdmins as Mock).mockRejectedValue(new Error('network error'));
  const { store, user } = renderStep();

  await waitFor(() => expect(appStateSelectors.selectErrors(store.getState())).toHaveLength(1));
  expect(appStateSelectors.selectErrors(store.getState())[0]).toMatchObject({
    blocking: false,
    toNotify: true,
  });
  expect(screen.queryByRole('region', { name: /Amministratore/ })).not.toBeInTheDocument();
  await user.click(addButton());
  expect(adminCard(1)).toBeInTheDocument();
});
