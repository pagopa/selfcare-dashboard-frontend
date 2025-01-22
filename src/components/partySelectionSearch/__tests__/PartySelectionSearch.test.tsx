import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import { fireEvent, getByText, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BaseParty, UserStatus } from '../../../model/Party';
import { renderWithProviders } from '../../../utils/test-utils';
import PartyAccountItemSelection from '../PartyAccountItemSelection';
import PartySelectionSearch from '../PartySelectionSearch';
import './../../../locale';

beforeAll(() => {
  i18n.changeLanguage('it');
});

let selectedParty: BaseParty | null = null;

const parties: Array<BaseParty> = [
  {
    description: 'Comune di Bari',
    partyId: 'partyId1',
    status: 'PENDING' as UserStatus,
    userRole: 'ADMIN',
    urlLogo: 'urlLogo1',
  },
  {
    description: 'Comune di Milano',
    partyId: 'partyId2',
    status: 'TOBEVALIDATED' as UserStatus,
    userRole: 'ADMIN',
    urlLogo: 'urlLogo2',
  },
  {
    description: 'Comune di Roma',
    partyId: 'partyId3',
    status: 'ACTIVE' as UserStatus,
    userRole: 'ADMIN',
    urlLogo: 'urlLogo3',
  },
  {
    description: 'Comune di Napoli',
    partyId: 'partyId4',
    status: 'ACTIVE' as UserStatus,
    userRole: 'ADMIN',
    urlLogo: 'urlLogo4',
  },
];

beforeEach(() => (selectedParty = null));

test('Test rendering', () => {
  render(
    <PartySelectionSearch
      parties={parties}
      onPartySelectionChange={(p) => (selectedParty = p)}
      selectedParty={selectedParty}
    />
  );
  const input = document.getElementById('search');

  // Search button "Cerca"
  expect(input?.tagName).toBe('INPUT');

  parties
    .map((x) => x.description)
    .forEach((element) => {
      screen.getByText(element);
    });

  // The search is present only if the loggedUser has more than three entities
  if (parties.length > 3) {
    expect(input?.tagName).toBe('INPUT');
  } else {
    expect(input?.tagName).not.toBe('INPUT');
  }
});

test('Test filter', () => {
  render(
    <PartySelectionSearch
      parties={parties}
      onPartySelectionChange={(p) => (selectedParty = p)}
      selectedParty={selectedParty}
    />
  );
  const input = document.getElementById('search');
  const filterNapoli = 'Napoli';

  // Modify input field
  if (input) {
    fireEvent.change(input, { target: { value: filterNapoli } });
    expect(input?.getAttribute('value')).toBe(filterNapoli);
  }

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
  if (input) {
    fireEvent.change(input, { target: { value: null } });
    expect(input.getAttribute('value')).toBe('');
  }

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
      selectedParty={selectedParty}
    />
  );
  const filterPartyNapoli = 'Comune di Napoli Comune di Napoli Amministratore';

  expect(selectedParty).toBe(null);
  // select the party "Napoli"
  const buttonParty = screen.getByRole('button', { name: filterPartyNapoli });

  fireEvent.click(buttonParty);

  // let's check if it is selected
  const selectedLessThen3 = document.getElementById('selectedLessThen3');
  if (selectedLessThen3) getByText(selectedLessThen3, 'Comune di Milano');
});

test('Test selection when there are > 3 parties', async () => {
  render(
    <PartySelectionSearch
      parties={parties}
      onPartySelectionChange={(p) => (selectedParty = p)}
      selectedParty={selectedParty}
    />
  );
  const filterPartyBari = 'Comune di Bari Comune di Bari Amministratore Da completare';
  expect(selectedParty).toBe(null);
  // seleziona su uno dei party Napoli
  const buttonParty = screen.getByRole('button', { name: filterPartyBari });

  fireEvent.click(buttonParty);

  // verifichiamo che al click sia selezionato il pulsante "Napoli"
  const selectedMoreThen3 = document.getElementsByClassName('selectedMoreThen3')[0] as HTMLElement;
  if (selectedMoreThen3) getByText(selectedMoreThen3, 'Comune di Bari');
});

test('Select a party, then clear the selection', async () => {
  const mockClearFunction = jest.fn();
  render(<PartyAccountItemSelection selectedParty={selectedParty} clearField={mockClearFunction} />);

  const clearSelection = screen.getByTestId('ClearOutlinedIcon');
  fireEvent.click(clearSelection);
  expect(mockClearFunction).toHaveBeenCalledTimes(1);

  expect(selectedParty).toBe(null);
});

test('Test pending party', () => {
  render(
    <PartySelectionSearch
      parties={parties}
      onPartySelectionChange={(p) => (selectedParty = p)}
      selectedParty={selectedParty}
    />
  );
  if (selectedParty?.status === 'PENDING') {
    screen.getByText('Da completare');
  }
});

test('Test TOBEVALIDATED party', () => {
  render(
    <PartySelectionSearch
      parties={parties}
      onPartySelectionChange={(p) => (selectedParty = p)}
      selectedParty={selectedParty}
    />
  );
  if (selectedParty?.status === 'TOBEVALIDATED') {
    screen.getByText('In attesa');
  }
});

test('Test disabled party', async () => {
  const generateMockedParties = (N: number): Array<BaseParty> =>
    Array.from({ length: N }, (_, index) => {
      const partyId = `party-${index}`;
      return {
        partyId,
        description: `Party ${index}`,
        status: index % 2 === 0 ? 'ACTIVE' : 'PENDING',
        userRole: index % 2 === 0 ? 'ADMIN' : 'LIMITED',
      };
    });

  const mockedBaseParties = generateMockedParties(60);
  renderWithProviders(
    <PartySelectionSearch
      parties={mockedBaseParties}
      onPartySelectionChange={(p) => (selectedParty = p)}
      selectedParty={selectedParty}
    />
  );

  const party40 = screen.getByText('Party 40');
  expect(party40).toBeInTheDocument();

  const party52 = screen.queryByText('Party 52');
  expect(party52).not.toBeInTheDocument();

  const input = document.getElementById('search') as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'Party 5' } });
  expect(input.getAttribute('value')).toBe('Party 5');

  expect(party40).not.toBeInTheDocument();

  await waitFor(() => expect(screen.getByText('Party 52')).toBeInTheDocument());
});

test('with less than 3 parties', async () => {
  renderWithProviders(
    <PartySelectionSearch
      parties={[parties[0]]}
      onPartySelectionChange={(p) => (selectedParty = p)}
      selectedParty={parties[0]}
    />
  );

});
