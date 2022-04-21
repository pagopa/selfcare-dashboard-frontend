import { Grid, TextField, IconButton, styled } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import React, { ChangeEventHandler } from 'react';

const CustomIconButton = styled(IconButton)({
  '&:hover': {
    backgroundColor: 'transparent !important',
  },
});
const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    display: 'none',
  },
  label: { fontSize: '14px', fontWeight: '600', color: '#475A6D', marginLeft: '8px' },
  input: { cursor: 'pointer' },
});
type Props = {
  onChange: ChangeEventHandler<HTMLInputElement>;
  input: string;
  disableUnderline?: boolean;
  clearField?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  placeholder: string;
  label?: string;
  iconColor?: string;
  iconMarginRight?: string;
};

export default function PartySelectionSearchInput({
  onChange,
  input,
  disableUnderline,
  clearField,
  placeholder,
  label,
  iconColor = '#475A6D',
  iconMarginRight,
}: Props) {
  const inputRef = React.useRef<HTMLInputElement>();

  const focusTextInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    // <Grid container item  >
    <Grid item mx={-1} display="flex" justifyContent="center" xs={12}>
      <CustomTextField
        inputRef={inputRef}
        label={label}
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
        }}
        InputProps={{
          disableUnderline,
          endAdornment: (
            <InputAdornment position="end">
              {!input ? (
                <CustomIconButton
                  disableRipple={true}
                  onClick={focusTextInput}
                  style={{ marginRight: iconMarginRight }}
                >
                  <SearchOutlinedIcon sx={{ color: iconColor }} />
                </CustomIconButton>
              ) : (
                <CustomIconButton
                  disableRipple={true}
                  onClick={clearField}
                  style={{ marginRight: '-10px' }}
                >
                  <ClearOutlinedIcon />
                </CustomIconButton>
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
