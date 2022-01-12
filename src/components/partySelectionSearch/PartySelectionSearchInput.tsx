import { Grid, TextField, IconButton } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import { ChangeEventHandler } from 'react';

type Props = {
  onChange: ChangeEventHandler<HTMLInputElement>;
  input: string;
  disableUnderline?: boolean;
  clearField?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  placeholder: string;
};

export default function PartySelectionSearchInput({
  onChange,
  input,
  disableUnderline,
  clearField,
  placeholder
}: Props) {
  return (
    // <Grid container item  >
    <Grid item mx={-1} display="flex" justifyContent="center" xs={12}>
      <TextField
        name="partySearchInput"
        sx={{ width: '100%' }}
        value={input}
        placeholder={placeholder}
        onChange={onChange}
        id="search"
        inputProps={{
          style: {
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '16px',
            lineHeight: '24px',
            color: '#5C6F82',
            textAlign: 'start',
            paddingLeft: '16px',
          },
          disableUnderline,
        }}
          InputProps={{
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
