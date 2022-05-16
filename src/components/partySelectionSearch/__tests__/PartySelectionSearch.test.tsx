import { fireEvent, getByText, render, screen, waitFor } from '@testing-library/react';
import { Party } from '../../../model/Party';
import DashboardPartyItem from '../DashboardPartyItem';
import PartySelectionSearch from '../PartySelectionSearch';
import './../../../locale';

let selectedParty: Party | null = null;

const parties: Array<Party> = [
  {
    fiscalCode: 'BARI_FC',
    description: 'Comune di Bari',
    urlLogo: 'image',
    status: 'PENDING',
    partyId: '1',
    digitalAddress: '',
    userRole: 'ADMIN',
    externalId: 'externalId1',
    originId: 'originId1',
    origin: 'IPA',
    registeredOffice: 'registeredOffice',
    typology: 'typology',
  },
  {
    fiscalCode: 'MILANO_FC',
    description: 'Comune di Milano',
    urlLogo: 'image',
    status: 'PENDING',
    partyId: '2',
    digitalAddress: '',
    userRole: 'ADMIN',
    externalId: 'externalId2',
    originId: 'originId2',
    origin: 'IPA',
    registeredOffice: 'registeredOffice',
    typology: 'typology',
  },
  {
    fiscalCode: 'ROMA_FC',
    description: 'Comune di Roma',
    urlLogo: 'image',
    status: 'ACTIVE',
    partyId: '3',
    digitalAddress: '',
    userRole: 'ADMIN',
    externalId: 'externalId3',
    originId: 'originId3',
    origin: 'IPA',
    registeredOffice: 'registeredOffice',
    typology: 'typology',
  },
  {
    fiscalCode: 'NAPOLI_FC',
    description: 'Comune di Napoli',
    urlLogo: 'image',
    status: 'ACTIVE',
    partyId: '4',
    digitalAddress: '',
    userRole: 'ADMIN',
    externalId: 'externalId4',
    originId: 'originId4',
    origin: 'IPA',
    registeredOffice: 'registeredOffice',
    typology: 'typology',
  },
];

beforeEach(() => (selectedParty = null));

test('Test rendering', () => {
  render(
    <PartySelectionSearch parties={parties} onPartySelectionChange={(p) => (selectedParty = p)} />
  );
  const input = document.getElementById('search');

  // search button  "Cerca"
  expect(input.tagName).toBe('INPUT');

  parties
    .map((x) => x.description)
    .forEach((element) => {
      screen.getByText(element);
    });

  // la serach è presente solo se ho più di 3 parties
  if (parties.length > 3) {
    expect(input.tagName).toBe('INPUT');
  } else {
    expect(input.tagName).not.toBe('INPUT');
  }
});

test('Test filter', () => {
  render(
    <PartySelectionSearch parties={parties} onPartySelectionChange={(p) => (selectedParty = p)} />
  );
  const input = document.getElementById('search');
  const filterNapoli = 'Napoli';

  // modify input field
  fireEvent.change(input, { target: { value: filterNapoli } });
  expect(input.getAttribute('value')).toBe(filterNapoli);

  parties
    .map((x) => x.description)
    .forEach((element) => {
      const party = screen.queryByText(element);

      if (element.indexOf(filterNapoli) > -1) {
        expect(party).not.toBeNull();
      } else {
        expect(party).toBeNull();
      }
    });

  fireEvent.change(input, { target: { value: null } });
  expect(input.getAttribute('value')).toBe('');

  parties
    .map((x) => x.description)
    .forEach((element) => {
      screen.getByText(element);
    });
});

test('Test selection when there are < 3 parties', async () => {
  const partiesLessThen3 = parties.slice();
  partiesLessThen3.shift();
  render(
    <PartySelectionSearch
      parties={partiesLessThen3}
      onPartySelectionChange={(p) => (selectedParty = p)}
    />
  );
  const input = document.getElementById('search');
  const filterPartyNapoli = 'Comune di Napoli Comune di Napoli Amministratore';
  // const filterPartyBari= 'Comune di Bari Referente Amministrativo';
  const filterNapoli = 'Napoli';
  const filterRoma = 'ROMA';

  expect(selectedParty).toBe(null);
  // seleziona su uno dei party Napoli
  const buttonParty = screen.getByRole('button', { name: filterPartyNapoli });

  fireEvent.click(buttonParty);

  // verifichiamo che al click sia selezionato il pulsante "Napoli"
  const selectedLessThen3 = screen.getByTestId('selectedLessThen3');
  getByText(selectedLessThen3, 'Comune di Napoli');
});

test('Test selection when there are > 3 parties', async () => {
  render(
    <PartySelectionSearch parties={parties} onPartySelectionChange={(p) => (selectedParty = p)} />
  );
  const input = document.getElementById('search');
  const filterPartyNapoli = 'Comune di Napoli Amministratore';
  // const filterPartyBari= 'Comune di Bari Referente Amministrativo';
  const filterNapoli = 'Napoli';
  const filterRoma = 'ROMA';
  expect(selectedParty).toBe(null);
  // seleziona su uno dei party Napoli
  const buttonParty = screen.getByRole('button', { name: filterPartyNapoli });

  fireEvent.click(buttonParty);

  // verifichiamo che al click sia selezionato il pulsante "Napoli"
  const selectedLessThen3 = screen.getByTestId('selectedMoreThen3');
  getByText(selectedLessThen3, 'Comune di Napoli');
});

test('Test pending party', () => {
  render(
    <PartySelectionSearch parties={parties} onPartySelectionChange={(p) => (selectedParty = p)} />
  );

  // verifica che esista almeno un bottone disabilitato che ha etichetta 'da completare' in XPath
  const firstPartyDisabled = document
    .evaluate(
      '//div[@role="PartyItemContainer" and .//text()="Da completare"]//*[contains(@class,"Mui-disabled")]',
      document,
      null,
      XPathResult.ANY_TYPE
    )
    .iterateNext();
  expect(firstPartyDisabled).not.toBeNull();
  expect(firstPartyDisabled.textContent).toBe('Comune di BariAmministratore');
  // cerca comune di bari e verifica che contenga "Da completare"
  const PartyItemContainer = document.getElementById('toBeCompletedChip');
});
