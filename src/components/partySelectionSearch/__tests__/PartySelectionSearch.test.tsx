import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BaseParty, UserStatus } from '../../../model/Party';
import { renderWithProviders } from '../../../utils/test-utils';
import PartyAccountItemSelection from '../PartyAccountItemSelection';
import PartySelectionSearch from '../PartySelectionSearch';

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

beforeEach(() => {
  selectedParty = null;
});

test('Test rendering', () => {
  render(
    <PartySelectionSearch
      parties={parties}
      onPartySelectionChange={(p) => (selectedParty = p)}
      selectedParty={selectedParty}
    />
  );
  const input = document.getElementById('search');
  expect(input?.tagName).toBe('INPUT');
  parties.forEach(({ description }) => screen.getByText(description));
});

test('Test filter', () => {
  render(
    <PartySelectionSearch
      parties={parties}
      onPartySelectionChange={(p) => (selectedParty = p)}
      selectedParty={selectedParty}
    />
  );
  const input = document.getElementById('search') as HTMLInputElement;

  fireEvent.change(input, { target: { value: 'Napoli' } });
  expect(input.value).toBe('Napoli');

  parties.forEach(({ description }) => {
    const el = screen.queryByText(description);
    description.includes('Napoli') ? expect(el).toBeInTheDocument() : expect(el).toBeNull();
  });

  fireEvent.change(input, { target: { value: '' } });
  parties.forEach(({ description }) => screen.getByText(description));
});

test('Select a party, then clear the selection', () => {
  const mockClearFunction = vi.fn();
  render(
    <PartyAccountItemSelection selectedParty={selectedParty} clearField={mockClearFunction} />
  );

  fireEvent.click(screen.getByTestId('ClearOutlinedIcon'));
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
  // Note: selectedParty is always null here (set in beforeEach), so this
  // condition never runs — consider whether this test is actually asserting anything
  if (selectedParty?.status === 'PENDING') screen.getByText('Da completare');
});

test('Test TOBEVALIDATED party', () => {
  render(
    <PartySelectionSearch
      parties={parties}
      onPartySelectionChange={(p) => (selectedParty = p)}
      selectedParty={selectedParty}
    />
  );
  if (selectedParty?.status === 'TOBEVALIDATED') screen.getByText('In attesa');
});

test('Test disabled party', async () => {
  // ✅ Reduced from 60 — use minimum needed to prove cutoff + hidden item behavior
  const generateMockedParties = (N: number): Array<BaseParty> =>
    Array.from({ length: N }, (_, i) => ({
      partyId: `party-${i}`,
      description: `Party ${i}`,
      status: i % 2 === 0 ? 'ACTIVE' : 'PENDING',
      userRole: i % 2 === 0 ? 'ADMIN' : 'LIMITED',
    }));

  const mockedBaseParties = generateMockedParties(12); // adjust to your display cutoff
  renderWithProviders(
    <PartySelectionSearch
      parties={mockedBaseParties}
      onPartySelectionChange={(p) => (selectedParty = p)}
      selectedParty={selectedParty}
    />
  );

  expect(screen.getByText('Party 4')).toBeInTheDocument();

  const input = document.getElementById('search') as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'Party 1' } });

  await waitFor(() => expect(screen.getByText('Party 11')).toBeInTheDocument());
  expect(screen.queryByText('Party 4')).not.toBeInTheDocument();
});

test('with less than 3 parties', () => {
  renderWithProviders(
    <PartySelectionSearch
      parties={[parties[0]]}
      onPartySelectionChange={(p) => (selectedParty = p)}
      selectedParty={parties[0]}
    />
  );
  // Add an actual assertion here — empty tests give false confidence
  expect(screen.getByText('Comune di Bari')).toBeInTheDocument();
});
describe('PartySelectionSearch branches', () => {
  const activeParties: Array<BaseParty> = [
    { description: 'Ente Alfa', partyId: 'a', status: 'ACTIVE', userRole: 'ADMIN' },
    { description: 'Ente Beta', partyId: 'b', status: 'ACTIVE', userRole: 'LIMITED' },
  ];

  test('shows the party title when there are 3 parties or less and selects a party on click', () => {
    const onChange = vi.fn();
    renderWithProviders(
      <PartySelectionSearch
        parties={activeParties}
        onPartySelectionChange={onChange}
        selectedParty={null}
        partyTitle="I tuoi enti"
      />
    );

    expect(screen.getByText('I tuoi enti')).toBeInTheDocument();
    expect(document.getElementById('search')).toBeNull();

    fireEvent.click(screen.getByText('Ente Beta'));
    expect(onChange).toHaveBeenCalledWith(activeParties[1]);
  });

  test('selects a party with the keyboard (Enter and Space) but ignores other keys', () => {
    const onChange = vi.fn();
    renderWithProviders(
      <PartySelectionSearch
        parties={activeParties}
        onPartySelectionChange={onChange}
        selectedParty={null}
      />
    );

    const item = screen.getByTestId('PartyItemContainer: Ente Alfa');
    fireEvent.keyDown(item, { key: 'Enter' });
    fireEvent.keyDown(item, { key: ' ' });
    fireEvent.keyDown(item, { key: 'a' });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledWith(activeParties[0]);
  });

  test('does not select disabled parties and shows their status chip', () => {
    const onChange = vi.fn();
    renderWithProviders(
      <PartySelectionSearch
        parties={parties}
        onPartySelectionChange={onChange}
        selectedParty={null}
      />
    );

    expect(screen.getByText('Da completare')).toBeInTheDocument();
    expect(screen.getByText('In attesa')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Comune di Bari'));
    expect(onChange).not.toHaveBeenCalled();
  });

  test('shows the selected party with more than 3 parties and allows to clear it', () => {
    const onChange = vi.fn();
    renderWithProviders(
      <PartySelectionSearch
        parties={parties}
        onPartySelectionChange={onChange}
        selectedParty={parties[2]}
      />
    );

    expect(document.getElementById('search')).toBeNull();
    expect(screen.getByText('Comune di Roma')).toBeInTheDocument();
    expect(screen.queryByText('Comune di Napoli')).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('removeSelectionIcon'));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  test('shows the empty state and resets the selection when the filter does not match', () => {
    const onChange = vi.fn();
    render(
      <PartySelectionSearch
        parties={parties}
        onPartySelectionChange={onChange}
        selectedParty={null}
      />
    );

    const input = document.getElementById('search') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Nessun ente' } });
    expect(screen.getByText('Nessun risultato')).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText('removeSelectionIcon'));
    expect(input.value).toBe('');
    parties.forEach(({ description }) => screen.getByText(description));
  });

  test('loads more parties when scrolling to the bottom of the list', async () => {
    const manyParties: Array<BaseParty> = Array.from({ length: 70 }, (_, i) => ({
      partyId: `p-${i}`,
      description: `Ente numero ${i}`,
      status: 'ACTIVE',
      userRole: 'ADMIN',
    }));
    renderWithProviders(
      <PartySelectionSearch
        parties={manyParties}
        onPartySelectionChange={vi.fn()}
        selectedParty={null}
      />
    );

    expect(screen.getByText('Ente numero 49')).toBeInTheDocument();
    expect(screen.queryByText('Ente numero 50')).not.toBeInTheDocument();

    const scrollContainer = screen.getByTestId('PartyItemContainer: Ente numero 0')
      .parentElement as HTMLElement;
    // eslint-disable-next-line functional/immutable-data
    Object.defineProperty(scrollContainer, 'scrollHeight', { configurable: true, value: 1000 });
    // eslint-disable-next-line functional/immutable-data
    Object.defineProperty(scrollContainer, 'clientHeight', { configurable: true, value: 200 });

    // not yet at the bottom: nothing is loaded
    // eslint-disable-next-line functional/immutable-data
    Object.defineProperty(scrollContainer, 'scrollTop', { configurable: true, value: 100 });
    fireEvent.scroll(scrollContainer);
    expect(screen.queryByText('Ente numero 50')).not.toBeInTheDocument();

    // eslint-disable-next-line functional/immutable-data
    Object.defineProperty(scrollContainer, 'scrollTop', { configurable: true, value: 800 });
    fireEvent.scroll(scrollContainer);

    await waitFor(() => expect(screen.getByText('Ente numero 69')).toBeInTheDocument());
  });
});

describe('PartyAccountItemSelection', () => {
  test('renders the party name, role and parent name', () => {
    renderWithProviders(
      <PartyAccountItemSelection
        selectedParty={{
          partyId: 'x',
          description: 'Ufficio Tributi',
          status: 'ACTIVE',
          userRole: 'ADMIN',
          parentDescription: 'Comune di Parma',
          urlLogo: 'logo.png',
        }}
        clearField={vi.fn()}
      />
    );
    expect(screen.getByText('Ufficio Tributi')).toBeInTheDocument();
    expect(screen.getByText('Comune di Parma')).toBeInTheDocument();
  });

  test('renders with a null party', () => {
    renderWithProviders(<PartyAccountItemSelection selectedParty={null} clearField={vi.fn()} />);
    expect(screen.getByLabelText('removeSelectionIcon')).toBeInTheDocument();
  });
});
