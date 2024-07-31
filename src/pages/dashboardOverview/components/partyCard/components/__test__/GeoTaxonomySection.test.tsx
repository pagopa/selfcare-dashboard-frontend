import { act, fireEvent, screen } from '@testing-library/react';
import { GeographicTaxonomyResource } from '../../../../../../api/generated/b4f-dashboard/GeographicTaxonomyResource';
import { renderWithProviders } from '../../../../../../utils/test-utils';
import GeoTaxonomySection from '../GeoTaxonomySection';

const mockSetOptionsSelected = jest.fn();
const mockSetIsAddNewAutocompleteEnabled = jest.fn();

const mockGeographicTaxonomies: Array<GeographicTaxonomyResource> = [
  { code: '001', desc: 'Area 1' },
  { code: '002', desc: 'Area 2' },
];

describe('GeoTaxonomySection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders component and shows appropriate texts', () => {
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
    expect(screen.getByRole('radio', { name: /Nazionale/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Locale/i })).toBeInTheDocument();
  });
});
