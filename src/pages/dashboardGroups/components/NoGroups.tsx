import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Party } from '../../../model/Party';
import AddGroupButton from './AddGroupButton';

type Props = {
  party: Party;
};

export default function NoGroups({ party }: Props) {
  const { t } = useTranslation();
  return (
    <Grid
      container
      direction="row"
      sx={{
        mt: 7,
        padding: 5,
        backgroundColor: 'white',
      }}
      justifyContent="center"
    >
      <Grid item xs={12} textAlign="center">
        <Typography variant="body2">{t('dashboardGroup.noGroups.noGroupsLabel')}</Typography>
      </Grid>
      <Grid item xs={12} textAlign="center" mt={2}>
        <AddGroupButton party={party} />
      </Grid>
    </Grid>
  );
}
