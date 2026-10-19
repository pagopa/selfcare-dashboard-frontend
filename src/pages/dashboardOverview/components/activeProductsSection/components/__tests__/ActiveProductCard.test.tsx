import { fireEvent, screen } from '@testing-library/react';
import { ProductOnBoardingStatusEnum } from '../../../../../../api/generated/b4f-dashboard/OnboardedProductResource';
import { OnboardedProduct, Party } from '../../../../../../model/Party';
import { Product } from '../../../../../../model/Product';
import { mockedParties } from '../../../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../../../../utils/test-utils';
import ActiveProductCard from '../ActiveProductCard';

const prodIo = mockedPartyProducts.find((p) => p.id === 'prod-io') as Product;
const prodPn = mockedPartyProducts.find((p) => p.id === 'prod-pn') as Product;
const premium = prodIo.subProducts![0];

const buildParty = (products: Array<Partial<OnboardedProduct>>): Party => ({
  ...mockedParties[0],
  products: products as Array<OnboardedProduct>,
});

const renderCard = (
  props: Partial<React.ComponentProps<typeof ActiveProductCard>> & {
    product: Product;
    party: Party;
  }
) =>
  renderWithProviders(
    <ActiveProductCard
      cardTitle="Titolo"
      buttonLabel="Gestisci"
      disableBtn={false}
      urlLogo="http://logo"
      {...props}
    />
  );

describe('ActiveProductCard', () => {
  test('renders an enabled card and triggers the action', () => {
    const btnAction = vi.fn();
    renderCard({
      product: prodPn,
      party: buildParty([
        { productId: 'prod-pn', productOnBoardingStatus: ProductOnBoardingStatusEnum.ACTIVE },
      ]),
      cardTitle: 'SEND',
      btnAction,
    });

    expect(screen.getByText('SEND')).toBeInTheDocument();
    expect(screen.getByAltText(`${prodPn.title} logo`)).toHaveAttribute('src', 'http://logo');
    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Non hai un ruolo per gestire questo prodotto')
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: `Accedi alla piattaforma del prodotto ${prodPn.title}` })
    );
    expect(btnAction).toHaveBeenCalledTimes(1);
  });

  test('renders a disabled card without action button', () => {
    renderCard({ product: prodPn, party: buildParty([]), disableBtn: true });

    expect(screen.getByText('Non hai un ruolo per gestire questo prodotto')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('renders the premium logo and label when IO premium is active', () => {
    renderCard({
      product: prodIo,
      party: buildParty([
        { productId: 'prod-io', productOnBoardingStatus: ProductOnBoardingStatusEnum.ACTIVE },
        {
          productId: 'prod-io-premium',
          productOnBoardingStatus: ProductOnBoardingStatusEnum.ACTIVE,
        },
      ]),
      cardTitle: 'IO',
    });

    expect(screen.getByAltText(`${prodIo.title} logo`)).toHaveAttribute('src', premium.logo);
    expect(screen.getByText(/Premium/)).toBeInTheDocument();
  });

  test('uses the product logo when IO premium is not active', () => {
    renderCard({
      product: prodIo,
      party: buildParty([
        {
          productId: 'prod-io-premium',
          productOnBoardingStatus: ProductOnBoardingStatusEnum.PENDING,
        },
      ]),
    });

    expect(screen.getByAltText(`${prodIo.title} logo`)).toHaveAttribute('src', 'http://logo');
    expect(screen.queryByText(/Premium/)).not.toBeInTheDocument();
  });

  test('handles products without sub products and an empty title', () => {
    renderCard({
      product: { ...prodPn, subProducts: undefined },
      party: buildParty([]),
      cardTitle: '',
    });

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  test('shows a tooltip for long titles', async () => {
    const longTitle = 'Titolo molto lungo del prodotto';
    renderCard({ product: prodPn, party: buildParty([]), cardTitle: longTitle });

    fireEvent.mouseOver(screen.getByText(longTitle));
    expect(await screen.findByRole('tooltip')).toHaveTextContent(longTitle);
  });
});
