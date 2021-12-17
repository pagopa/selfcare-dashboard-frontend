import { Grid, TextField, IconButton } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import { ChangeEventHandler } from 'react';

type Props = {
  onChange: ChangeEventHandler<HTMLInputElement>;
  input: string;
  label: string;
  disableUnderline?: boolean;
  clearField?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

export default function PartySelectionSearchInput({
  onChange,
  input,
  label,
  disableUnderline,
  clearField,
}: Props) {
  return (
    // <Grid container item  >
    <Grid item mx={-1} display="flex" justifyContent="center" xs={12}>
      <TextField
        name="partySearchInput"
        // type="search"
        sx={{ width: '100%' }}
        value={input}
        onChange={onChange}
        id="search"
        label={label}
        InputProps={{
          style: {
            fontSize: '16px',
            lineHeight: '24px',
            color: '#C1C9D2',
            textAlign: 'start',
            paddingLeft: '16px',
          },
          disableUnderline,
          endAdornment: (
            <InputAdornment position="end">
              {!input ? (
                <SearchOutlinedIcon />
              ) : (
                <IconButton
                  // color="primary"
                  onClick={clearField}
                  style={{ marginRight: '-10px' }}
                >
                  <ClearOutlinedIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
        variant="standard"
      />
    </Grid>
    // </Grid>
  );
}
