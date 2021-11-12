import { Grid, TextField } from '@mui/material';
// import { Box } from '@mui/system';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import { ChangeEventHandler } from 'react';

type Props ={
 onChange: ChangeEventHandler<HTMLInputElement>;
 input: string;
 label: string;
 disableUnderline?: boolean;
};


export default function PartySelectionSearchInput({onChange, input, label, disableUnderline}:Props) {
    return (
        // <Grid container item  >
        <Grid item  mx={-1} display="flex" justifyContent="center" >
          <TextField
            name="partySearchInput"
            type="search" 
            sx={{ width: '100%'}}
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
                paddingLeft:'16px'
              },
              disableUnderline,
              endAdornment: (
                <InputAdornment position="end">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
        </Grid>
      // </Grid>
    );
}
