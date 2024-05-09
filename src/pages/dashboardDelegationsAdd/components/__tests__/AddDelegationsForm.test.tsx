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
  const ptListComboBox = screen.getByLabelText('Inserisci la ragione sociale');
  expect(ptListComboBox).toBeInTheDocument();

  const searchByFiscalCodeRadio = screen.getByLabelText('Codice Fiscale ente');
  expect(searchByFiscalCodeRadio).toBeInTheDocument();

  fireEvent.click(searchByFiscalCodeRadio);
  expect(searchByFiscalCodeRadio).toBeChecked();

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

test('should display documentation link with correct href and text content', async () => {
  renderWithProviders(
    <AddDelegationForm authorizedDelegableProducts={mockedPartyProducts} party={mockedParties[0]} />
  );

  const href =
    'https://docs.pagopa.it/area-riservata/area-riservata/come-funziona/come-delegare-la-gestione';
  const linkElement = screen.getByText('Dubbi? Vai al manuale');

  expect(linkElement).toHaveAttribute('href', href);

  expect(linkElement).toHaveStyle(`
    font-weight: 700;
    font-size: 14px;
  `);

  fireEvent.click(linkElement);
});
