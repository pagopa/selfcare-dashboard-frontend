import { fireEvent, screen } from '@testing-library/react';
import { mockedParties } from '../../../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../../../services/__mocks__/productService';
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
  authorizedInteropProducts: ['prod-interop', 'prod-interop-atst', 'prod-interop-coll'],
  t: (key: string) => key,
  products: mockedPartyProducts,
  party: mockedParties[2],
};

describe('SessionModalInteropProduct', () => {
  test('render the modal correctly when open', () => {
    renderWithProviders(<SessionModalInteropProduct {...defaultProps} showCloseIcon={true} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
    const cancelBtn = screen.getByText('Annulla');
    expect(cancelBtn).toBeInTheDocument();
    fireEvent.click(cancelBtn);
  });

  test('can enter in "collaudo" enviroment', () => {
    renderWithProviders(<SessionModalInteropProduct {...defaultProps} />);
    const collaudoRadio = screen.getByText('Ambiente di Collaudo');

    fireEvent.click(collaudoRadio);

    const confirmBtn = screen.getByText('Riprova');

    expect(confirmBtn).toBeEnabled();

    fireEvent.click(confirmBtn);
  });

  test('can enter in "attestazione" enviroment', () => {
    renderWithProviders(<SessionModalInteropProduct {...defaultProps} />);
    const attestazioneRadio = screen.getByText('Ambiente di Attestazione');

    fireEvent.click(attestazioneRadio);

    const confirmBtn = screen.getByText('Riprova');

    fireEvent.click(confirmBtn);
  });

  test('can enter in production enviroment', () => {
    renderWithProviders(<SessionModalInteropProduct {...defaultProps} onConfirmLabel="Entra" />);
    const produzioneRadio = screen.getByText('Ambiente di Produzione');

    fireEvent.click(produzioneRadio);

    const confirmBtn = screen.getByText('Entra');

    fireEvent.click(confirmBtn);
  });

  test('render the modal with only required props', () => {
    renderWithProviders(
      <SessionModalInteropProduct
        title={''}
        open={true}
        message={undefined}
        onConfirm={mockOnConfirm}
        handleClose={mockHandleClose}
      />
    );
  });
});
