import { render, screen, waitFor } from '@testing-library/react';
import './../../../../../locale';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import PartyCard from '../PartyCard';
import { Party } from '../../../../../model/Party';

const mockedPA: Party = {
  userRole: 'ADMIN',
  description: 'Comune di Bari',
  urlLogo: 'image',
  status: 'ACTIVE',
  partyId: '1',
  digitalAddress: 'comune.bari@pec.it',
  fiscalCode: '111111111111',
  category: 'Comuni e loro Consorzi e Associazioni',
  registeredOffice: 'Piazza della Scala, 2',
  zipCode: '20121',
  typology: 'Pubblica Amministrazione',
  externalId: 'externalId1',
  originId: 'originId1',
  origin: 'IPA',
  institutionType: 'PA',
  recipientCode: 'CGDAS23A',
  geographicTaxonomies: [{ code: '058091', desc: 'Roma - Comune' }], // Use case with one taxonomy
  vatNumber: '111111111141',
  supportEmail: '',
};

const mockedGSP: Party = {
  userRole: 'ADMIN',
  description: 'Scuola Media Oswald Von Wolkenstein di Bressa',
  urlLogo: 'image',
  status: 'ACTIVE',
  partyId: '6',
  digitalAddress: 'comune.bressanone@pec.it',
  fiscalCode: '111122211113',
  category: 'Comuni e loro Consorzi e Associazioni',
  registeredOffice: 'Piazza della Scala, 2',
  zipCode: '20121',
  typology: 'Gestore di servizi pubblici',
  externalId: 'externalId6',
  originId: 'originId6',
  origin: 'IPA',
  institutionType: 'GSP',
  recipientCode: 'CGDAS23F',
  geographicTaxonomies: [],
  vatNumber: '111122211111',
};

const renderCard = (party: Party = mockedGSP) => {
  render(
    <Provider store={createStore()}>
      <PartyCard party={party} />
    </Provider>
  );
};

test('test render component', () => {
  console.log('render component');
  renderCard(mockedPA);
  expect(document.getElementById('partyCard'));
});

test('test filelds based on institution type', async () => {
  console.log('test filelds based on institution type');
  renderCard();

  await waitFor(() => screen.getByText('Gestore di servizi pubblici'));

  if (mockedGSP.fiscalCode === mockedGSP.vatNumber) {
    await waitFor(() => screen.getByText('Codice Fiscale / P.IVA'));
  }

  if (mockedGSP.fiscalCode !== mockedGSP.vatNumber) {
    await waitFor(() => screen.getByText('Partita IVA'));
  }
  await waitFor(() => screen.getAllByText('Codice SDI'));
});
