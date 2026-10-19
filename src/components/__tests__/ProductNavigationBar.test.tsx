import { fireEvent, screen } from '@testing-library/react';
import { mockedPartyProducts } from '../../services/__mocks__/productService';
import { renderWithProviders } from '../../utils/test-utils';
import ProductNavigationBar from '../ProductNavigationBar';

describe('ProductNavigationBar', () => {
  it('prepends the selected product title to the paths', () => {
    renderWithProviders(
      <ProductNavigationBar
        selectedProduct={mockedPartyProducts[0]}
        paths={[{ description: 'Utenti' }]}
      />
    );
    expect(screen.getByText(mockedPartyProducts[0].title)).toBeInTheDocument();
    expect(screen.getByText('Utenti')).toBeInTheDocument();
  });

  it('renders only the given paths without a selected product', () => {
    renderWithProviders(<ProductNavigationBar paths={[{ description: 'Gruppi' }]} />);
    expect(screen.getByText('Gruppi')).toBeInTheDocument();
    expect(screen.queryByText(mockedPartyProducts[0].title)).not.toBeInTheDocument();
  });

  it('renders the back component and calls goBack', () => {
    const goBack = vi.fn();
    renderWithProviders(
      <ProductNavigationBar showBackComponent goBack={goBack} backLabel="Torna indietro" />
    );
    fireEvent.click(screen.getByText('Torna indietro'));
    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
