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
import UsersProductTable from './components/UsersProductTable';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pageRequest, setPageRequest] = useState<PageRequest>();

  const canEdit = product.userRole === 'ADMIN';

  useEffect(() => {
    if (
      filterConfiguration.productIds.length > 0 &&
      filterConfiguration.productIds.indexOf(product.id) === -1
    ) {
      onFetchStatusUpdate(false, 0);
      setUsers([]);
    } else {
      setPageRequest({
        page: 0,
        size: ENV.PARTY_USERS_PAGE_SIZE,
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
    fetchPartyUsers(
      pageRequest as PageRequest,
      party,
      currentUser ?? ({ uid: 'NONE' } as User),
      canEdit,
      product,
      filterConfiguration.selcRole,
      filterConfiguration.productRoles
    )
      .then((r) => {
        setUsers(pageRequest?.page === 0 ? r.content : users?.concat(r.content));
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
    return <>TODO Qualcosa è andato storto e tasto riprova rieseguendo il metodo fetch</>;
  } else if (loading) {
    return <>loader instead of the table</>;
  } else {
    return users ? (
      <UsersProductTable
        party={party}
        product={product}
        users={users}
        canEdit={canEdit}
        fetchNextPage={() =>
          setPageRequest({
            page: (pageRequest as PageRequest).page + 1,
            size: (pageRequest as PageRequest).size,
            sort: (pageRequest as PageRequest).sort,
          })
        }
        onSortRequest={(sort) =>
          setPageRequest({ page: 0, size: (pageRequest as PageRequest).size, sort })
        }
      />
    ) : (
      <></>
    );
  }
};

export default UsersTableProduct;
