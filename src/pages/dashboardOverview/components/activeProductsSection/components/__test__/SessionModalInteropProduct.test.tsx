import '@testing-library/jest-dom/extend-expect';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../../../utils/test-utils';
import SessionModalInteropProduct from '../SessionModalInteropProduct';

const mockHandleClose = jest.fn();
const mockOnConfirm = jest.fn();

const defaultProps = {
  open: true,
  title: 'Test Title',
  message: 'Test Message',
  onConfirm: mockOnConfirm,
  handleClose: mockHandleClose,
  authorizedProdInterop: true,
  authorizedProdAtst: true,
  authorizedProdColl: true,
  t: (key: string) => key,
};

describe('SessionModalInteropProduct', () => {
  test('render the modal correctly when open', () => {
    renderWithProviders(<SessionModalInteropProduct {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
    expect(screen.getByText('Annulla')).toBeInTheDocument();
  });

  test('changes the selected environment when radio buttons are clicked', () => {
    renderWithProviders(<SessionModalInteropProduct {...defaultProps} />);
    const attestazioneRadio = screen.getByText('Ambiente di Attestazione');
    const collaudoRadio = screen.getByText('Ambiente di Collaudo');
    const produzioneRadio = screen.getByText('Ambiente di Produzione');

    fireEvent.click(attestazioneRadio);

    fireEvent.click(collaudoRadio);

    fireEvent.click(produzioneRadio);
  });
});
