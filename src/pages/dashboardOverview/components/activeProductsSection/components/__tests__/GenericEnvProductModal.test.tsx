import { render, screen, fireEvent } from '@testing-library/react';
import GenericEnvProductModal from '../GenericEnvProductModal'; // Adjust the import as needed
import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';

beforeAll(() => {
  i18n.changeLanguage('it');
});

const mockProps = {
  open: true,
  title: 'Test Title',
  message: 'Test Message',
  handleClose: vi.fn(),
  t: (key: string) => key,
  productEnvironments: [
    { environment: 'Collaudo', url: 'http://example.com/collaudo' },
    { environment: 'Locale', url: 'http://example.com/locale' },
  ],
};

test('renders and selects environment radio buttons correctly', () => {
  render(<GenericEnvProductModal {...mockProps} />);

  const collaudoRadio = screen.getByLabelText(/Ambiente di Collaudo/i);
  const localeRadio = screen.getByLabelText(/Ambiente Locale/i);

  expect(collaudoRadio).toBeInTheDocument();
  expect(localeRadio).toBeInTheDocument();

  // Simulate selection
  fireEvent.click(collaudoRadio);
  expect(collaudoRadio).toBeChecked();
  expect(localeRadio).not.toBeChecked();

  fireEvent.click(localeRadio);
  expect(localeRadio).toBeChecked();
  expect(collaudoRadio).not.toBeChecked();
});

test('enviroment collaudo', () => {
  const handleClose = vi.fn();
  const handleConfirm = vi.fn();

  const mockProps = {
    open: true,
    title: 'Test Title',
    message: 'Test Message',
    handleClose,
    onConfirm: handleConfirm,
    onConfirmLabel: 'Entra',
    productEnvironments: [{ environment: 'Collaudo', url: 'http://example.com/collaudo' }],
    t: (key: string) => key,
  };

  render(<GenericEnvProductModal {...mockProps} />);

  const closeButton = screen.getByRole('button', { name: /Annulla/i });
  fireEvent.click(closeButton);
  expect(handleClose).toHaveBeenCalled();
});

test('enviroment attestazione', () => {
  const handleClose = vi.fn();
  const handleConfirm = vi.fn();

  const mockProps = {
    open: true,
    title: 'Test Title',
    message: 'Test Message',
    handleClose,
    onConfirm: handleConfirm,
    onConfirmLabel: 'Entra',
    productEnvironments: [{ environment: 'Attestazione', url: 'http://example.com/attestazione' }],
    t: (key: string) => key,
  };

  render(<GenericEnvProductModal {...mockProps} />);

  const confirmButton = screen.getByRole('button', { name: /Entra/i });
  fireEvent.click(confirmButton);
});
