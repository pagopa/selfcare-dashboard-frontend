import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DelegationResource } from '../../api/generated/b4f-dashboard/DelegationResource';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { fetchTechnologyPartnersList } from '../../services/technologyPartnerService';
import DashboardTableContainer from './DashboardTableContainer';

type Props = {
  party: Party;
  ptProducts: Array<Product>;
};
export default function TechnologyPartnerTable({ party }: Props) {
  const [tableList, setTableList] = useState<Array<DelegationResource>>([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const addError = useErrorDispatcher();

  const filteredArray: Array<DelegationResource> = tableList.reduce(
    (result: Array<DelegationResource>, current: DelegationResource) => {
      const existingItem = result.find(
        (item) =>
          item.brokerId === current.brokerId && item.institutionName === current.institutionName
      );
      if (existingItem) {
        // eslint-disable-next-line functional/immutable-data
        existingItem.productId += `, ${current.productId}`;
      } else {
        // eslint-disable-next-line functional/immutable-data
        result.push({ ...current });
      }
      return result;
    },
    []
  );

  const retrievePtList = async () => {
    setLoading(true);
    await fetchTechnologyPartnersList(party.partyId)
      .then((r) => setTableList(r))
      .catch((reason) => {
        addError({
          id: `FETCH_PARTY_PT_ERROR-${party.partyId}`,
          blocking: false,
          error: reason,
          techDescription: `Something gone wrong while fetching technology partners with party id ${party.partyId}`,
          toNotify: true,
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void retrievePtList();
  }, []);

  return !loading ? (
    <>
      {filteredArray && filteredArray.length > 0 ? (
        <DashboardTableContainer filteredArray={filteredArray} />
      ) : (
        // empty state
        <Box
          width={'100%'}
          p={2}
          sx={{ backgroundColor: 'white' }}
          display="flex"
          justifyContent={'center'}
        >
          {t('overview.ptPage.tableEmptyLabel')}
        </Box>
      )}
    </>
  ) : (
    <Box display={'flex'} justifyContent="center" alignItems={'center'} width={'100%'}>
      <CircularProgress />
    </Box>
  );
}
