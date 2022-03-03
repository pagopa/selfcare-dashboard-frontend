import { Button, Grid } from '@mui/material';
import { PartyGroupExt } from '../../../model/PartyGroup';

type Props = {
  goEdit: () => void;
  goToDuplicate: () => void;
  onDelete: () => void;
  partyGroup: PartyGroupExt;
  handleOpen: () => void;
};
export default function GroupActions({
  goEdit,
  goToDuplicate,
  onDelete,
  partyGroup,
  handleOpen,
}: Props) {
  return (
    <Grid container spacing={4}>
      <Grid item xs={3}>
        <Button variant="contained" sx={{ height: '40px', width: '100%' }} onClick={goEdit}>
          Modifica
        </Button>
      </Grid>
      <Grid item xs={3}>
        <Button variant="contained" sx={{ height: '40px', width: '100%' }} onClick={handleOpen}>
          {partyGroup.status === 'SUSPENDED'
            ? 'Riabilita'
            : partyGroup.status === 'ACTIVE'
            ? 'Sospendi'
            : ''}
        </Button>
      </Grid>
      <Grid item xs={3}>
        <Button variant="contained" sx={{ height: '40px', width: '100%' }} onClick={goToDuplicate}>
          Duplica
        </Button>
      </Grid>
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
