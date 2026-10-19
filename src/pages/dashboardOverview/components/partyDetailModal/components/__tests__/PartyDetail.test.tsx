import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Party } from '../../../../../../model/Party';
import { partiesActions } from '../../../../../../redux/slices/partiesSlice';
import { createStore } from '../../../../../../redux/store';
import { mockedParties } from '../../../../../../services/__mocks__/partyService';
import { renderWithProviders } from '../../../../../../utils/test-utils';
import PartyDetail from '../PartyDetail';

const baseParty: Party = {
  ...mockedParties[0],
  partyId: 'party-1',
  description: 'Comune di Test',
  fiscalCode: '11111111111',
  digitalAddress: 'comune.test@pec.it',
  registeredOffice: 'Piazza Test 1',
  zipCode: '00100',
  category: 'Comuni',
  origin: 'IPA',
  subunitType: undefined,
  subunitCode: undefined,
  aooParentCode: undefined,
  country: undefined,
  city: undefined,
  vatNumberGroup: undefined,
  products: [
    {
      productId: 'prod-pagopa',
      productOnBoardingStatus: 'ACTIVE',
      institutionType: 'PA',
      originId: 'c_test',
      billing: { vatNumber: '22222222222' },
    },
  ] as Party['products'],
};

const renderPartyDetail = (
  party: Party,
  institutionTypesList: Array<string>,
  {
    showGeoTaxonomy = false,
    partySelected,
    canUpdateGeoTaxonomy = false,
    setOpenModal = vi.fn(),
  }: {
    showGeoTaxonomy?: boolean;
    partySelected?: Party;
    canUpdateGeoTaxonomy?: boolean;
    setOpenModal?: (open: boolean) => void;
  } = {}
) => {
  const store = createStore();
  if (partySelected) {
    store.dispatch(partiesActions.setPartySelected(partySelected));
  }
  if (canUpdateGeoTaxonomy) {
    store.dispatch(
      setProductPermissions([{ productId: 'prod-pagopa', actions: [Actions.UpdateGeoTaxonomy] }])
    );
  }
  return renderWithProviders(
    <PartyDetail
      party={party}
      institutionTypesList={institutionTypesList}
      showGeoTaxonomyForInstitutionType={showGeoTaxonomy}
      setOpenModalAddNewGeographicTaxonomies={setOpenModal}
    />,
    store
  );
};

describe('PartyDetail', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('renders PA details with ipa code, fiscal code, vat number and zip code', () => {
    renderPartyDetail(baseParty, ['PA']);

    expect(screen.getByText('Ragione sociale')).toBeInTheDocument();
    expect(screen.getByText('Comune di Test')).toBeInTheDocument();
    expect(screen.getByText('Pubblica Amministrazione')).toBeInTheDocument();
    expect(screen.getByText('Comuni')).toBeInTheDocument();
    expect(screen.getByText('Codice IPA')).toBeInTheDocument();
    expect(screen.getByText('c_test')).toBeInTheDocument();
    expect(screen.getByText('Codice Fiscale')).toBeInTheDocument();
    expect(screen.getByText('11111111111')).toBeInTheDocument();
    expect(screen.getByText('Partita IVA')).toBeInTheDocument();
    expect(screen.getByText('22222222222')).toBeInTheDocument();
    expect(screen.getByText('comune.test@pec.it')).toBeInTheDocument();
    expect(screen.getByText('Piazza Test 1 - 00100')).toBeInTheDocument();
    expect(screen.queryByText('Struttura')).not.toBeInTheDocument();
    expect(screen.queryByText('Area geografica')).not.toBeInTheDocument();
    expect(screen.queryByText('Partita IVA di gruppo')).not.toBeInTheDocument();
  });

  test('renders combined fiscal code / vat label when they are equal, without zip code', () => {
    renderPartyDetail(
      {
        ...baseParty,
        zipCode: undefined,
        category: undefined,
        products: [{ ...baseParty.products[0], billing: { vatNumber: '11111111111' } }],
      },
      ['PA']
    );

    expect(screen.getByText('Codice Fiscale / P.IVA')).toBeInTheDocument();
    expect(screen.queryByText('Partita IVA')).not.toBeInTheDocument();
    expect(screen.queryByText('Categoria')).not.toBeInTheDocument();
    expect(screen.getByText('Piazza Test 1')).toBeInTheDocument();
  });

  test('renders AOO details with denomination, structure and unique code', () => {
    renderPartyDetail({ ...baseParty, subunitType: 'AOO', subunitCode: 'AOO_CODE' }, ['PA']);

    expect(screen.getByText('Denominazione')).toBeInTheDocument();
    expect(screen.getByText('Area Organizzativa Omogenea')).toBeInTheDocument();
    expect(screen.getByText('Codice Univoco')).toBeInTheDocument();
    expect(screen.getByText('AOO_CODE')).toBeInTheDocument();
    expect(screen.queryByText('Codice IPA')).not.toBeInTheDocument();
    expect(screen.queryByText('AOO di riferimento')).not.toBeInTheDocument();
  });

  test('renders UO details with the parent AOO code', () => {
    renderPartyDetail(
      { ...baseParty, subunitType: 'UO', subunitCode: 'UO_CODE', aooParentCode: 'PARENT_AOO' },
      ['PA']
    );

    expect(screen.getByText('Unità Organizzativa')).toBeInTheDocument();
    expect(screen.getByText('AOO di riferimento')).toBeInTheDocument();
    expect(screen.getByText('PARENT_AOO')).toBeInTheDocument();
  });

  test('renders non PA PSP details with vat number group and hides institution type when many', () => {
    renderPartyDetail({ ...baseParty, vatNumberGroup: true, products: [] }, ['PSP', 'GSP']);

    expect(screen.queryByText('Tipologia')).not.toBeInTheDocument();
    expect(screen.queryByText('Categoria')).not.toBeInTheDocument();
    expect(screen.getByText('Codice Fiscale')).toBeInTheDocument();
    expect(screen.getByText('Partita IVA di gruppo')).toBeInTheDocument();
    expect(screen.getByText('Sì')).toBeInTheDocument();
    expect(screen.queryByText('Partita IVA')).not.toBeInTheDocument();
  });

  test('renders vat number group "No" and no fiscal code for PSP without them', () => {
    renderPartyDetail(
      {
        ...baseParty,
        fiscalCode: undefined,
        vatNumberGroup: false,
        products: [{ ...baseParty.products[0], billing: { vatNumber: '99' } }],
      },
      ['PSP']
    );

    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.queryByText('Codice Fiscale')).not.toBeInTheDocument();
    expect(screen.queryByText('Codice Fiscale / P.IVA')).not.toBeInTheDocument();
  });

  test('renders combined fiscal code / vat label for a non PA party', () => {
    renderPartyDetail(
      {
        ...baseParty,
        products: [{ ...baseParty.products[0], billing: { vatNumber: '11111111111' } }],
      },
      ['GSP']
    );
    expect(screen.getByText('Codice Fiscale / P.IVA')).toBeInTheDocument();
  });

  test('renders the foreign address fetching the country list', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve([{ name: 'Regno Unito', alpha_2: 'GB' }]),
    });
    vi.stubGlobal('fetch', fetchMock);

    renderPartyDetail(
      { ...baseParty, country: 'GB', city: 'london', registeredOffice: 'Baker Street' },
      ['AS']
    );

    expect(await screen.findByText('Baker Street, London - Regno Unito')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('renders geographic taxonomy with edit button showing the extra count', () => {
    const setOpenModal = vi.fn();
    renderPartyDetail(baseParty, ['PA'], {
      showGeoTaxonomy: true,
      canUpdateGeoTaxonomy: true,
      setOpenModal,
      partySelected: {
        ...baseParty,
        geographicTaxonomies: [
          { code: '058091', desc: 'ROMA - COMUNE' },
          { code: '015146', desc: 'MILANO - COMUNE' },
        ],
      },
    });

    expect(screen.getByText('Area geografica')).toBeInTheDocument();
    expect(screen.getByText('roma - comune')).toBeInTheDocument();
    const editButton = screen.getByRole('button', {
      name: 'Modifica area geografica, 1 altra presente',
    });
    expect(editButton).toHaveTextContent('+1');
    fireEvent.click(editButton);
    expect(setOpenModal).toHaveBeenCalledWith(true);
  });

  test('renders geographic taxonomy edit button without count for a single taxonomy', () => {
    renderPartyDetail(baseParty, ['PA'], {
      showGeoTaxonomy: true,
      canUpdateGeoTaxonomy: true,
      partySelected: { ...baseParty, geographicTaxonomies: [{ code: 'ITA', desc: 'ITALIA' }] },
    });

    expect(screen.getByText('italia')).toBeInTheDocument();
    const editButton = screen.getByRole('button', { name: 'Modifica area geografica' });
    expect(editButton).not.toHaveTextContent('+');
  });

  test('renders placeholder and no edit button without taxonomies or permission', async () => {
    renderPartyDetail(baseParty, ['PA'], {
      showGeoTaxonomy: true,
      partySelected: { ...baseParty, geographicTaxonomies: undefined as any },
    });

    expect(screen.getByText('-')).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: /Modifica area geografica/ })
      ).not.toBeInTheDocument()
    );
  });
});
