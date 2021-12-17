import { fireEvent, getByText, render, screen } from '@testing-library/react';
import { Party } from '../../../../model/Party';
import PartySelection from '../PartySelection';

const parties: Array<Party> = [
  {
    role: 'MANAGER',
    description: 'Comune di Bari',
    urlLogo: 'image',
    status: 'PENDING',
    institutionId: '1',
    digitalAddress: '',
    userRole: 'ADMIN',
  },
  {
    role: 'MANAGER',
    description: 'Comune di Milano',
    urlLogo: 'image',
    status: 'PENDING',
    institutionId: '2',
    digitalAddress: '',
    userRole: 'ADMIN',
  },
  {
    role: 'MANAGER',
    description: 'Comune di Roma',
    urlLogo: 'image',
    status: 'ACTIVE',
    institutionId: '3',
    digitalAddress: '',
    userRole: 'ADMIN',
  },
  {
    role: 'MANAGER',
    description: 'Comune di Napoli',
    urlLogo: 'image',
    status: 'ACTIVE',
    institutionId: '4',
    digitalAddress: '',
    userRole: 'ADMIN',
  },
];
test('Test rendering', () => {
  render(<PartySelection parties={parties} />);
  const input = screen.getByLabelText('Cerca');

  screen.getByText("Seleziona il tuo Ente");

  // search button  "Cerca"
  expect(input.tagName).toBe('INPUT');

  // search button  "Entra"
  const button = screen.getByRole('button', { name: 'Entra' });
  expect(button).toBeDisabled();

  const button2 = document.querySelectorAll("*[type='button']")[0];
  expect(button).toBe(button2);

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
  render(<PartySelection parties={parties} />);
  const input = screen.getByLabelText('Cerca');
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
  render(<PartySelection parties={parties} />);
  const input = screen.getByLabelText('Cerca');
  const filterPartyNapoli = 'Comune di Napoli Referente Amministrativo';
  // const filterPartyBari= 'Comune di Bari Referente Amministrativo';
  const filterNapoli = 'Napoli';
  const filterRoma = 'ROMA';

  // cerca bottone disabilitato
  const button = screen.getByRole('button', { name: 'Entra' });
  expect(button).toBeDisabled();

  // seleziona su uno dei party Napoli
  const buttonParty = screen.getByRole('button', { name: filterPartyNapoli });
  fireEvent.click(buttonParty);

  // verifichiamo che al click sia selezionato il pulsante "Napoli"
  expect(buttonParty.className.indexOf('Mui-selected') > -1).toBe(true);

  // verifica che bottone è abilitato
  expect(button).not.toBeDisabled();

  // scrivo Napoli nel filtro
  fireEvent.change(input, { target: { value: filterNapoli } });
  expect(input.getAttribute('value')).toBe(filterNapoli);
  // verifico che il tasto "Entra"è abilitato
  expect(button).not.toBeDisabled();
  // scrivi nella serach in maiuscolo Roma
  fireEvent.change(input, { target: { value: filterRoma } });
  expect(input.getAttribute('value')).toBe(filterRoma);
  // aspettati bottone disabilitato
  expect(button).toBeDisabled();
});

test('Test pending party', () => {
  render(<PartySelection parties={parties} />);
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
  expect(firstPartyDisabled.textContent).toBe('Comune di BariReferente Amministrativo');

  // cerca comune di bari e verifica che contenga "Da completare"
  const PartyItemContainer = screen.getByTestId('PartyItemContainer: Comune di Bari');
  getByText(PartyItemContainer, 'Da completare');
});
