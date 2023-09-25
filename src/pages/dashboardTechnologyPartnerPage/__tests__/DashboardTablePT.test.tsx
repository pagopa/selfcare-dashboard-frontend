import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { TypeEnum } from '../../../api/generated/b4f-dashboard/DelegationResource';
import { createStore } from '../../../redux/store';
import DashboardTablePT from '../DashboardTablePT';

const mockedDelegation = [
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
];

const renderDashboardTablePT = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Router history={history}>
      <Provider store={store}>
        <DashboardTablePT
          filteredArray={mockedDelegation}
          searchResults={[]}
          setSearchResults={jest.fn()}
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

  // Find the input field by its label
  const inputField = screen.getByLabelText('Cerca per nome') as HTMLInputElement;

  // Simulate user typing "Broker 1"
  fireEvent.change(inputField, { target: { value: 'Broker 1' } });

  // Expectation: Check that the input field value has been updated
  expect(inputField.value).toBe('Broker 1');

  // Find and click the button
  const FilterButton = screen.getByText('Filtra');
  fireEvent.click(FilterButton);
});
