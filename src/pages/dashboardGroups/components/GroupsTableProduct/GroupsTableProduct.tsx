import { useHistory } from 'react-router-dom';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { Party } from '../../../../model/Party';
import { Product } from '../../../../model/Product';
import { PartyGroup, PartyGroupStatus } from '../../../../model/PartyGroup';
import GroupsProductTable from './components/GroupsProductTable';

type Props = {
  party: Party;
  product: Product;
  groups: Array<PartyGroup>;
  sort?: string;
  onSortRequest: (sort: string) => void;
  onDelete: (partyGroup: PartyGroup) => void;
  onStatusUpdate: (partyGroup: PartyGroup, nextStatus: PartyGroupStatus) => void;
};

const GroupsTableProduct = ({
  party,
  product,
  groups,
  onDelete,
  onStatusUpdate,
  sort,
  onSortRequest,
}: Props) => {
  const history = useHistory();

  const canEdit = product.userRole === 'ADMIN' && product.status === 'ACTIVE';

  return (
    <GroupsProductTable
      party={party}
      product={product}
      groups={groups}
      canEdit={canEdit}
      onRowClick={(partyGroup) =>
        history.push(
          resolvePathVariables('' /* TODO use Group details url */, { groupId: partyGroup.id })
        )
      }
      sort={sort}
      onSortRequest={onSortRequest}
      onDelete={onDelete}
      onStatusUpdate={onStatusUpdate}
    />
  );
};

export default GroupsTableProduct;
