import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { Party } from '../../../../../model/Party';
import { partiesActions } from '../../../../../redux/slices/partiesSlice';
import { createStore } from '../../../../../redux/store';
import { mockedParties } from '../../../../../services/__mocks__/partyService';
import { ENV } from '../../../../../utils/env';
import { EMPTY_FIELD_VALUE, useInstitutionDataStep } from '../useInstitutionDataStep';

const renderWithParty = (party?: Party) => {
  const store = createStore();
  store.dispatch(partiesActions.setPartySelected(party));
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
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
  expect(assistanceUrl).toBe(ENV.URL_FE.ASSISTANCE);
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
