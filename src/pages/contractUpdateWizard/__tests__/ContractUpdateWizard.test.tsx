import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Route, Switch } from 'react-router-dom';
import { fetchProductAdmins } from '../../../services/userService';
import { ENV } from '../../../utils/env';
import { renderWithProviders } from '../../../utils/test-utils';
import {
  CONTRACT_UPDATE_STEPS,
  contractUpdateWizardReducer,
  getVisibleAdmins,
  initialWizardState,
} from '../ContractUpdateWizardContext';
import { ContractUpdateWizardPage } from '../ContractUpdateWizardPage';

vi.mock('../../../services/userService', async () => {
  const mocked = await vi.importActual<typeof import('../../../services/__mocks__/userService')>(
    '../../../services/__mocks__/userService'
  );
  return { fetchProductAdmins: vi.fn(mocked.fetchProductAdmins) };
});

const wizardPath = '/dashboard/party-1/documents/product-1/update-contract';

const renderWizard = (returnTo?: string) => {
  const history = createMemoryHistory({ initialEntries: [wizardPath] });
  if (returnTo) {
    history.replace(wizardPath, { returnTo });
  }
  renderWithProviders(
    <Switch>
      <Route path={ENV.ROUTES.CONTRACT_UPDATE} exact>
        <ContractUpdateWizardPage />
      </Route>
      <Route path="/dashboard/:partyId/documents" exact>
        <div>Elenco documenti</div>
      </Route>
    </Switch>,
    undefined,
    history
  );
  // delay: null skips the per-keystroke timer, keeping long typing flows well under the test timeout
  return { history, user: userEvent.setup({ delay: null }) };
};

const next = () => screen.getByRole('button', { name: 'Continua' });
const back = () => screen.getByRole('button', { name: 'Indietro' });

const lrTitle = 'Indica il Legale Rappresentante';
const adminsTitle = 'Indica gli Amministratori';
const validLR = {
  Nome: 'Mario',
  Cognome: 'Rossi',
  'Codice Fiscale': 'RSSMRA80A01H501U',
  'Email istituzionale': 'mario.rossi@comune.it',
};

const fillLR = async (user: ReturnType<typeof userEvent.setup>) => {
  for (const [label, value] of Object.entries(validLR)) {
    await user.type(screen.getByLabelText(label), value);
  }
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

  await fillLR(user);
  expect(screen.queryAllByText('Campo obbligatorio')).toHaveLength(0);
  await user.click(next());
  expect(screen.getByRole('heading', { level: 1, name: adminsTitle })).toHaveFocus();
});

test('preserves the data of every step and validates the admins on continue', async () => {
  const { user } = renderWizard();
  await user.click(next());
  await fillLR(user);

  await user.click(next());
  expect(screen.getByRole('heading', { level: 1, name: adminsTitle })).toHaveFocus();
  const secondAdmin = await screen.findByRole('region', { name: 'Amministratore 2' });
  const email = within(secondAdmin).getByLabelText('Email istituzionale');
  await user.clear(email);
  await user.type(email, 'giulio@comune.it');

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
  // TODO: assert the submission when the contract update API is available
  await user.click(next());
  expect(screen.getByRole('heading', { level: 1, name: adminsTitle })).toBeInTheDocument();
  expect(screen.queryAllByText('Campo obbligatorio')).toHaveLength(0);
}, 20000);

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
