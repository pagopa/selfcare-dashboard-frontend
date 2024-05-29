import { act, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { TypeEnum } from '../../../api/generated/b4f-dashboard/DelegationResource';
import { createStore } from '../../../redux/store';
import TechPartnersTable from '../TechPartnersTable';
import { DelegationWithPagination } from '../../../api/generated/b4f-dashboard/DelegationWithPagination';
import { DelegationWithInfo } from '../../../api/generated/b4f-dashboard/DelegationWithInfo';

const mockedDelegation: DelegationWithPagination = {
  delegations: [
    {
      brokerId: '123',
      brokerName: 'Broker 1',
      id: '456',
      institutionId: '789',
      institutionName: 'Institution 1',
      institutionRootName: 'Root Institution',
      productId: '7890',
      type: TypeEnum.AOO,
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
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
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

test('test input field change and filter on click', async () => {
  renderDashboardTablePT();

  const select = screen.getByLabelText('Cerca per');

  expect(select).toBeInTheDocument();

  const inputField = screen.getByLabelText('Inserisci') as HTMLInputElement;

  fireEvent.change(inputField, { target: { value: 'Broker 1' } });

  expect(inputField.value).toBe('Broker 1');

  const FilterButton = screen.getByText('Filtra');
  fireEvent.click(FilterButton);
});
