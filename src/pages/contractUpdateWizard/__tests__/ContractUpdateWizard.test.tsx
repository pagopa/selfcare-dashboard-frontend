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

const wizardPath = '/dashboard/party-1/documents/update-contract?productId=product-1';

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
  return { history, user: userEvent.setup() };
};

const next = () => screen.getByRole('button', { name: 'Continua' });
const back = () => screen.getByRole('button', { name: 'Indietro' });

test('starts with a read-only step, its own main heading and enabled back navigation', () => {
  renderWizard();

  expect(screen.getByRole('heading', { level: 1, name: 'Dati dell’ente' })).toHaveFocus();
  expect(screen.getAllByRole('heading')).toHaveLength(1);
  expect(screen.queryByText(/Step \d di \d/)).not.toBeInTheDocument();
  expect(screen.queryByText('Dati')).not.toBeInTheDocument();
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

test('preserves editable data in both steps and disables submission in the last step', async () => {
  const { user } = renderWizard();
  await user.click(next());
  expect(screen.getByRole('heading', { level: 1, name: 'Dati' })).toHaveFocus();
  await user.type(screen.getByLabelText('Dato dimostrativo'), 'demo step 2');

  await user.click(next());
  expect(screen.getByRole('heading', { level: 1, name: 'Altri dati' })).toHaveFocus();
  await user.type(screen.getByLabelText('Dato aggiuntivo dimostrativo'), 'demo step 3');
  expect(next()).toBeDisabled();
  expect(screen.getByText(/L’invio non è ancora disponibile/)).toBeInTheDocument();

  await user.click(back());
  expect(screen.getByLabelText('Dato dimostrativo')).toHaveValue('demo step 2');
  await user.type(screen.getByLabelText('Dato dimostrativo'), ' aggiornato');
  await user.click(back());
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

  await user.click(next());
  expect(screen.getByLabelText('Dato dimostrativo')).toHaveValue('demo step 2 aggiornato');
  await user.click(next());
  expect(screen.getByLabelText('Dato aggiuntivo dimostrativo')).toHaveValue('demo step 3');
});

test.each([0, 1, 2])('requires confirmation to exit from step %s', async (step) => {
  const { history, user } = renderWizard();
  if (step > 0) {
    await user.click(next());
    await user.type(screen.getByLabelText('Dato dimostrativo'), 'keep me');
  }
  if (step > 1) {
    await user.click(next());
    await user.type(screen.getByLabelText('Dato aggiuntivo dimostrativo'), 'keep me too');
  }

  await user.click(screen.getByRole('button', { name: 'Esci' }));
  const modal = await screen.findByRole('dialog');
  expect(history.location.pathname).toBe('/dashboard/party-1/documents/update-contract');
  await user.click(within(modal).getByRole('button', { name: 'Annulla' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(
    screen.getByRole('heading', { level: 1, name: ['Dati dell’ente', 'Dati', 'Altri dati'][step] })
  ).toBeInTheDocument();
  if (step > 0) {
    expect(screen.getByRole('textbox')).toHaveValue(step === 1 ? 'keep me' : 'keep me too');
  }

  await user.click(screen.getByRole('button', { name: 'Esci' }));
  await user.click(
    within(await screen.findByRole('dialog')).getByRole('button', { name: 'Conferma uscita' })
  );
  expect(history.location.pathname).toBe('/dashboard/party-1/documents');
  expect(screen.getByText('Elenco documenti')).toBeInTheDocument();

  act(() => history.push(wizardPath));
  expect(screen.getByRole('heading', { level: 1, name: 'Dati dell’ente' })).toBeInTheDocument();
  await user.click(next());
  expect(screen.getByLabelText('Dato dimostrativo')).toHaveValue('');
  await user.click(next());
  expect(screen.getByLabelText('Dato aggiuntivo dimostrativo')).toHaveValue('');
});

test.each([
  '/dashboard/party-1/documents/update-contract?productId=product-2',
  '/dashboard/party-2/documents/update-contract?productId=product-1',
])('starts a fresh draft when the scope changes to %s', async (path) => {
  const { history, user } = renderWizard();
  await user.click(next());
  await user.type(screen.getByLabelText('Dato dimostrativo'), 'old draft');
  act(() => history.push(path));
  expect(screen.getByRole('heading', { level: 1, name: 'Dati dell’ente' })).toBeInTheDocument();
  await user.click(next());
  expect(screen.getByLabelText('Dato dimostrativo')).toHaveValue('');
});

test('bounds navigation and resets the entire shared state without mutating the draft', () => {
  expect(contractUpdateWizardReducer(initialWizardState, { type: 'back' }).activeStep).toBe(0);
  const lastStep = { ...initialWizardState, activeStep: CONTRACT_UPDATE_STEPS.length - 1 };
  expect(contractUpdateWizardReducer(lastStep, { type: 'next' }).activeStep).toBe(
    CONTRACT_UPDATE_STEPS.length - 1
  );
  const edited = contractUpdateWizardReducer(lastStep, {
    type: 'updateDraft',
    field: 'details',
    value: 'new value',
  });
  expect(initialWizardState.draft.details).toBe('');
  expect(edited.draft.details).toBe('new value');
  expect(contractUpdateWizardReducer(edited, { type: 'reset' })).toEqual(initialWizardState);
});
