import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Grid } from '@mui/material';
import TitleBox from '@pagopa/selfcare-common-frontend/lib/components/TitleBox';
import { useTranslation } from 'react-i18next';

type Props = {
  setOpen: (open: boolean) => void;
};

export default function WelcomeDashboard({ setOpen }: Props) {
  const { t } = useTranslation();
  const title = t('overview.title');
  const subTitle = t('overview.subTitle');

  return (
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
  );
}
