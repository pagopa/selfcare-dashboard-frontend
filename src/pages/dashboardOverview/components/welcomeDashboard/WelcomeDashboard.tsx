import EditIcon from '@mui/icons-material/Edit';
import { Alert, Box, Button, Grid } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import TitleBox from '@pagopa/selfcare-common-frontend/lib/components/TitleBox';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { storageUserOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ENV } from '../../../../utils/env';
import { Party } from '../../../../model/Party';

type Props = {
  setOpen: (open: boolean) => void;
  party: Party;
};

export default function WelcomeDashboard({ setOpen, party }: Readonly<Props>) {
  const { t } = useTranslation();
  const history = useHistory();
  const title = t('overview.title');
  const subTitle = t('overview.subTitle');

  return (
    <>
      <Grid
        container
        spacing={2}
        flexWrap={{ xs: 'wrap', md: 'nowrap' }}
        justifyContent={'space-between'}
      >
        <Grid item sm={12} md={8}>
          <TitleBox
            title={title}
            subTitle={subTitle}
            mbTitle={2}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Grid>
        <Grid item justifyContent={'end'} sm={12} md={4} textAlign={{ xs: 'left', md: 'end' }}>
          <Box>
            <Button
              variant="outlined"
              onClick={() => setOpen(true)}
              startIcon={<EditIcon />}
              size="small"
              sx={{
                color: 'primary.main',
                textWrap: 'no-wrap',
                flexWrap: 'nowrap',
                border: '2px solid primary.main',
                fontWeight: '700px',
                fontSize: '16px',
              }}
            >
              {t('overview.changeDetails')}
            </Button>
          </Box>
        </Grid>
      </Grid>
      {ENV.ENABLE_MOBILE_PHONE && party.userRole === 'ADMIN' && (
        <Grid item xs={12}>
          <Alert
            sx={{ mt: 5 }}
            severity="info"
            variant="standard"
            action={
              <ButtonNaked
                component={Button}
                onClick={() =>
                  history.push(
                    resolvePathVariables(`${ENV.ROUTES.USERS}/:userId/edit`, {
                      partyId: party.partyId,
                      userId: storageUserOps.read()?.uid ?? '',
                    }) + '?activeField=mobilePhone'
                  )
                }
                color="primary"
                sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightBold' }}
              >
                {t('customAlert.button')}
              </ButtonNaked>
            }
          >
            {t('customAlert.message')}
          </Alert>
        </Grid>
      )}
    </>
  );
}
