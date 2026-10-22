import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { Mock } from 'vitest';
import userEvent from '@testing-library/user-event';
import { GeographicTaxonomyResource } from '../../../../../../api/generated/b4f-dashboard/GeographicTaxonomyResource';
import { renderWithProviders } from '../../../../../../utils/test-utils';
import { retrieveGeotaxonomyFromDescription } from '../../../../../../services/partyRegistryProxyService';
import GeoTaxonomySection from '../GeoTaxonomySection';

vi.mock('../../../../../../services/partyRegistryProxyService', () => ({
  retrieveGeotaxonomyFromDescription: vi.fn(),
}));

const StatefulGeoTaxonomySection = ({
  initial,
  onChange,
}: {
  initial: Array<GeographicTaxonomyResource>;
  onChange: (os: Array<GeographicTaxonomyResource>) => void;
}) => {
  const [optionsSelected, setOptionsSelected] = useState(initial);
  const [enabled, setEnabled] = useState(false);
  return (
    <GeoTaxonomySection
      geographicTaxonomies={initial}
      notFoundAnyTaxonomies={false}
      setOptionsSelected={(os) => {
        onChange(os);
        setOptionsSelected(os);
      }}
      setIsAddNewAutocompleteEnabled={setEnabled}
      optionsSelected={optionsSelected}
      isAddNewAutocompleteEnabled={enabled}
    />
  );
};

const mockSetOptionsSelected = vi.fn();
const mockSetIsAddNewAutocompleteEnabled = vi.fn();

const mockGeographicTaxonomies: Array<GeographicTaxonomyResource> = [
  { code: '001', desc: 'Area 1' },
  { code: '002', desc: 'Area 2' },
];

beforeEach(() => {
  vi.clearAllMocks();
  // typing triggers a debounced search that may fire after a test ends; always return a promise
  (retrieveGeotaxonomyFromDescription as Mock).mockResolvedValue([]);
});

describe('GeoTaxonomySection', () => {
  test('renders component with Local options selected', async () => {
    const user = userEvent.setup({ delay: null });
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

    await user.type(autocomplete[0], 'Rom');

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

  describe('local area search', () => {
    const onChange = vi.fn();
    const inputs = () => screen.getAllByLabelText('Comune, Provincia o Regione');

    test('removes an additional area', () => {
      renderWithProviders(
        <StatefulGeoTaxonomySection initial={mockGeographicTaxonomies} onChange={onChange} />
      );

      expect(inputs()).toHaveLength(2);
      fireEvent.click(screen.getByTestId('RemoveCircleOutlineOutlinedIcon').closest('button')!);

      expect(inputs()).toHaveLength(1);
      expect(onChange).toHaveBeenLastCalledWith([mockGeographicTaxonomies[0]]);
    });

    test('searches and selects a matching area', async () => {
      (retrieveGeotaxonomyFromDescription as Mock).mockResolvedValue([
        { code: '058091', desc: 'ROMA - COMUNE' },
        { code: '001', desc: 'Area 1' },
      ]);
      const user = userEvent.setup({ delay: null });
      renderWithProviders(
        <StatefulGeoTaxonomySection
          initial={[{ code: '001', desc: 'Area 1' }]}
          onChange={onChange}
        />
      );

      fireEvent.click(screen.getByText('Aggiungi area'));
      expect(inputs()).toHaveLength(2);

      await user.type(inputs()[1], 'Rom');
      await waitFor(() => expect(retrieveGeotaxonomyFromDescription).toHaveBeenCalledWith('Rom'));

      await user.click(await screen.findByRole('option', { name: 'roma - comune' }));
      expect(onChange).toHaveBeenLastCalledWith([
        { code: '001', desc: 'Area 1' },
        { code: '058091', desc: 'ROMA - COMUNE' },
      ]);
      expect(
        screen.queryByText('Scegli una località presente nell’elenco')
      ).not.toBeInTheDocument();
    });

    test('shows an error when no area matches the search', async () => {
      (retrieveGeotaxonomyFromDescription as Mock).mockResolvedValue([]);
      const user = userEvent.setup({ delay: null });
      renderWithProviders(
        <StatefulGeoTaxonomySection
          initial={[{ code: '001', desc: 'Area 1' }]}
          onChange={onChange}
        />
      );

      await user.clear(inputs()[0]);
      await user.type(inputs()[0], 'xyz');

      expect(
        await screen.findByText('Scegli una località presente nell’elenco')
      ).toBeInTheDocument();

      await user.clear(inputs()[0]);
      await user.type(inputs()[0], 'xy');
      await waitFor(() =>
        expect(
          screen.queryByText('Scegli una località presente nell’elenco')
        ).not.toBeInTheDocument()
      );
    });

    test('does not crash when the search fails', async () => {
      (retrieveGeotaxonomyFromDescription as Mock).mockRejectedValue(new Error('error'));
      const user = userEvent.setup({ delay: null });
      renderWithProviders(
        <StatefulGeoTaxonomySection
          initial={[{ code: '001', desc: 'Area 1' }]}
          onChange={onChange}
        />
      );

      await user.clear(inputs()[0]);
      await user.type(inputs()[0], 'abc');

      await waitFor(() => expect(retrieveGeotaxonomyFromDescription).toHaveBeenCalledWith('abc'));
      expect(
        screen.queryByText('Scegli una località presente nell’elenco')
      ).not.toBeInTheDocument();
    });
  });
});
