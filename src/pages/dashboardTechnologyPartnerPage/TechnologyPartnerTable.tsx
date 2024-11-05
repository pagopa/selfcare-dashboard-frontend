import { CircularProgress } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Box } from '@mui/system';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DelegationWithInfo } from '../../api/generated/b4f-dashboard/DelegationWithInfo';
import { Party } from '../../model/Party';
import { getDelegatingInstitutions } from '../../services/technologyPartnerService';
import TechPartnersTable from './TechPartnersTable';

type Props = {
  party: Party;
};
export default function TechnologyPartnerTable({ party }: Props) {
  const [delegationsWithoutDuplicates, setDelegationsWithoutDuplicates] = useState<
    Array<DelegationWithInfo>
  >([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const addError = useErrorDispatcher();

  const retrieveDelegationsList = async () => {
    setLoading(true);
    await getDelegatingInstitutions(party.partyId)
      .then((r) => {
        if (r && r.delegations && r.delegations?.length > 0) {
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

          setDelegationsWithoutDuplicates(filteredArray);
        } else {
          setDelegationsWithoutDuplicates([]);
        }
      })
      .catch((reason) => {
        setDelegationsWithoutDuplicates([]);
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
    <Box sx={{ backgroundColor: grey[100] }}>
      {party.delegation && delegationsWithoutDuplicates.length > 0 && (
        <Box
        sx={{
          height: '100%',
        }}
      >
        <TechPartnersTable delegationsWithoutDuplicates={delegationsWithoutDuplicates} />
      </Box>
      )}
      {delegationsWithoutDuplicates.length === 0 && (
        <Box sx={{ backgroundColor: grey[200], p: 2 }}>
          <Box
            width={'100%'}
            p={2}
            sx={{ backgroundColor: 'white' }}
            display="flex"
            justifyContent={'center'}
          >
            {t('overview.ptPage.tableEmptyLabel')}
          </Box>
        </Box>
      )}
    </Box>
  ) : (
    <Box display={'flex'} justifyContent="center" alignItems={'center'} width={'100%'}>
      <CircularProgress />
    </Box>
  );
}
