import { Box } from '@mui/system';
import { Typography } from '@mui/material';


export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        
        backgroundColor: '#01254C',
        color: 'white',
      }}
    >
      <Typography variant="h6" align="center" gutterBottom>
        Footer
      </Typography>
      <Typography variant="subtitle1" align="center" component="p">
        Something here to give the footer a purpose!
      </Typography>
    </Box>
  );
}
