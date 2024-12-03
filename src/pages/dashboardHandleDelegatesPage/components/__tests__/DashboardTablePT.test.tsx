import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { TypeEnum } from '../../../../api/generated/b4f-dashboard/DelegationResource';
import { DelegationWithInfo } from '../../../../api/generated/b4f-dashboard/DelegationWithInfo';
import { DelegationWithPagination } from '../../../../api/generated/b4f-dashboard/DelegationWithPagination';
import { createStore } from '../../../../redux/store';
import TechPartnersTable from '../TechPartnersTable';
import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';

beforeAll(() => {
  i18n.changeLanguage('it');
});

const mockedDelegation: DelegationWithPagination = {
  delegations: [
    {
      brokerId: '111',
      brokerName: 'Broker 1',
      id: '1',
      institutionId: '1111',
      institutionName: 'Institution 1',
      institutionRootName: 'Root Institution',
      productId: '7890',
      type: TypeEnum.AOO,
    },
    {
      brokerId: '222',
      brokerName: 'Broker EA',
      id: '2',
      institutionId: 'institutionId0',
      institutionName: 'Institution EA',
      institutionRootName: 'Root Institution',
      productId: '7890',
      type: TypeEnum.EA,
    },
  ],
  pageInfo: {
    pageSize: 0,
    pageNo: 0,
    totalPages: 0,
    totalElements: 0,
  },
};

const renderDashboardTablePT = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore || createStore();
  const history = injectedHistory || createMemoryHistory();
  render(
    <Router history={history}>
      <Provider store={store}>
        <TechPartnersTable
          delegationsWithoutDuplicates={mockedDelegation.delegations as Array<DelegationWithInfo>}
        />
      </Provider>
    </Router>
  );
  return { store, history };
};

test('Test rendering renderDashboardTablePT', () => {
  renderDashboardTablePT();
});

test('test input field change and filter on click and search by name', async () => {
  renderDashboardTablePT();

  const select = screen.getByLabelText('Cerca per');
  expect(select).toBeInTheDocument();

  userEvent.click(select);

  const option = await screen.findByText('Nome');
  userEvent.click(option);

  const inputField = (await waitFor(() => screen.getByLabelText('Nome'))) as HTMLInputElement;

  userEvent.clear(inputField);
  expect(inputField).toBeEnabled();
  fireEvent.change(inputField, { target: { value: 'Broker 1' } });

  expect(inputField.value).toBe('Broker 1');

  const filterButton = screen.getByText('Filtra');
  expect(filterButton).toBeEnabled();
  userEvent.click(filterButton);

  const removeFiltersButton = screen.getByText('Rimuovi filtri');
  expect(removeFiltersButton).toBeEnabled();
  fireEvent.click(removeFiltersButton);
});

test('delegation of type EA should be clikable for same institution is present on instituionList', async () => {
  renderDashboardTablePT();
  const delegationOfTypeEA = await screen.findByText('Institution EA - Root Institution');

  expect(delegationOfTypeEA).toBeInTheDocument();

  fireEvent.click(delegationOfTypeEA);
});
