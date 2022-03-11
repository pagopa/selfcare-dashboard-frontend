import { Grid, Typography, Chip, Link, Box } from '@mui/material';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ProductNavigationBar from '../../components/ProductNavigationBar';
import withGroupDetail, { withGroupDetailProps } from '../../decorators/withGroupDetail';
import { DASHBOARD_ROUTES } from '../../routes';
import withProductsRolesMap, {
  withProductsRolesMapProps,
} from '../../decorators/withProductsRolesMap';
import { PartyGroupExt, PartyGroupStatus } from '../../model/PartyGroup';
import GroupActions from './components/GroupActions';
import GroupDetail from './components/GroupDetail';

type Props = withGroupDetailProps &
  withProductsRolesMapProps & {
    fetchPartyGroup: () => void;
  };

function GroupDetailPage({
  partyGroup,
  party,
  productsMap,
  productsRolesMap,
  fetchPartyGroup,
}: Props) {
  const history = useHistory();

  const [partyGroupState, setPartyGroupState] = React.useState<PartyGroupExt>(partyGroup);

  const nextGroupStatus: PartyGroupStatus | undefined =
    partyGroupState.status === 'ACTIVE'
      ? 'SUSPENDED'
      : partyGroupState.status === 'SUSPENDED'
      ? 'ACTIVE'
      : undefined;

  const product = productsMap[partyGroupState.productId];

  const isSuspended = partyGroupState.status === 'SUSPENDED';

  useEffect(() => {
    if (partyGroup) {
      trackEvent('OPEN_USER_DETAIL', { group_id: partyGroup.id });
    }
  }, [partyGroup]);

  useEffect(() => {
    setPartyGroupState(partyGroup);
  }, [partyGroup]);

  const goBack = () =>
    history.push(
      resolvePathVariables(DASHBOARD_ROUTES.PARTY_GROUPS.subRoutes.MAIN.path, {
        institutionId: party.institutionId,
      })
    );

  const paths = [
    {
      description: 'Gruppi',
      onClick: goBack,
    },
    {
      description: `${partyGroupState.name}`,
    },
  ];

  const onGroupStatusUpdate = (nextGroupStatus: PartyGroupStatus) => {
    setPartyGroupState({ ...partyGroupState, status: nextGroupStatus });
  };

  return (
    <Grid
      container
      alignItems={'center'}
      px={2}
      mt={10}
      sx={{ width: '985px', backgroundColor: 'transparent !important' }}
    >
      <Grid item xs={12} mb={3}>
        <ProductNavigationBar paths={paths} />
      </Grid>
      <Grid container item mb={3}>
        <Grid item xs={6}>
          <Box display="flex">
            <Box>
              <Typography variant="h1">Dettaglio Gruppo</Typography>
            </Box>
            <Box>
              {isSuspended && (
                <Chip
                  label="Sospeso"
                  variant="outlined"
                  sx={{
                    fontWeight: '600',
                    fontSize: '14px',
                    background: '#E0E0E0',
                    border: 'none',
                    borderRadius: '16px',
                    width: '76px',
                    height: '24px',
                    marginTop: '23px',
                    marginLeft: '20px',
                  }}
                />
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} display="flex" alignItems="center" justifyContent="flex-end">
          <Link
            sx={{
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={goBack}
          >
            Indietro
          </Link>
        </Grid>
      </Grid>
      <Grid container item xs={11}>
        <Grid item mb={3} width="100%">
          <GroupDetail
            partyGroup={partyGroupState}
            productsMap={productsMap}
            isSuspended={isSuspended}
            product={product}
            party={party}
            productRolesLists={productsRolesMap[product.id]}
          />
        </Grid>
        <Grid item mb={3} mt={15} width="100%">
          <GroupActions
            partyGroup={partyGroupState}
            isSuspended={isSuspended}
            goBack={goBack}
            party={party}
            product={product}
            productsMap={productsMap}
            fetchPartyGroup={fetchPartyGroup}
            nextGroupStatus={nextGroupStatus}
            onGroupStatusUpdate={onGroupStatusUpdate}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default withGroupDetail(withProductsRolesMap(GroupDetailPage));
