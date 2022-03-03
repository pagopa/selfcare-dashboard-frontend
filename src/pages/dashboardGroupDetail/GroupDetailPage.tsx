import { Grid, Typography } from '@mui/material';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ProductNavigationBar from '../../components/ProductNavigationBar';
import withGroupDetail, { withGroupDetailProps } from '../../decorators/withGroupDetail';
import { DASHBOARD_ROUTES } from '../../routes';
import GroupActions from './components/GroupActions';
import GroupDetail from './components/GroupDetail';

type Props = withGroupDetailProps;

function GroupDetailPage({ partyGroup, party, productsMap }: Props) {
  const history = useHistory();

  useEffect(() => {
    if (partyGroup) {
      trackEvent('OPEN_USER_DETAIL', { group_id: partyGroup.id });
    }
  }, [partyGroup]);

  const goBack = () =>
    history.push(
      resolvePathVariables(DASHBOARD_ROUTES.PARTY_USERS.path, {
        institutionId: party.institutionId,
      })
    );

  const paths = [
    {
      description: 'Referenti',
      onClick: goBack,
    },
    {
      description: `${partyGroup.name}`,
    },
  ];
  console.log('group', partyGroup);
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
      <Grid item xs={12} mb={3}>
        <Typography variant="h1">Dettaglio Referente</Typography>
      </Grid>
      <Grid item xs={12} mb={3}>
        <GroupDetail group={partyGroup} productsMap={productsMap} />
      </Grid>
      <Grid item xs={12} mb={3} mt={15}>
        <GroupActions />
      </Grid>
    </Grid>
  );
}

export default withGroupDetail(GroupDetailPage);
