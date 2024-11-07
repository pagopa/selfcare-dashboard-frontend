import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import { TitleBox } from '@pagopa/selfcare-common-frontend/lib';
import { useTranslation } from 'react-i18next';
import { Party } from '../../model/Party';
import TechnologyPartnerTable from './components/TechnologyPartnerTable';

type Props = {
  party: Party;
};

export default function DashboardHandleDelegatesPage({ party }: Readonly<Props>) {
  const { t } = useTranslation();
  return (
    <Box p={3} sx={{ width: '100%' }}>
      <Grid
        container
        alignItems={'center'}
        px={3}
        mt={3}
        sx={{ width: '100%', backgroundColor: 'transparent !important' }}
      >
        <Grid container item xs={12}>
          <Grid item xs={12}>
            <TitleBox
              variantTitle="h4"
              variantSubTitle="body1"
              title={t('overview.ptPage.title')}
              subTitle={t('overview.ptPage.subTitle')}
              mbTitle={2}
              mbSubTitle={6}
            />
          </Grid>
          {/* Table */}
          <Grid item xs={12}>
            <TechnologyPartnerTable party={party}/>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
