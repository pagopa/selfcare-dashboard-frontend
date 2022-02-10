import { PageRequest } from '@pagopa/selfcare-common-frontend/model/PageRequest';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { handleErrors } from '@pagopa/selfcare-common-frontend/services/errorService';
import { userSelectors } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import { useEffect, useState } from 'react';
import { Party } from '../../../../model/Party';
import { PartyUser } from '../../../../model/PartyUser';
import { Product } from '../../../../model/Product';
import { useAppSelector } from '../../../../redux/hooks';
import { fetchPartyUsers } from '../../../../services/usersService';
import { ENV } from '../../../../utils/env';
import { UsersTableFilterConfig } from '../UsersTableActions/UsersTableActions';
import useFakePagination from '../../../../hooks/useFakePagination';
import UsersProductTable from './components/UsersProductTable';
import UserProductFetchError from './components/UserProductFetchError';

type Props = {
  party: Party;
  product: Product;
  onFetchStatusUpdate: (isFetching: boolean, count?: number) => void;
  onRowClick: (user: PartyUser) => void;
  filterConfiguration: UsersTableFilterConfig;
};

const UsersTableProduct = ({ party, product, onFetchStatusUpdate, filterConfiguration }: Props) => {
  const currentUser = useAppSelector(userSelectors.selectLoggedUser);

  const [users, setUsers] = useState<Array<PartyUser>>();
  const [noMoreData, setNoMoreData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pageRequest, setPageRequest] = useState<{ page: PageRequest; filterChanged: boolean }>();

  const fakePagedFetch = useFakePagination(() =>
    fetchPartyUsers(
      pageRequest?.page as PageRequest,
      party,
      currentUser ?? ({ uid: 'NONE' } as User),
      canEdit,
      product,
      filterConfiguration.selcRole,
      filterConfiguration.productRoles
    ).then((data) => data.content)
  );

  const canEdit = product.userRole === 'ADMIN';

  useEffect(() => {
    if (
      filterConfiguration.productIds.length > 0 &&
      filterConfiguration.productIds.indexOf(product.id) === -1
    ) {
      onFetchStatusUpdate(false, 0);
      setUsers([]);
      setNoMoreData(true);
    } else {
      setPageRequest({
        filterChanged: true,
        page: {
          page: 0,
          size: ENV.PARTY_USERS_PAGE_SIZE,
        },
      });
    }
  }, [filterConfiguration]);

  useEffect(() => {
    if (pageRequest) {
      fetchUsers();
    }
  }, [pageRequest]);

  const fetchUsers = () => {
    setLoading(true);
    fakePagedFetch(pageRequest?.page as PageRequest, pageRequest?.filterChanged as boolean)
      .then((r) => {
        setUsers(pageRequest?.page.page === 0 ? r.content : users?.concat(r.content));
        setNoMoreData(r.content.length < (pageRequest?.page as PageRequest).size);
      })
      .catch((reason) => {
        handleErrors([
          {
            id: 'FETCH_PARTY_USERS',
            blocking: false,
            error: reason,
            techDescription: `An error occurred while fetching party users ${party.institutionId} of product ${product} and filter ${filterConfiguration}`,
            toNotify: true,
          },
        ]);
        setError(true);
        setUsers([]);
      })
      .finally(() => setLoading(false));
  };

  if (error) {
    return <UserProductFetchError onRetry={fetchUsers} />;
  } else {
    return users ? (
      <UsersProductTable
        loading={loading}
        noMoreData={noMoreData}
        party={party}
        product={product}
        users={users}
        canEdit={canEdit}
        fetchNextPage={() =>
          setPageRequest({
            filterChanged: false,
            page: {
              page: (pageRequest?.page as PageRequest).page + 1,
              size: (pageRequest?.page as PageRequest).size,
              sort: (pageRequest?.page as PageRequest).sort,
            },
          })
        }
        onSortRequest={(sort) =>
          setPageRequest({
            filterChanged: false,
            page: { page: 0, size: (pageRequest?.page as PageRequest).size, sort },
          })
        }
      />
    ) : (
      <></>
    );
  }
};

export default UsersTableProduct;
