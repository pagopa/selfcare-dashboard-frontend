import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Route, Switch } from 'react-router-dom';
import { renderWithProviders } from '../../../utils/test-utils';
import { ENV } from '../../../utils/env';
import { ContractUpdateWizardPage } from '../ContractUpdateWizardPage';
import {
  CONTRACT_UPDATE_STEPS,
  contractUpdateWizardReducer,
  initialWizardState,
} from '../ContractUpdateWizardContext';

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
  expect(screen.queryByText('Altri dati')).not.toBeInTheDocument();
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
  expect(screen.getByRole('heading', { level: 1, name: 'Altri dati' })).toHaveFocus();
});

test('preserves editable data in both steps and disables submission in the last step', async () => {
  const { user } = renderWizard();
  await user.click(next());
  await fillLR(user);

  await user.click(next());
  expect(screen.getByRole('heading', { level: 1, name: 'Altri dati' })).toHaveFocus();
  await user.type(screen.getByLabelText('Dato aggiuntivo dimostrativo'), 'demo step 3');
  expect(next()).toBeDisabled();
  expect(screen.getByText(/L’invio non è ancora disponibile/)).toBeInTheDocument();

  await user.click(back());
  expect(screen.getByLabelText('Nome')).toHaveValue('Mario');
  expect(screen.getByLabelText('Email istituzionale')).toHaveValue('mario.rossi@comune.it');
  await user.click(back());
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

  await user.click(next());
  expect(screen.getByLabelText('Codice Fiscale')).toHaveValue('RSSMRA80A01H501U');
  await user.click(next());
  expect(screen.getByLabelText('Dato aggiuntivo dimostrativo')).toHaveValue('demo step 3');
});

test.each([0, 1, 2])('requires confirmation to exit from step %s', async (step) => {
  const { history, user } = renderWizard();
  if (step > 0) {
    await user.click(next());
    await fillLR(user);
  }
  if (step > 1) {
    await user.click(next());
    await user.type(screen.getByLabelText('Dato aggiuntivo dimostrativo'), 'keep me too');
  }

  await user.click(screen.getByRole('button', { name: 'Esci' }));
  const modal = await screen.findByRole('dialog', { name: 'Vuoi davvero uscire?' });
  expect(modal).toHaveAccessibleDescription(
    'Se esci, la richiesta verrà annullata e dovrai ripartire dall’inizio.'
  );
  expect(history.location.pathname).toBe('/dashboard/party-1/documents/product-1/update-contract');
  await user.click(within(modal).getByRole('button', { name: 'Continua' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(
    screen.getByRole('heading', { level: 1, name: ['Dati dell’ente', lrTitle, 'Altri dati'][step] })
  ).toBeInTheDocument();
  if (step === 1) {
    expect(screen.getByLabelText('Nome')).toHaveValue('Mario');
  }
  if (step === 2) {
    expect(screen.getByRole('textbox')).toHaveValue('keep me too');
  }

  await user.click(screen.getByRole('button', { name: 'Esci' }));
  await user.click(
    within(await screen.findByRole('dialog')).getByRole('button', { name: 'Chiudi' })
  );
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(history.location.pathname).toBe('/dashboard/party-1/documents/product-1/update-contract');

  await user.click(screen.getByRole('button', { name: 'Esci' }));
  await user.click(
    within(await screen.findByRole('dialog')).getByRole('button', { name: 'Torna a Documenti' })
  );
  expect(history.location.pathname).toBe('/dashboard/party-1/documents');
  expect(screen.getByText('Elenco documenti')).toBeInTheDocument();

  act(() => history.push(wizardPath));
  expect(screen.getByRole('heading', { level: 1, name: 'Dati dell’ente' })).toBeInTheDocument();
  await user.click(next());
  expect(screen.getByLabelText('Nome')).toHaveValue('');
  await fillLR(user);
  await user.click(next());
  expect(screen.getByLabelText('Dato aggiuntivo dimostrativo')).toHaveValue('');
}, 15000);

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
