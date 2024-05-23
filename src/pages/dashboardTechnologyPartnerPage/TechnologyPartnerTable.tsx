import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DelegationWithInfo } from '../../api/generated/b4f-dashboard/DelegationWithInfo';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { getDelegatingInstitutions } from '../../services/technologyPartnerService';
import DashboardTableContainer from './DashboardTableContainer';

type Props = {
  party: Party;
  ptProducts: Array<Product>;
};
export default function TechnologyPartnerTable({ party }: Props) {
  const [tableList, setTableList] = useState<Array<DelegationWithInfo>>([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const addError = useErrorDispatcher();

  const retrieveDelegationsList = async () => {
    setLoading(true);
    await getDelegatingInstitutions(party.partyId)
      .then((r) => {
        if (r && r.delegations) {
          const filteredArray: Array<DelegationWithInfo> = r.delegations.reduce(
            (result: Array<DelegationWithInfo>, current: DelegationWithInfo) => {
              const existingItem = result.find(
                (item) =>
                  item.brokerId === current.brokerId &&
                  item.institutionName === current.institutionName
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

          setTableList(filteredArray as Array<DelegationWithInfo>);
        } else {
          setTableList([]);
        }
      })
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
    void retrieveDelegationsList();
  }, []);

  return !loading ? (
    <>
      {party.delegation && (
        <DashboardTableContainer
          tableList={tableList}
          setTableData={setTableList}
          retrieveDelegationsList={retrieveDelegationsList}
        />
      )}
      {!party.delegation && (
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
