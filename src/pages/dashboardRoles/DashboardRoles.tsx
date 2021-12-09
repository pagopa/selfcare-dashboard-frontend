import Roles from '../dashboard/components/roles/Roles';
import { Product } from '../../model/Product';
type Props = {
  products: Array<Product>;
};
export default ({ products }: Props) => <Roles products={products} />;
{
  /* <>RUOLI</>; */
}
