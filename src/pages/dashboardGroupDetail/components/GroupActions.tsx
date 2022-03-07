import { Button, Grid } from '@mui/material';
import { PartyGroupExt } from '../../../model/PartyGroup';

type Props = {
  goEdit: () => void;
  goToDuplicate: () => void;
  onDelete: () => void;
  partyGroup: PartyGroupExt;
  handleOpen: () => void;
  isSuspended: boolean;
};
export default function GroupActions({
  goEdit,
  goToDuplicate,
  onDelete,
  partyGroup,
  handleOpen,
  isSuspended,
}: Props) {
  return (
    <Grid container spacing={4}>
      {!isSuspended && (
        <Grid item xs={3}>
          <Button variant="contained" sx={{ height: '40px', width: '100%' }} onClick={goEdit}>
            Modifica
          </Button>
        </Grid>
      )}
      <Grid item xs={3}>
        <Button variant="contained" sx={{ height: '40px', width: '100%' }} onClick={handleOpen}>
          {partyGroup.status === 'SUSPENDED'
            ? 'Riattiva'
            : partyGroup.status === 'ACTIVE'
            ? 'Sospendi'
            : ''}
        </Button>
      </Grid>
      {!isSuspended && (
        <Grid item xs={3}>
          <Button
            variant="contained"
            sx={{ height: '40px', width: '100%' }}
            onClick={goToDuplicate}
          >
            Duplica
          </Button>
        </Grid>
      )}
      <Grid item xs={3}>
        <Button
          variant="outlined"
          color="error"
          sx={{ height: '40px', width: '100%' }}
          onClick={onDelete}
        >
          Elimina
        </Button>
      </Grid>
    </Grid>
  );
}
