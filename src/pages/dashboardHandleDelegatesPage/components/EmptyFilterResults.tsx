import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { Grid, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { Trans } from 'react-i18next';

type Props = {
  handleResetFilter: () => void;
};

const EmptyFilterResults = ({ handleResetFilter }: Props): JSX.Element => (
  <Grid
    item
    width={'100%'}
    xs={12}
    mt={5}
    sx={{
      display: 'flex',
      padding: '16px',
      backgroundColor: 'background.paper',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
    }}
  >
    <SentimentDissatisfiedIcon />
    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
      <Trans i18nKey="overview.ptPage.filterTechPartner.emptyFilterResult">
        I filtri che hai applicato non hanno dato nessun risultato.
        <ButtonNaked color="primary" onClick={handleResetFilter} sx={{ ml: '4px' }} size="medium">
          Rimuovi filtri
        </ButtonNaked>
      </Trans>
    </Typography>
  </Grid>
);

export default EmptyFilterResults;
