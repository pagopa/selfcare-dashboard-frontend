import { fireEvent, screen } from '@testing-library/react';
import { Product } from '../../../../../../model/Product';
import { mockedPartyProducts } from '../../../../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../../../../utils/test-utils';
import NotActiveProductCard from '../NotActiveProductCard';

const prodIo = mockedPartyProducts.find((p) => p.id === 'prod-io') as Product;
const premium = prodIo.subProducts![0];

const renderCard = (props: Partial<React.ComponentProps<typeof NotActiveProductCard>> = {}) =>
  renderWithProviders(
    <NotActiveProductCard
      image="http://image"
      urlLogo="http://logo"
      title="Prodotto"
      description="Descrizione"
      disableBtn={false}
      buttonLabel="Aderisci"
      product={prodIo}
      {...props}
    />
  );

describe('NotActiveProductCard', () => {
  test('renders product info and triggers the action', () => {
    const btnAction = vi.fn();
    renderCard({ btnAction, urlPublic: 'http://public' });

    expect(screen.getByText('Prodotto')).toBeInTheDocument();
    expect(screen.getByText('Descrizione')).toBeInTheDocument();
    expect(screen.getByAltText('Rappresentazione di IO')).toHaveAttribute('src', 'http://image');
    expect(screen.getByText('Scopri di più')).toHaveAttribute('href', 'http://public');

    fireEvent.click(screen.getByRole('button', { name: 'Aderisci' }));
    expect(btnAction).toHaveBeenCalledTimes(1);
  });

  test('renders IO premium title with bold base name and disabled button', () => {
    renderCard({ title: 'IO Premium', disableBtn: true });

    expect(screen.getByText('IO').tagName).toBe('STRONG');
    expect(screen.getByText(/Premium/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aderisci' })).toBeDisabled();
    expect(screen.queryByText('Scopri di più')).not.toBeInTheDocument();
  });

  test('renders the inactive sub product title next to the product title', async () => {
    renderCard({
      prodActiveWithSubProdInactive: { ...premium, title: 'Sottoprodotto con nome molto lungo' },
    });

    expect(screen.getByText('IO')).toBeInTheDocument();
    const subTitle = screen.getByText(/Sottoprodotto con nome molto lungo/);
    fireEvent.mouseOver(subTitle);
    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'Prodotto Sottoprodotto con nome molto lungo'
    );
  });

  test('shows tooltips for long title and description', async () => {
    const longTitle = 'Titolo del prodotto molto lungo';
    const longDescription = 'Descrizione del prodotto molto lunga e dettagliata';
    renderCard({ title: longTitle, description: longDescription });

    fireEvent.mouseOver(screen.getByText(longDescription));
    expect(await screen.findByRole('tooltip')).toHaveTextContent(longDescription);
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });
});
