import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { mockedParties } from '../../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../../../utils/test-utils';
import AddDelegationForm from '../AddDelegationForm';

beforeAll(() => {
  i18n.changeLanguage('it');
});

test('render the form correctly woth empty props', () => {
  renderWithProviders(
    <AddDelegationForm productsWithCreateDelegationAction={[]} party={mockedParties[0]} />
  );

  const escapeButton = screen.getByText('Esci');
  fireEvent.click(escapeButton);
});

test('search by name', async () => {
  renderWithProviders(
    <AddDelegationForm
      productsWithCreateDelegationAction={[mockedPartyProducts[2]]}
      party={mockedParties[2]}
      selectedProductByQuery={mockedPartyProducts[2]}
    />
  );

  expect(screen.getByText('Pagamenti pagoPA')).toBeInTheDocument();
  const autocompleteInput = screen.getByLabelText(
    'Inserisci la ragione sociale'
  ) as HTMLInputElement;
  expect(autocompleteInput).toBeInTheDocument();

  userEvent.type(autocompleteInput, 'Random');
  fireEvent.change(autocompleteInput, { target: { value: 'Random' } });

  userEvent.clear(autocompleteInput);

  userEvent.type(autocompleteInput, 'Maggi');
  fireEvent.change(autocompleteInput, { target: { value: 'Maggi' } });

  const confirmDelegationBtn = await screen.findByText('Conferma');
  expect(confirmDelegationBtn).toBeInTheDocument();
  fireEvent.click(confirmDelegationBtn);
});

test('search by fiscal code', async () => {
  renderWithProviders(
    <AddDelegationForm
      productsWithCreateDelegationAction={[mockedPartyProducts[0]]}
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

  fireEvent.change(insertCFCodeInput, { target: { value: '1234567891' } });

  userEvent.type(insertCFCodeInput, '12345678914');
  fireEvent.change(insertCFCodeInput, { target: { value: '12345678914' } });

  const exitButton = screen.getByText('Esci');
  expect(exitButton).toBeInTheDocument();

  expect(exitButton).toBeEnabled();
  fireEvent.click(exitButton);
});

test('should display the choose product autocomplete input empty if there are no products selected', () => {
  renderWithProviders(
    <AddDelegationForm
      productsWithCreateDelegationAction={mockedPartyProducts}
      party={mockedParties[0]}
    />
  );

  const chooseProduct = document.getElementById('select-product-choose') as HTMLInputElement;
  expect(chooseProduct).toBeInTheDocument();

  expect(screen.queryByText('IO')).not.toBeInTheDocument();
});

test('should display documentation link with correct href and text content', async () => {
  renderWithProviders(
    <AddDelegationForm
      productsWithCreateDelegationAction={mockedPartyProducts}
      party={mockedParties[0]}
    />
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
