import { Grid, TextField } from '@mui/material';
import { Box } from '@mui/system';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import { ChangeEventHandler } from 'react';

type Props ={
 onChange: ChangeEventHandler<HTMLInputElement>;
 input: string;
};


export default function PartySelectionSearch({onChange, input}:Props) {
    return (
        <Grid item xs={12} mx={-1} display="flex" justifyContent="center">
        <Box sx={{ width: '400px' }}>
          <TextField
            name="partySearchInput"
            type="search" 
            sx={{ width: '100%' }}
            value={input}
            onChange={onChange}
            id="search"
            label="Cerca"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
        </Box>
      </Grid>
    );
}
