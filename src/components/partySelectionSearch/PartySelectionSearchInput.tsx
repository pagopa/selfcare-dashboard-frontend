import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Grid, IconButton, styled, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import React, { ChangeEventHandler } from 'react';

const CustomTextField = styled(TextField)({
  label: { fontSize: '14px', fontWeight: 'fontWeightMedium', color: '#475A6D', paddingLeft: '8px' },
  input: { cursor: 'pointer' },
  '& .MuiOutlinedInput-root.MuiInputBase-adornedStart.MuiInputBase-adornedEnd': {
    height: '48px',
    paddingLeft: '16px',
  },
});
type Props = {
  onChange: ChangeEventHandler<HTMLInputElement>;
  input: string;
  clearField?: React.MouseEventHandler<HTMLButtonElement>;
  label?: string;
};

export default function PartySelectionSearchInput({
  onChange,
  input,
  clearField,
  label,
}: Readonly<Props>) {
  return (
    <Grid item display="flex" justifyContent="center" xs={12}>
      <CustomTextField
        label={label}
        name="partySearchInput"
        sx={{ width: '100%' }}
        value={input}
        onChange={onChange}
        id="search"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <IconButton disableRipple={true} onClick={clearField} aria-label="removeSelectionIcon">
              <ClearOutlinedIcon />
            </IconButton>
          ),
        }}
      />
    </Grid>
  );
}
