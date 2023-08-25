import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box } from '@mui/system';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Paper from '@mui/material/Paper';
import { ButtonNaked } from '@pagopa/mui-italia';
import { DelegationResource } from '../../api/generated/b4f-dashboard/DelegationResource';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import {
  fetchTechnologyPartnersList,
  mockedTechPartner,
} from '../../services/technologyPartnerService';

type Props = {
  party: Party;
  ptProducts: Array<Product>;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function TechnologyPartnerTable({ party }: Props) {
  const [tableList, setTableList] = useState<Array<DelegationResource>>([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const addError = useErrorDispatcher();
  const [expandMore, setExpandMore] = useState<boolean>(false);

  const [areMoreThen5Elemnts, setAreMoreThen5Elemnts] = useState<boolean>();

  const codeToLabelProduct = (code: string) => {
    switch (code) {
      case 'prod-io':
        return 'App Io';
      case 'prod-pagopa':
        return 'Piattaforma pagoPA';
      case 'prod-io, prod-pagopa':
        return 'App Io, Piattaforma pagoPA';

      default:
        return '';
    }
  };

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
      .then(() => setTableList(mockedTechPartner)) // TODO temporaly modified with mock, add r of then
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

  useEffect(() => {
    if (filteredArray.length > 5) {
      setAreMoreThen5Elemnts(true);
    }
  }, [filteredArray]);

  return !loading ? (
    <>
      {filteredArray && filteredArray.length > 0 ? (
        <Box height={expandMore && areMoreThen5Elemnts ? '100%' : '360px'}>
          <TableContainer component={Paper} sx={{ height: '100%', overflow: 'hidden' }}>
            <Table sx={{ minWidth: 'auto', height: '100%' }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sortDirection={'asc'}>
                    {t('overview.ptPage.headerPtTableLabels.party')}
                  </TableCell>
                  <TableCell>{t('overview.ptPage.headerPtTableLabels.product')}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredArray.map((tl, index) => (
                  <TableRow key={index}>
                    <TableCell width={'25%'}>
                      <Typography
                        sx={{
                          fontWeight: 'fontWeightBold',
                        }}
                      >
                        {tl.institutionName}
                      </Typography>
                    </TableCell>
                    <TableCell width={'25%'}>
                      <Typography sx={{ cursor: 'pointer' }}>
                        {codeToLabelProduct(tl.productId as string)}
                      </Typography>
                    </TableCell>
                    <TableCell width={'25%'}>
                      <Typography sx={{ cursor: 'pointer' }}>-</Typography>
                    </TableCell>
                    <TableCell width={'25%'}>
                      <Typography sx={{ cursor: 'pointer' }}>-</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {!expandMore && areMoreThen5Elemnts && (
            <Box
              width={'100%'}
              sx={{ backgroundColor: 'white' }}
              mt={'1px'}
              p={2}
              display="flex"
              justifyContent={'center'}
            >
              <ButtonNaked
                onClick={() => setExpandMore(true)}
                endIcon={<KeyboardArrowDownIcon />}
                weight="default"
                size="large"
                color="primary"
              >
                {t('overview.ptPage.bodyPtTable.showMoreButtonLabel')}
              </ButtonNaked>
            </Box>
          )}
        </Box>
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
