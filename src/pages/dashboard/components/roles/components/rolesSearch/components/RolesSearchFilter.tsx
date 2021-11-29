import { Grid, Chip, IconButton, TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

import { UserPlatformRole } from '../../../../../../../model/Party';

interface RolesSearchFilterProps {
  filter: RolesSearchFilterConfig;
  onFilterChange: (f: RolesSearchFilterConfig) => void;
  filterProducts: boolean;
}

export type RolesSearchFilterConfig = {
  name?: string;
  product?: string;
  role?: UserPlatformRole;
};
export default function RolesSearchFilter({
  filter,
  onFilterChange,
  filterProducts,
}: RolesSearchFilterProps) {
  const handleFilterChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (
    e
  ) => {
    onFilterChange({ ...filter, name: e.target.value });
  };

  return (
    <Grid container direction="row" alignItems={'center'} px={4}>
      {filterProducts === true ? (
        <Grid item xs={2}>
          <Chip label="Prodotti" />
          {/*    <PartyDetail party={party} /> */}
        </Grid>
      ) : (
        <Grid item xs={2}></Grid>
      )}
      <Grid item xs={2}>
        <Chip label="Ruoli" />
        {/*    <PartyDetail party={party} /> */}
      </Grid>
      <Grid item xs={6}>
        <TextField
          variant="standard"
          value={filter.name}
          onChange={handleFilterChange}
          placeholder="Cerca referente"
          // className={classes.textField}
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" />,
            endAdornment: (
              <IconButton
                title="Clear"
                aria-label="Clear"
                size="small"
                // style={{ visibility: props.value ? 'visible' : 'hidden' }}
                // onClick={props.clearSearch}
              >
                {/* <ClearIcon fontSize="small" /> */}
              </IconButton>
            ),
          }}
        />
        {/*    <PartyDetail party={party} /> */}
      </Grid>
      <Grid item xs={2}>
        <Button variant="contained" startIcon={<AddIcon />}>
          Aggiungi
        </Button>
      </Grid>
    </Grid>
  );
}
