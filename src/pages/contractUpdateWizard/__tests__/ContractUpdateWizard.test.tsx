import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Route, Switch } from 'react-router-dom';
import { Party } from '../../../model/Party';
import { partiesActions } from '../../../redux/slices/partiesSlice';
import { createStore } from '../../../redux/store';
import { submitContractUpdate } from '../../../services/contractUpdateService';
import { fetchProductAdmins } from '../../../services/userService';
import { ENV } from '../../../utils/env';
import { renderWithProviders } from '../../../utils/test-utils';
import {
  CONTRACT_UPDATE_STEPS,
  contractUpdateWizardReducer,
  getVisibleAdmins,
  initialWizardState,
} from '../ContractUpdateWizardContext';
import { ContractUpdateErrorPage, ContractUpdateSuccessPage } from '../ContractUpdateResultPage';
import { ContractUpdateWizardPage } from '../ContractUpdateWizardPage';

vi.mock('../../../services/contractUpdateService', () => ({ submitContractUpdate: vi.fn() }));

vi.mock('../../../services/userService', async () => {
  const mocked = await vi.importActual<typeof import('../../../services/__mocks__/userService')>(
    '../../../services/__mocks__/userService'
  );
  return { fetchProductAdmins: vi.fn(mocked.fetchProductAdmins) };
});

const wizardPath = '/dashboard/party-1/documents/product-1/update-contract';

const selectedParty = {
  partyId: 'party-1',
  description: 'Comune di Roma',
  products: [],
} as unknown as Party;

const renderWizard = (returnTo?: string) => {
  const history = createMemoryHistory({ initialEntries: [wizardPath] });
  if (returnTo) {
    history.replace(wizardPath, { returnTo });
  }
  const store = createStore();
  store.dispatch(partiesActions.setPartySelected(selectedParty));
  renderWithProviders(
    <Switch>
      <Route path={ENV.ROUTES.CONTRACT_UPDATE} exact>
        <ContractUpdateWizardPage />
      </Route>
      <Route path={ENV.ROUTES.CONTRACT_UPDATE_SUCCESS} exact>
        <ContractUpdateSuccessPage />
      </Route>
      <Route path={ENV.ROUTES.CONTRACT_UPDATE_ERROR} exact>
        <ContractUpdateErrorPage />
      </Route>
      <Route path="/dashboard/:partyId/documents" exact>
        <div>Elenco documenti</div>
      </Route>
    </Switch>,
    store,
    history
  );
  // delay: null skips the per-keystroke timer, keeping long typing flows well under the test timeout
  return { history, user: userEvent.setup({ delay: null }) };
};

// getByRole computes the accessible name of every button, which is slow with the admin cards rendered.
// The footer buttons are matched by text, so these helpers must not be used while a dialog is open.
const next = () => screen.getByText('Continua', { selector: 'button' });
const back = () => screen.getByText('Indietro', { selector: 'button' });

const lrTitle = 'Indica il Legale Rappresentante';
const adminsTitle = 'Indica gli Amministratori';
const validLR = {
  Nome: 'Mario',
  Cognome: 'Rossi',
  'Codice Fiscale': 'RSSMRA80A01H501U',
  'Email istituzionale': 'mario.rossi@comune.it',
};

// Sets the value in one event instead of typing every character
const setValue = (field: HTMLElement, value: string) =>
  fireEvent.change(field, { target: { value } });

const fillLR = () =>
  Object.entries(validLR).forEach(([label, value]) =>
    setValue(screen.getByLabelText(label), value)
  );

const goToAdminsStep = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(next());
  fillLR();
  await user.click(next());
  await screen.findByRole('region', { name: 'Amministratore 2' });
};

test('starts with a read-only step, its own main heading and enabled back navigation', () => {
  renderWizard();

  expect(screen.getByRole('heading', { level: 1, name: 'Dati dell’ente' })).toHaveFocus();
  expect(screen.getAllByRole('heading')).toHaveLength(1);
  expect(screen.queryByText(/Step \d di \d/)).not.toBeInTheDocument();
  expect(screen.queryByText(lrTitle)).not.toBeInTheDocument();
  expect(screen.queryByText(adminsTitle)).not.toBeInTheDocument();
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  expect(back()).toBeEnabled();
  expect(next()).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Esci' })).toBeInTheDocument();
});

test.each([undefined, '/dashboard/party-1/documents?filter=contracts#product-1'])(
  'back on the first step returns to the entry page or Documents (%s)',
  async (returnTo) => {
    const { history, user } = renderWizard(returnTo);
    await user.click(back());
    expect(`${history.location.pathname}${history.location.search}${history.location.hash}`).toBe(
      returnTo ?? '/dashboard/party-1/documents'
    );
    expect(screen.getByText('Elenco documenti')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  }
);

test('blocks the Legal Representative step until the data is valid', async () => {
  const { user } = renderWizard();
  await user.click(next());
  expect(screen.getByRole('heading', { level: 1, name: lrTitle })).toHaveFocus();
  expect(screen.queryAllByText('Campo obbligatorio')).toHaveLength(0);

  await user.click(next());
  expect(screen.getByRole('heading', { level: 1, name: lrTitle })).toBeInTheDocument();
  expect(screen.getAllByText('Campo obbligatorio')).toHaveLength(4);

  fillLR();
  expect(screen.queryAllByText('Campo obbligatorio')).toHaveLength(0);
  await user.click(next());
  expect(screen.getByRole('heading', { level: 1, name: adminsTitle })).toHaveFocus();
});

test('preserves the data of every step and validates the admins on continue', async () => {
  const { user } = renderWizard();
  await user.click(next());
  fillLR();

  await user.click(next());
  expect(screen.getByRole('heading', { level: 1, name: adminsTitle })).toHaveFocus();
  const secondAdmin = await screen.findByRole('region', { name: 'Amministratore 2' });
  const email = within(secondAdmin).getByLabelText('Email istituzionale');
  setValue(email, 'giulio@comune.it');

  await user.click(screen.getByRole('button', { name: 'Aggiungi amministratore' }));
  await user.click(next());
  expect(screen.getByRole('heading', { level: 1, name: adminsTitle })).toBeInTheDocument();
  const newAdmin = screen.getByRole('region', { name: 'Amministratore 3' });
  expect(within(newAdmin).getAllByText('Campo obbligatorio')).toHaveLength(4);

  await user.click(back());
  expect(screen.getByLabelText('Nome')).toHaveValue('Mario');
  expect(screen.getByLabelText('Email istituzionale')).toHaveValue('mario.rossi@comune.it');
  await user.click(back());
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

  await user.click(next());
  expect(screen.getByLabelText('Codice Fiscale')).toHaveValue('RSSMRA80A01H501U');
  await user.click(next());
  expect(
    within(screen.getByRole('region', { name: 'Amministratore 2' })).getByLabelText(
      'Email istituzionale'
    )
  ).toHaveValue('giulio@comune.it');
  expect(screen.queryAllByText('Campo obbligatorio')).toHaveLength(0);
  expect(fetchProductAdmins).toHaveBeenCalledTimes(1);

  await user.click(
    within(screen.getByRole('region', { name: 'Amministratore 3' })).getByRole('button', {
      name: 'Rimuovi Amministratore 3',
    })
  );
  await user.click(next());
  expect(
    await screen.findByRole('dialog', { name: 'Confermi la richiesta di invio?' })
  ).toBeInTheDocument();
});

test('shows the product and the institution in the submit dialog and closes it with Indietro', async () => {
  const { user } = renderWizard();
  await goToAdminsStep(user);
  await user.click(next());

  const dialog = await screen.findByRole('dialog', { name: 'Confermi la richiesta di invio?' });
  expect(within(dialog).getByText(/richiesta di adesione al prodotto/)).toBeInTheDocument();
  expect(within(dialog).getByText('product-1', { selector: 'strong' })).toBeInTheDocument();
  expect(within(dialog).getByText('Comune di Roma', { selector: 'strong' })).toBeInTheDocument();
  await user.click(within(dialog).getByRole('button', { name: 'Indietro' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(screen.getByRole('heading', { level: 1, name: adminsTitle })).toBeInTheDocument();
  expect(submitContractUpdate).not.toHaveBeenCalled();
});

test.each([
  [
    'success',
    () => vi.mocked(submitContractUpdate).mockResolvedValue(),
    '/dashboard/party-1/documents/product-1/update-contract/success',
    'Richiesta inviata',
  ],
  [
    'error',
    () => vi.mocked(submitContractUpdate).mockRejectedValue(new Error('KO')),
    '/dashboard/party-1/documents/product-1/update-contract/error',
    'Non è stato possibile inviare la richiesta',
  ],
])(
  'sends the request on confirm and goes to the %s page',
  async (_outcome, mockSubmit, expectedPath, expectedTitle) => {
    mockSubmit();
    const { history, user } = renderWizard();
    await goToAdminsStep(user);
    await user.click(next());

    const dialog = await screen.findByRole('dialog', { name: 'Confermi la richiesta di invio?' });
    await user.click(within(dialog).getByRole('button', { name: 'Continua' }));

    expect(
      await screen.findByRole('heading', { level: 1, name: expectedTitle })
    ).toBeInTheDocument();
    expect(history.location.pathname).toBe(expectedPath);
    expect(submitContractUpdate).toHaveBeenCalledTimes(1);
    expect(submitContractUpdate).toHaveBeenCalledWith(
      selectedParty,
      'product-1',
      expect.objectContaining({
        legalRepresentative: expect.objectContaining({ taxCode: 'RSSMRA80A01H501U' }),
      })
    );
  }
);

test.each([
  '/dashboard/party-1/documents/product-2/update-contract',
  '/dashboard/party-2/documents/product-1/update-contract',
])('starts a fresh draft when the scope changes to %s', async (path) => {
  const { history, user } = renderWizard();
  await user.click(next());
  await user.type(screen.getByLabelText('Nome'), 'old draft');
  act(() => history.push(path));
  expect(screen.getByRole('heading', { level: 1, name: 'Dati dell’ente' })).toBeInTheDocument();
  await user.click(next());
  expect(screen.getByLabelText('Nome')).toHaveValue('');
});

test('bounds navigation and resets the entire shared state without mutating the draft', () => {
  expect(contractUpdateWizardReducer(initialWizardState, { type: 'back' }).activeStep).toBe(0);
  const lastStep = { ...initialWizardState, activeStep: CONTRACT_UPDATE_STEPS.length - 1 };
  expect(contractUpdateWizardReducer(lastStep, { type: 'next' }).activeStep).toBe(
    CONTRACT_UPDATE_STEPS.length - 1
  );
  const edited = contractUpdateWizardReducer(lastStep, {
    type: 'updateLegalRepresentative',
    field: 'name',
    value: 'new value',
  });
  expect(initialWizardState.draft.legalRepresentative.name).toBe('');
  expect(edited.draft.legalRepresentative.name).toBe('new value');
  const withErrors = contractUpdateWizardReducer(edited, { type: 'showErrors' });
  expect(withErrors.showErrors).toBe(true);
  expect(contractUpdateWizardReducer(withErrors, { type: 'back' }).showErrors).toBe(false);
  expect(contractUpdateWizardReducer(edited, { type: 'reset' })).toEqual(initialWizardState);
});

test('manages the admins list in the shared state', () => {
  const loading = contractUpdateWizardReducer(initialWizardState, { type: 'loadAdminsStart' });
  expect(loading.adminsStatus).toBe('loading');
  const loaded = contractUpdateWizardReducer(loading, {
    type: 'loadAdmins',
    admins: [
      {
        userId: 'user-1',
        originalTaxCode: 'RSSMRA80A01H501U',
        name: 'Mario',
        surname: 'Rossi',
        taxCode: 'RSSMRA80A01H501U',
        email: 'mario@comune.it',
      },
    ],
  });
  expect(loaded.adminsStatus).toBe('loaded');
  const added = contractUpdateWizardReducer(loaded, { type: 'addAdmin' });
  expect(added.draft.admins.map((admin) => admin.key)).toEqual(['admin-0', 'admin-1']);
  expect(added.draft.admins[1]).toEqual({
    key: 'admin-1',
    name: '',
    surname: '',
    taxCode: '',
    email: '',
  });
  const updated = contractUpdateWizardReducer(added, {
    type: 'updateAdmin',
    key: 'admin-1',
    field: 'name',
    value: 'Giulio',
  });
  expect(updated.draft.admins[1].name).toBe('Giulio');
  expect(added.draft.admins[1].name).toBe('');

  expect(getVisibleAdmins(updated.draft)).toHaveLength(2);
  const withLR = {
    ...updated.draft,
    legalRepresentative: { ...updated.draft.legalRepresentative, taxCode: 'rssmra80a01h501u' },
  };
  expect(getVisibleAdmins(withLR).map((admin) => admin.key)).toEqual(['admin-1']);

  const removed = contractUpdateWizardReducer(updated, { type: 'removeAdmin', key: 'admin-0' });
  expect(removed.draft.admins.map((admin) => admin.key)).toEqual(['admin-1']);
  expect(contractUpdateWizardReducer(removed, { type: 'addAdmin' }).draft.admins[1].key).toBe(
    'admin-2'
  );
});

test('ignores a duplicate loadAdmins completion so user edits are not overwritten', () => {
  const admin = {
    name: 'Giulio',
    surname: 'Verdi',
    taxCode: 'VRDGLI80A01H501Z',
    email: 'giulio@comune.it',
  };
  const loaded = contractUpdateWizardReducer(
    contractUpdateWizardReducer(initialWizardState, { type: 'loadAdminsStart' }),
    { type: 'loadAdmins', admins: [admin] }
  );
  const duplicate = contractUpdateWizardReducer(loaded, { type: 'loadAdmins', admins: [] });

  expect(duplicate).toBe(loaded);
});
