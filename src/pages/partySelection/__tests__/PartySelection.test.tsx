import { fireEvent, render, screen } from '@testing-library/react';
import PartySelection from '../PartySelection';

const parties = ['Comune di Bari', 'Comune di Milano', 'Comune di Roma', 'Comune di Napoli'];
// const input = screen.getByLabelText('Cerca');
// const filterNapoli = 'Napoli';
// const filterRoma = 'ROMA';
// const filterParty = 'Comune di Napoli Manager';

test('Test rendering', () => {
  render(<PartySelection />);
  const input = screen.getByLabelText('Cerca');

  screen.getByText("Seleziona l'Ente per cui accedi");

  // search button  "Cerca"
  expect(input.tagName).toBe('INPUT');

  // search button  "Entra"
  const button = screen.getByRole('button', { name: 'Entra' });
  expect(button).toBeDisabled();

  const button2 = document.querySelectorAll("*[type='button']")[0];
  expect(button).toBe(button2);

  parties.forEach((element) => {
    screen.getByText(element);
  });
});

test('Test filter', () => {
  render(<PartySelection />);
  const input = screen.getByLabelText('Cerca');
  const filterNapoli = 'Napoli';

  // modify input field
  fireEvent.change(input, { target: { value: filterNapoli } });
  expect(input.getAttribute('value')).toBe(filterNapoli);

  parties.forEach((element) => {
    const party = screen.queryByText(element);

    if (element.indexOf(filterNapoli) > -1) {
      expect(party).not.toBeNull();
    } else {
      expect(party).toBeNull();
    }
  });

  fireEvent.change(input, { target: { value: null } });
  expect(input.getAttribute('value')).toBe("");

  parties.forEach((element) => {
    screen.getByText(element);
  });


});

test('Test selection', () => {
  render(<PartySelection />);
  const input = screen.getByLabelText('Cerca');
  const filterPartyNapoli= 'Comune di Napoli Manager';
  // const filterPartyBari= 'Comune di Bari Manager';
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
  render(<PartySelection />);

 // verifica che esista almeno un bottone disabilitato che ha etichetta 'da completare'
  const firstPartyDisabled =document.evaluate('//div[@role="PartyItemContainer" and .//text()="Da completare"]//*[contains(@class,"Mui-disabled")]',document,null,XPathResult.ANY_TYPE).iterateNext()
  expect(firstPartyDisabled).not.toBeNull();
  expect(firstPartyDisabled.textContent).toBe(' Comune di Bari  Manager ')
});