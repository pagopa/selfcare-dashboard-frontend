import { useHistory } from 'react-router-dom';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { useEffect, useState } from 'react';
import { PageRequest } from '@pagopa/selfcare-common-frontend/model/PageRequest';
import { PageResource } from '@pagopa/selfcare-common-frontend/model/PageResource';
import { handleErrors } from '@pagopa/selfcare-common-frontend/services/errorService';
import { fetchPartyGroups } from '../../../../services/groupsService';
import { PartyGroup, PartyGroupStatus } from '../../../../model/PartyGroup';
import { Product } from '../../../../model/Product';
import { Party } from '../../../../model/Party';
import { DASHBOARD_ROUTES } from '../../../../routes';
import GroupsProductTable from './components/GroupsProductTable';
import GroupsProductFetchError from './components/GroupsProductFetchError';

type Props = {
  party: Party;
  product: Product;
  currentUser: User;
  incrementalLoad: boolean;
  initialPageSize: number;
  onFetchStatusUpdate: (isFetching: boolean, count?: number) => void;
  onCompleteDelete: (product: Product) => void;
};

const GroupsTableProduct = ({
  party,
  product,
  currentUser,
  incrementalLoad,
  initialPageSize,
  onFetchStatusUpdate,
  onCompleteDelete,
}: Props) => {
  const history = useHistory();

  const [groups, setGroups] = useState<PageResource<PartyGroup>>({
    content: [],
    page: { number: 0, size: 0, totalElements: 0, totalPages: 0 },
  });
  const [noMoreData, setNoMoreData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pageRequest, setPageRequest] = useState<PageRequest>({ page: 0, size: initialPageSize });

  useEffect(() => {
    setPageRequest({
      page: 0,
      size: initialPageSize,
    });
  }, [product]);

  const fetchGroups = () => {
    setLoading(true);
    fetchPartyGroups(party, product, currentUser, pageRequest)
      .then((r) => {
        const nextGroups =
          pageRequest?.page === 0 || !incrementalLoad
            ? r
            : { content: groups.content.concat(r.content), page: r.page };
        setGroups(nextGroups);
        setNoMoreData(r.content.length < pageRequest.size);
        onFetchStatusUpdate(false, nextGroups.content.length);
      })
      .catch((reason) => {
        handleErrors([
          {
            id: `FETCH_PARTY_GROUPS_${product.id}_ERROR`,
            blocking: false,
            error: reason,
            techDescription: `An error occurred while fetching party groups ${party.institutionId} of product ${product.id}`,
            toNotify: true,
          },
        ]);
        setError(true);
        setGroups({ content: [], page: { number: 0, size: 0, totalElements: 0, totalPages: 0 } });
        onFetchStatusUpdate(false, 1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (pageRequest) {
      fetchGroups();
    }
  }, [pageRequest]);

  const onDelete = (partyGroup: PartyGroup) => {
    if (incrementalLoad) {
      setGroups({ ...groups, content: groups.content.filter((u) => u.id !== partyGroup.id) });
    } else {
      setPageRequest({ ...pageRequest });
    }
    if (groups.content.length === 1 && noMoreData) {
      onCompleteDelete(product);
    }
  };

  const onStatusUpdate = (partyGroup: PartyGroup, nextStatus: PartyGroupStatus) => {
    // eslint-disable-next-line functional/immutable-data
    partyGroup.status = nextStatus;
    setGroups({ ...groups });
  };

  const canEdit = product.userRole === 'ADMIN';

  if (error) {
    return <GroupsProductFetchError onRetry={fetchGroups} />;
  } else {
    return !loading && groups.content.length === 0 ? (
      <></>
    ) : (
      <GroupsProductTable
        loading={loading}
        incrementalLoad={incrementalLoad}
        noMoreData={noMoreData}
        party={party}
        product={product}
        groups={groups.content}
        canEdit={canEdit}
        onRowClick={(partyGroup) =>
          history.push(
            resolvePathVariables(DASHBOARD_ROUTES.PARTY_GROUPS.subRoutes.PARTY_GROUP_DETAIL.path, {
              groupId: partyGroup.id,
            })
          )
        }
        page={groups.page}
        sort={pageRequest.sort}
        fetchPage={(page, size) =>
          setPageRequest({
            page: incrementalLoad ? pageRequest.page + 1 : page ?? 0,
            size: incrementalLoad ? pageRequest.size : size ?? pageRequest.size,
            sort: pageRequest.sort,
          })
        }
        onSortRequest={(sort) =>
          setPageRequest({
            page: incrementalLoad ? 0 : pageRequest.page,
            size: pageRequest.size,
            sort,
          })
        }
        onDelete={onDelete}
        onStatusUpdate={onStatusUpdate}
      />
    );
  }
};

export default GroupsTableProduct;
