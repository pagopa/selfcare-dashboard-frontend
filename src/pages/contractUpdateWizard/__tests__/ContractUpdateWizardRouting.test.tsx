import { act, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Route, Switch } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import routes from '../../../routes';
import { createStore } from '../../../redux/store';
import { partiesActions } from '../../../redux/slices/partiesSlice';
import { mockedParties } from '../../../services/__mocks__/partyService';
import { renderWithProviders } from '../../../utils/test-utils';

vi.mock('../../../decorators/withParties');
vi.mock('../../../decorators/withSelectedParty');
vi.mock('../../dashboard/Dashboard', () => ({
  default: () => <nav aria-label="Dashboard side menu" />,
}));
vi.mock('@pagopa/selfcare-common-frontend/lib', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@pagopa/selfcare-common-frontend/lib')>()),
  Header: ({ withSecondHeader }: { withSecondHeader: boolean }) => (
    <header>
      Header principale
      {withSecondHeader && <div>Header ente</div>}
    </header>
  ),
  Footer: () => <footer>Footer</footer>,
}));

test('routes outside the dashboard shell and hides only the secondary header during the wizard', () => {
  const history = createMemoryHistory({
    initialEntries: ['/dashboard/party-1/documents/update-contract?productId=product-1'],
  });
  const store = createStore();
  store.dispatch(partiesActions.setPartySelected(mockedParties[0]));
  renderWithProviders(
    <Layout>
      <Switch>
        {Object.values(routes).map(({ path, exact, component: Component }) => (
          <Route key={path} path={path} exact={exact}>
            {Component && <Component />}
          </Route>
        ))}
      </Switch>
    </Layout>,
    store,
    history
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Informazioni' })).toBeInTheDocument();
  expect(screen.getByText('Header principale')).toBeInTheDocument();
  expect(screen.getByText('Footer')).toBeInTheDocument();
  expect(screen.queryByText('Header ente')).not.toBeInTheDocument();
  expect(screen.queryByRole('navigation', { name: 'Dashboard side menu' })).not.toBeInTheDocument();

  act(() => history.push('/dashboard/party-1/documents'));
  expect(screen.getByText('Header ente')).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: 'Dashboard side menu' })).toBeInTheDocument();
});
