import { fireEvent, render, screen } from '@testing-library/react';
import PartySelection from './../PartySelection';

const parties = ['Comune di Bari', 'Comune di Milano', 'Comune di Roma', 'Comune di Napoli'];

test('Test rendering', () => {
  render(<PartySelection />);
  screen.getByText("Seleziona l'Ente per cui accedi");

  const input = screen.getByLabelText('Cerca');
  expect(input.tagName).toBe('INPUT');

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
  const filter = 'Napoli';

  fireEvent.change(input, { target: { value: filter } });
  expect(input.getAttribute('value')).toBe(filter);

  parties.forEach((element) => {
    const party = screen.queryByText(element);

    if (element.indexOf(filter) > -1) {
        expect(party).not.toBeNull();
    } else {
        expect(party).toBeNull();
    }
  });
});

test('Test selection', () => {
    render(<PartySelection />);
// cerca bottone disabilitato
// seleziona su uno dei party Napoli
// nice to have: verifica stile party selezionato (testo party napoli ha lo stile del bordo - attributo style dell'elemento)
// verifica che bottone è abilitato (not.Disabled)
// scrivo Napoli nel filtro
// verifico che il tasto è abilitato
// scrivi nella serach in maiuscolo Roma
// aspettati bottone disabilitato 



});