import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import { IllusError } from '@pagopa/mui-italia';
import { EndingPage, TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation, Trans } from 'react-i18next';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { ENV } from '../../utils/env';
import TechnologyPartnerTable from './TechnologyPartnerTable';

type Props = {
  canSeeSection: boolean;
  party: Party;
  ptProducts: Array<Product>;
};

export default function DashboardTechnologyPartnerPage({
  canSeeSection,
  party,
  ptProducts,
}: Props) {
  const { t } = useTranslation();
  return !canSeeSection ? (
    <EndingPage
      minHeight="52vh"
      icon={<IllusError size={60} />}
      variantTitle={'h4'}
      variantDescription={'body1'}
      title={<Trans i18nKey="overview.genericError.title" />}
      description={
        <Trans i18nKey="overview.genericError.description">
          A causa di un errore del sistema non è possibile completare la procedura.
          <br />
          Ti chiediamo di riprovare più tardi.
        </Trans>
      }
      buttonLabel={<Trans i18nKey="overview.genericError.backAction" />}
      onButtonClick={() => window.location.assign(ENV.URL_FE.LANDING)}
    />
  ) : (
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
            <TechnologyPartnerTable party={party} ptProducts={ptProducts} />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
