import { Grid, Box, Typography } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ButtonNaked } from '@pagopa/mui-italia';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend';
import { Party } from '../../model/Party';
import { DASHBOARD_ROUTES } from '../../routes';

type Props = {
  party: Party;
};

export default function DashboardDelegationsBanner({ party }: Props) {
  const delegatesRoute = DASHBOARD_ROUTES.DELEGATIONS.path;
  const delegatesPath = resolvePathVariables(delegatesRoute, {
    partyId: party.partyId,
  });

  const history = useHistory();

  const onExit = useUnloadEventOnExit();
  const { t } = useTranslation();
  return (
    <Grid
      item
      container
      xs={12}
      height="124px"
      mt={2}
      sx={{ borderRadius: '4px', backgroundColor: 'white' }}
    >
      <Box m={3} display="flex" flexDirection={'column'} width="100%">
        <Grid item display="flex">
          <AssignmentIcon />
          <Typography ml={2} variant="h6">
            {t('overview.partyDetail.delegationBanner.title')}
          </Typography>
        </Grid>
        <Grid item mt={2} width="100%" display="flex" justifyContent={'space-between'} xs={12}>
          <Typography variant="body1">
            {t('overview.partyDetail.delegationBanner.subTitle')}
          </Typography>
          <ButtonNaked
            component="button"
            onClick={() =>
              onExit(() => history.push(party.partyId ? delegatesPath : delegatesRoute))
            }
            endIcon={<ArrowForwardIcon />}
            weight="default"
            size="medium"
            color="primary"
          >
            {t('overview.partyDetail.delegationBanner.goToButton')}
          </ButtonNaked>
        </Grid>
      </Box>
    </Grid>
  );
}
