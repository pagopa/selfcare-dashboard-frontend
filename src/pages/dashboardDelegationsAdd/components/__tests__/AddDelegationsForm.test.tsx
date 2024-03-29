import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { mockedParties } from '../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../../utils/test-utils';
import AddDelegationForm from '../AddDelegationForm';

test('render the form correctly woth empty props', () => {
  renderWithProviders(
    <AddDelegationForm authorizedDelegableProducts={[]} party={mockedParties[0]} />
  );
});

test('render the form correctly and name header should not be visible in pt list combox', () => {
  renderWithProviders(
    <AddDelegationForm
      authorizedDelegableProducts={mockedPartyProducts}
      party={mockedParties[0]}
      selectedProductByQuery={mockedPartyProducts[0]}
    />
  );

  expect(screen.getByText('App IO')).toBeInTheDocument();
  const ptListComboBox = screen.getByLabelText('Seleziona o scegli dalla lista');
  expect(ptListComboBox).toBeInTheDocument();

  fireEvent.click(ptListComboBox);
  // TODO the name should be visible once intermediate enteties data is available
  expect(screen.queryByText('Nome')).not.toBeInTheDocument();
});

test('should display the choose product autocomplete input empty if there are no products selected', () => {
  renderWithProviders(
    <AddDelegationForm authorizedDelegableProducts={mockedPartyProducts} party={mockedParties[0]} />
  );

  const chooseProduct = document.getElementById('select-product-choose') as HTMLInputElement;
  expect(chooseProduct).toBeInTheDocument();

  expect(screen.queryByText('App IO')).not.toBeInTheDocument();
});
