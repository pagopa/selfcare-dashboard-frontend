import { render, screen, waitFor } from '@testing-library/react';
import './../../../../../locale';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import PartyCard from '../PartyCard';
import { Party } from '../../../../../model/Party';
import { mockedParties } from '../../../../../services/__mocks__/partyService';

const renderCard = (party: Party = mockedParties[5]) => {
  render(
    <Provider store={createStore()}>
      <PartyCard party={party} />
    </Provider>
  );
};

test('test render component', () => {
  console.log('render component');
  renderCard(mockedParties[2]);
  expect(document.getElementById('partyCard'));
});

test('test fields based on institution type', async () => {
  console.log('test fields based on institution type');
  renderCard();

  await waitFor(() => screen.getByText('Gestore di servizi pubblici'));

  if (mockedParties[2].fiscalCode === mockedParties[2].vatNumber) {
    await waitFor(() => screen.getByText('Codice Fiscale / P.IVA'));
  }

  if (mockedParties[2].fiscalCode !== mockedParties[2].vatNumber) {
    await waitFor(() => screen.getByText('Partita IVA'));
  }
});
