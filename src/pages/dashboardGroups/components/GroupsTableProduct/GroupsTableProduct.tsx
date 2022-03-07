import { useHistory } from 'react-router-dom';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { Party } from '../../../../model/Party';
import { Product } from '../../../../model/Product';
import { PartyGroup, PartyGroupStatus } from '../../../../model/PartyGroup';
import { DASHBOARD_ROUTES } from '../../../../routes';
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

  const canEdit = product.userRole === 'ADMIN';

  return (
    <GroupsProductTable
      party={party}
      product={product}
      groups={groups}
      canEdit={canEdit}
      onRowClick={(partyGroup) =>
        history.push(
          resolvePathVariables(DASHBOARD_ROUTES.PARTY_GROUPS.subRoutes.PARTY_GROUP_DETAIL.path, {
            groupId: partyGroup.id,
            institutionId: partyGroup.institutionId,
          })
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
