import { Party } from '../../model/Party';
import { Product } from '../../model/Product';

type Props = {
  isPtSectionVisible?: boolean;
  party: Party;
  ptProducts: Array<Product>;
};

export default function DashboardTechnologyPArtnerPage({
  isPtSectionVisible,
  party,
  ptProducts,
}: Props) {
  console.log('pt properties', isPtSectionVisible, party, ptProducts);
  return <div>PT PAGE</div>;
}
