import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { mockedBaseParties } from '../../../services/__mocks__/partyService';
import { renderWithProviders } from '../../../utils/test-utils';
import NoActiveParty from '../NoActiveParty';
test('should render with no parties in status active', () => {
  renderWithProviders(
    <NoActiveParty parties={mockedBaseParties.filter((p) => p.status === 'TOBEVALIDATED')} />
  );
});

test('should render with parties', () => {
  renderWithProviders(
    <NoActiveParty parties={mockedBaseParties.filter((p) => p.status === 'PENDING')} />
  );

  const closeButton = screen.getByText('Close');
  expect(closeButton).toBeInTheDocument();
  fireEvent.click(closeButton);
});

test('should render with status active', () => {
  renderWithProviders(
    <NoActiveParty parties={mockedBaseParties.filter((p) => p.status === 'ACTIVE')} />
  );
});
