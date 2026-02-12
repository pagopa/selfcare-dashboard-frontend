import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GeographicTaxonomyResource } from '../../../../../../api/generated/b4f-dashboard/GeographicTaxonomyResource';
import { renderWithProviders } from '../../../../../../utils/test-utils';
import GeoTaxonomySection from '../GeoTaxonomySection';

const mockSetOptionsSelected = vi.fn();
const mockSetIsAddNewAutocompleteEnabled = vi.fn();

const mockGeographicTaxonomies: Array<GeographicTaxonomyResource> = [
  { code: '001', desc: 'Area 1' },
  { code: '002', desc: 'Area 2' },
];

beforeEach(() => {
  vi.clearAllMocks();
});

beforeAll(() => {
  i18n.changeLanguage('it');
});

describe('GeoTaxonomySection', () => {
  test('renders component with Local options selected', () => {
    renderWithProviders(
      <GeoTaxonomySection
        geographicTaxonomies={mockGeographicTaxonomies}
        notFoundAnyTaxonomies={true}
        setOptionsSelected={mockSetOptionsSelected}
        setIsAddNewAutocompleteEnabled={mockSetIsAddNewAutocompleteEnabled}
        optionsSelected={mockGeographicTaxonomies}
        isAddNewAutocompleteEnabled={true}
      />
    );

    const localGeoTax = screen.getByRole('radio', { name: /Locale/i });
    expect(localGeoTax).toBeInTheDocument();
    fireEvent.click(localGeoTax);

    const autocomplete = screen.getAllByLabelText('Comune, Provincia o Regione');
    expect(autocomplete[0]).toBeInTheDocument();
    fireEvent.click(autocomplete[0]);

    userEvent.type(autocomplete[0], 'Rom');

    const addButton = screen.getByText('Aggiungi area');
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);

    const clearButton = document.querySelector(
      'button.MuiAutocomplete-clearIndicator'
    ) as HTMLButtonElement;
    expect(clearButton).toBeInTheDocument();
    fireEvent.click(clearButton);
  });

  test('renders component and shows appropriate texts', async () => {
    renderWithProviders(
      <GeoTaxonomySection
        geographicTaxonomies={mockGeographicTaxonomies}
        notFoundAnyTaxonomies={false}
        setOptionsSelected={mockSetOptionsSelected}
        setIsAddNewAutocompleteEnabled={mockSetIsAddNewAutocompleteEnabled}
        optionsSelected={[]}
        isAddNewAutocompleteEnabled={false}
      />
    );

    expect(
      screen.getByText(/Seleziona il territorio in cui opera il tuo ente/i)
    ).toBeInTheDocument();
    const nationalGeoTax = screen.getByRole('radio', { name: /Nazionale/i });
    expect(nationalGeoTax).toBeInTheDocument();
    fireEvent.click(nationalGeoTax);

    const modifyButton = screen.getByText(/Modifica/i);
    expect(modifyButton).toBeInTheDocument();
    fireEvent.click(modifyButton);
  });

  test('renders component with national value preselected and chaging to local', async () => {
    renderWithProviders(
      <GeoTaxonomySection
        geographicTaxonomies={[{ code: 'ITA', desc: 'Area 1' }]}
        notFoundAnyTaxonomies={false}
        setOptionsSelected={mockSetOptionsSelected}
        setIsAddNewAutocompleteEnabled={mockSetIsAddNewAutocompleteEnabled}
        optionsSelected={[{ code: 'ITA', desc: 'Area 1' }]}
        isAddNewAutocompleteEnabled={false}
      />
    );

    const localGeoTax = screen.getByRole('radio', { name: /Locale/i });
    expect(localGeoTax).toBeInTheDocument();
    fireEvent.click(localGeoTax);
  });
});
