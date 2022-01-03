import { Grid, TextField, IconButton } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import { ChangeEventHandler } from 'react';
import { styled } from '@mui/system';

const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    display: 'none',
  },
  'label':{fontSize:'14px', fontWeight:'600', color:'#475A6D', marginLeft:'8px'}
});
type Props = {
  onChange: ChangeEventHandler<HTMLInputElement>;
  input: string;
  disableUnderline?: boolean;
  clearField?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  placeholder: string;
  label?: string;
};

export default function PartySelectionSearchInput({
  onChange,
  input,
  disableUnderline,
  clearField,
  placeholder,
  label,
}: Props) {
  return (
    // <Grid container item  >
    <Grid item mx={-1} display="flex" justifyContent="center" xs={12}>
      <CustomTextField
        label={label}
        name="partySearchInput"
        sx={{ width: '100%' }}
        value={input}
        placeholder={placeholder}
        onChange={onChange}
        id="search"
        inputProps={{
          style: {
            fontFamily: 'Titillium Web',
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
