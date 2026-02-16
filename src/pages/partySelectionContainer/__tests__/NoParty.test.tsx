import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import NoParty from '../NoParty';

test('should render NoParty', () => {
  renderWithProviders(<NoParty />);

  const rolesButton = screen.getByText('Più informazioni sui ruoli');
  expect(rolesButton).toBeInTheDocument();
  fireEvent.click(rolesButton);
});

test('go to login', () => {
  renderWithProviders(<NoParty />);

  const backHome = screen.getByText('Chiudi');
  expect(backHome).toBeInTheDocument();
  fireEvent.click(backHome);
});

test('go to add user flow', () => {
  renderWithProviders(<NoParty />);

  const addUserBtn = screen.getByText('Contatta l’Assistenza.');
  expect(addUserBtn).toBeInTheDocument();
  fireEvent.click(addUserBtn);
});
