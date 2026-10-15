import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { Party } from '../../../../../model/Party';
import { partiesActions } from '../../../../../redux/slices/partiesSlice';
import { createStore } from '../../../../../redux/store';
import { mockedParties } from '../../../../../services/__mocks__/partyService';
import { ENV } from '../../../../../utils/env';
import { EMPTY_FIELD_VALUE, useInstitutionDataStep } from '../useInstitutionDataStep';

const renderWithParty = (party?: Party, productId?: string) => {
  const store = createStore();
  store.dispatch(partiesActions.setPartySelected(party));
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[
          productId ? `/dashboard/party-1/documents/${productId}/update-contract` : '/',
        ]}
      >
        <Route path={productId ? ENV.ROUTES.CONTRACT_UPDATE : '/'}>{children}</Route>
      </MemoryRouter>
    </Provider>
  );
  return renderHook(() => useInstitutionDataStep(), { wrapper }).result.current;
};

const valuesById = (fields: ReturnType<typeof useInstitutionDataStep>['fields']) =>
  Object.fromEntries(fields.map(({ id, value }) => [id, value]));

test('maps the selected party to the institution data fields in display order', () => {
  const party: Party = {
    ...mockedParties[0],
    description: 'Comune di Milano',
    registeredOffice: 'Piazza della Scala, 2',
    zipCode: '20121',
    city: 'Milano',
    county: 'MI',
    digitalAddress: 'comune.milano@pec.it',
    fiscalCode: '01199250158',
    vatNumber: '01199250158',
    recipientCode: 'ABC1234',
    supportEmail: 'info@comune.milano.it',
    geographicTaxonomies: [
      { code: '015146', desc: 'Milano - Comune' },
      { code: '015', desc: 'Milano - Provincia' },
    ],
  };

  const { fields, assistanceUrl } = renderWithParty(party);

  expect(fields.map(({ label }) => label)).toEqual([
    'Ragione sociale',
    'Indirizzo e numero civico della sede legale',
    'CAP',
    'Città',
    'Provincia',
    'Indirizzo PEC',
    'Codice Fiscale',
    'Partita IVA',
    'Codice SDI',
    'Indirizzo email visibile ai cittadini',
    'Area geografica',
  ]);
  expect(valuesById(fields)).toEqual({
    businessName: 'Comune di Milano',
    registeredOffice: 'Piazza della Scala, 2',
    zipCode: '20121',
    city: 'Milano',
    county: 'MI',
    digitalAddress: 'comune.milano@pec.it',
    fiscalCode: '01199250158',
    vatNumber: '01199250158',
    recipientCode: 'ABC1234',
    supportEmail: 'info@comune.milano.it',
    geographicTaxonomies: 'Milano - Comune, Milano - Provincia',
  });
  expect(assistanceUrl).toBe(`${ENV.URL_FE.ASSISTANCE}?cat=contract-update`);
});

test('builds the assistance url with the product in the url and the contract-update category', () => {
  const { assistanceUrl } = renderWithParty(mockedParties[0], 'prod-pagopa');
  expect(assistanceUrl).toBe(`${ENV.URL_FE.ASSISTANCE}?productId=prod-pagopa&cat=contract-update`);
});

test('shows a dash for missing, empty or blank values', () => {
  const party: Party = {
    ...mockedParties[0],
    registeredOffice: '',
    zipCode: '   ',
    city: undefined,
    county: undefined,
    vatNumber: undefined,
    supportEmail: '',
    geographicTaxonomies: [],
  };

  const values = valuesById(renderWithParty(party).fields);

  expect(values).toMatchObject({
    businessName: party.description,
    registeredOffice: EMPTY_FIELD_VALUE,
    zipCode: EMPTY_FIELD_VALUE,
    city: EMPTY_FIELD_VALUE,
    county: EMPTY_FIELD_VALUE,
    vatNumber: EMPTY_FIELD_VALUE,
    supportEmail: EMPTY_FIELD_VALUE,
    geographicTaxonomies: EMPTY_FIELD_VALUE,
  });
});

test('shows a dash for every field when no party is selected', () => {
  const { fields } = renderWithParty(undefined);
  expect(fields.every(({ value }) => value === EMPTY_FIELD_VALUE)).toBe(true);
});

test('reads vat number and recipient code from the billing of the product in the url', () => {
  const party: Party = {
    ...mockedParties[0],
    vatNumber: undefined,
    recipientCode: undefined,
    products: [
      {
        ...mockedParties[0].products[0],
        productId: 'prod-io',
        billing: { vatNumber: '11111111111', recipientCode: 'IO00000' },
      },
      {
        ...mockedParties[0].products[0],
        productId: 'prod-pagopa',
        billing: { vatNumber: '02599341209', recipientCode: 'adas' },
      },
    ],
  };

  expect(valuesById(renderWithParty(party, 'prod-pagopa').fields)).toMatchObject({
    vatNumber: '02599341209',
    recipientCode: 'adas',
  });
  expect(valuesById(renderWithParty(party).fields)).toMatchObject({
    vatNumber: EMPTY_FIELD_VALUE,
    recipientCode: EMPTY_FIELD_VALUE,
  });
});

test('falls back to the institution vat number and recipient code without product billing', () => {
  const party: Party = {
    ...mockedParties[0],
    vatNumber: '01199250158',
    recipientCode: 'ABC1234',
    products: [{ ...mockedParties[0].products[0], productId: 'prod-io', billing: undefined }],
  };

  expect(valuesById(renderWithParty(party, 'prod-io').fields)).toMatchObject({
    vatNumber: '01199250158',
    recipientCode: 'ABC1234',
  });
});
