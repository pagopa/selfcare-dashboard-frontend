import { Box } from '@mui/system';
import {Grid,TextField, Typography, Button } from '@mui/material';
// import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
// import InputAdornment from "@material-ui/core/InputAdornment"

export default function BodyContent() {
    // interface EntiOptionType {
    //     title: string;
    //     description: string;
    //   }
    const bodyTitle ="Seleziona l'Ente per cui accedi";
    const bodyDescription="Potrai in ogni momento cambiare Ente/ruolo anche all'interno dell'interfaccia di gestione dei prodotti";
    
    // const topEnti = [
    //     { title: 'Comune di Milano', description: 'referente amministrativo' },
    //     { title: 'Comune di Roma', description: 'referente amministrativo' }];

  return (
    <Grid container  display="flex" justifyContent="center" spacing={3} my={"auto"} sx={{ textAlign: 'center' }}>
            <Grid item xs={12}> 
               <Box>
                    <Typography variant="h5" component="h2">{bodyTitle}</Typography>
               </Box>
            </Grid>
               <Grid item xs={12}> 
                <Box>
                    <Typography variant="h6" component="h2">{bodyDescription}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} mx={-1} sx={{ maxWidth: '400px' }} >          
            <TextField
                id="input-with-icon-textfield"
                label="TextField"
                InputProps={{
                // startAdornment: (
                //     // <InputAdornment position="start">
                //         <SearchOutlinedIcon />
                //     // </InputAdornment>
                // ),
                }}
                variant="standard"
            />
             </Grid>
             <Grid item xs={12}>         
                 <Button variant="contained" disabled sx={{width:"190px"}}>Entra</Button>
             </Grid>
    </Grid>
  );
}
