import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ProductsRolesMap } from '../../model/ProductRole';
import { createStore } from '../../redux/store';
import withProductsRolesMap from '../withProductsRolesMap';

const { mockedRetriever } = vi.hoisted(() => ({ mockedRetriever: vi.fn() }));

vi.mock('../../hooks/useProductsRolesMap', () => ({
  useProductsRolesMap: () => mockedRetriever,
}));

const rolesMap = { 'prod-io': { list: [] } } as unknown as ProductsRolesMap;

test('injects the productsRolesMap retrieved through useProductsRolesMap', async () => {
  mockedRetriever.mockResolvedValue(rolesMap);
  const Component = ({ productsRolesMap }: { productsRolesMap: ProductsRolesMap }) => (
    <>RENDERED {Object.keys(productsRolesMap).join(',')}</>
  );
  const DecoratedComponent = withProductsRolesMap(Component);

  render(
    <Provider store={createStore()}>
      <DecoratedComponent />
    </Provider>
  );

  await waitFor(() => expect(screen.getByText('RENDERED prod-io')).toBeInTheDocument());
  expect(mockedRetriever).toHaveBeenCalledTimes(1);
});
