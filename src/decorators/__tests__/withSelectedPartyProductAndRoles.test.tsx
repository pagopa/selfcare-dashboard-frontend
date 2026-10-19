import { render, screen, waitFor } from '@testing-library/react';
import { Product } from '../../model/Product';
import { buildEmptyProductRolesLists } from '../../model/ProductRole';
import { mockedParties } from '../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../services/__mocks__/productService';
import withSelectedPartyProductAndRoles, {
  withSelectedPartyProductAndRolesProps,
} from '../withSelectedPartyProductAndRoles';

const Component = ({
  productRolesList,
  selectedProduct,
}: withSelectedPartyProductAndRolesProps) => (
  <>
    ROLES {selectedProduct.id} {productRolesList.list.length}
  </>
);
const DecoratedComponent = withSelectedPartyProductAndRoles(Component);

const baseProps = {
  party: mockedParties[0],
  products: mockedPartyProducts,
  productsMap: {},
  activeProducts: mockedPartyProducts,
};

describe('withSelectedPartyProductAndRoles', () => {
  test('sets displayName', () => {
    expect(DecoratedComponent.displayName).toBe('withSelectedPartyProductAndRoles(Component)');
  });

  test('fetches the roles of the selected product and injects them', async () => {
    const fetchSelectedProductRoles = vi.fn().mockResolvedValue(buildEmptyProductRolesLists());

    render(
      <DecoratedComponent
        {...baseProps}
        selectedProduct={mockedPartyProducts[0]}
        fetchSelectedProductRoles={fetchSelectedProductRoles}
      />
    );

    await waitFor(() =>
      expect(screen.getByText(`ROLES ${mockedPartyProducts[0].id} 0`)).toBeInTheDocument()
    );
    expect(fetchSelectedProductRoles).toHaveBeenCalledTimes(1);
    expect(typeof fetchSelectedProductRoles.mock.calls[0][0]).toBe('function');
  });

  test('renders nothing and does not fetch without a selected product', () => {
    const fetchSelectedProductRoles = vi.fn();

    const { container } = render(
      <DecoratedComponent
        {...baseProps}
        selectedProduct={undefined as unknown as Product}
        fetchSelectedProductRoles={fetchSelectedProductRoles}
      />
    );

    expect(container).toBeEmptyDOMElement();
    expect(fetchSelectedProductRoles).not.toHaveBeenCalled();
  });
});
