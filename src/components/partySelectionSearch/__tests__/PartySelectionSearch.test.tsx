import { fireEvent, getByText, render, screen } from '@testing-library/react';
import { Party } from '../../../model/Party';
import PartySelectionSearch from '../PartySelectionSearch';
import './../../../locale';

let selectedParty: Party | null = null;

const parties: Array<Party> = [
  {
    fiscalCode: 'BARI_FC',
    description: 'Comune di Bari',
    urlLogo: 'image',
    status: 'PENDING',
    origin: 'IPA',
    partyId: '1',
    digitalAddress: '',
    userRole: 'ADMIN',
    externalId: 'externalId1',
    originId: 'originId1',
  },
  {
    fiscalCode: 'MILANO_FC',
    description: 'Comune di Milano',
    urlLogo: 'image',
    status: 'PENDING',
    origin: 'IPA',
    partyId: '2',
    digitalAddress: '',
    userRole: 'ADMIN',
    externalId: 'externalId2',
    originId: 'originId2',
  },
  {
    fiscalCode: 'ROMA_FC',
    description: 'Comune di Roma',
    urlLogo: 'image',
    status: 'ACTIVE',
    origin: 'IPA',
    partyId: '3',
    digitalAddress: '',
    userRole: 'ADMIN',
    externalId: 'externalId3',
    originId: 'originId3',
  },
  {
    fiscalCode: 'NAPOLI_FC',
    description: 'Comune di Napoli',
    urlLogo: 'image',
    status: 'ACTIVE',
    origin: 'IPA',
    partyId: '4',
    digitalAddress: '',
    userRole: 'ADMIN',
    externalId: 'externalId4',
    originId: 'originId4',
  },
];

beforeEach(() => (selectedParty = null));

test('Test rendering', () => {
  render(
    <PartySelectionSearch parties={parties} onPartySelectionChange={(p) => (selectedParty = p)} />
  );
  const input = screen.getByPlaceholderText('Cerca ente');

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
  const input = screen.getByPlaceholderText('Cerca ente');
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

test('Test selection', () => {
  render(
    <PartySelectionSearch parties={parties} onPartySelectionChange={(p) => (selectedParty = p)} />
  );
  const input = screen.getByPlaceholderText('Cerca ente');
  const filterPartyNapoli = 'Comune di Napoli Amministratore';
  // const filterPartyBari= 'Comune di Bari Referente Amministrativo';
  const filterNapoli = 'Napoli';
  const filterRoma = 'ROMA';

  expect(selectedParty).toBe(null);

  // seleziona su uno dei party Napoli
  const buttonParty = screen.getByRole('button', { name: filterPartyNapoli });
  fireEvent.click(buttonParty);

  // verifichiamo che al click sia selezionato il pulsante "Napoli"
  expect(buttonParty.className.indexOf('Mui-selected') > -1).toBe(true);

  expect(selectedParty).not.toBe(null);
  expect(selectedParty.description).toBe('Comune di Napoli');

  // scrivo Napoli nel filtro
  fireEvent.change(input, { target: { value: filterNapoli } });
  expect(input.getAttribute('value')).toBe(filterNapoli);

  expect(selectedParty).not.toBe(null);
  expect(selectedParty.description).toBe('Comune di Napoli');

  // scrivi nella serach in maiuscolo Roma
  fireEvent.change(input, { target: { value: filterRoma } });
  expect(input.getAttribute('value')).toBe(filterRoma);

  expect(selectedParty).toBe(null);
});

test('Test pending party', () => {
  render(
    <PartySelectionSearch parties={parties} onPartySelectionChange={(p) => (selectedParty = p)} />
  );
  // verifica che esista almeno un bottone disabilitato che ha etichetta 'da completare' in XPath
  const firstPartyDisabled = document
    .evaluate(
      '//div[@role="Institution" and .//text()="Da completare"]//*[contains(@class,"Mui-disabled")]',
      document,
      null,
      XPathResult.ANY_TYPE
    )
    .iterateNext();
  expect(firstPartyDisabled).not.toBeNull();
  expect(firstPartyDisabled.textContent).toBe('Comune di BariAmministratore');

  // cerca comune di bari e verifica che contenga "Da completare"
  const PartyItemContainer = screen.getByTestId('PartyItemContainer: Comune di Bari');
  getByText(PartyItemContainer, 'Da completare');
});
