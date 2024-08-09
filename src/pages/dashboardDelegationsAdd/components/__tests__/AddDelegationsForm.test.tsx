import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { mockedParties } from '../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../../utils/test-utils';
import AddDelegationForm from '../AddDelegationForm';
import userEvent from '@testing-library/user-event';

test('render the form correctly woth empty props', () => {
  renderWithProviders(
    <AddDelegationForm authorizedDelegableProducts={[]} party={mockedParties[0]} />
  );

  const escapeButton = screen.getByText('Esci');
  fireEvent.click(escapeButton);
});

test('search by name', async () => {
  renderWithProviders(
    <AddDelegationForm
      authorizedDelegableProducts={[mockedPartyProducts[0]]}
      party={mockedParties[2]}
      selectedProductByQuery={mockedPartyProducts[0]}
    />
  );

  expect(screen.getByText('App IO')).toBeInTheDocument();
  const autocompleteInput = screen.getByLabelText('Inserisci la ragione sociale');
  expect(autocompleteInput).toBeInTheDocument();

  userEvent.type(autocompleteInput, 'Random');

  userEvent.clear(autocompleteInput);

  userEvent.type(autocompleteInput, 'Maggi');
});

test('search by fiscal code', async () => {
  renderWithProviders(
    <AddDelegationForm
      authorizedDelegableProducts={[mockedPartyProducts[0]]}
      party={mockedParties[2]}
      selectedProductByQuery={mockedPartyProducts[0]}
    />
  );
  const searchByFiscalCodeRadio = screen.getByLabelText('Codice Fiscale ente');
  expect(searchByFiscalCodeRadio).toBeInTheDocument();

  fireEvent.click(searchByFiscalCodeRadio);
  await waitFor(() => expect(searchByFiscalCodeRadio).toBeChecked());

  const insertCFCodeInput = screen.getByLabelText(
    'Inserisci il Codice Fiscale'
  ) as HTMLInputElement;

  fireEvent.click(insertCFCodeInput);

  userEvent.type(insertCFCodeInput, '12345678914');

  const confirmationButton = screen.getByText('Conferma');
  expect(confirmationButton).toBeInTheDocument();
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
