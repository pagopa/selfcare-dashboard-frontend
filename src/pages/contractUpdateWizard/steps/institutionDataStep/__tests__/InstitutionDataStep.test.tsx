import { screen, within } from '@testing-library/react';
import { partiesActions } from '../../../../../redux/slices/partiesSlice';
import { createStore } from '../../../../../redux/store';
import { mockedParties } from '../../../../../services/__mocks__/partyService';
import { ENV } from '../../../../../utils/env';
import { renderWithProviders } from '../../../../../utils/test-utils';
import { InstitutionDataStep } from '../InstitutionDataStep';

test('renders description, support alert and the institution data list', () => {
  const store = createStore();
  store.dispatch(
    partiesActions.setPartySelected({ ...mockedParties[0], county: 'BA', vatNumber: undefined })
  );

  renderWithProviders(<InstitutionDataStep />, store);

  expect(
    screen.getByText(
      'Controlla e conferma i dati dell’ente presenti, assicurandoti che siano corretti.'
    )
  ).toBeInTheDocument();

  const alert = screen.getByRole('alert');
  expect(alert).toHaveTextContent(/I dati del tuo ente non sono corretti o aggiornati\?/);
  expect(within(alert).getByRole('link', { name: 'Contatta l’assistenza' })).toHaveAttribute(
    'href',
    ENV.URL_FE.ASSISTANCE
  );

  const terms = screen.getAllByRole('term');
  const definitions = screen.getAllByRole('definition');
  expect(terms).toHaveLength(11);
  expect(definitions).toHaveLength(11);
  expect(terms[0]).toHaveTextContent('Ragione sociale');
  expect(definitions[0]).toHaveTextContent(mockedParties[0].description);
  expect(terms[4]).toHaveTextContent('Provincia');
  expect(definitions[4]).toHaveTextContent('BA');
  expect(terms[7]).toHaveTextContent('Partita IVA');
  expect(definitions[7]).toHaveTextContent('-');
});
