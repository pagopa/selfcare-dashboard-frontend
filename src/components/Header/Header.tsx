import { AppBar, Button, SvgIcon, Toolbar } from '@mui/material';
import { Box } from '@mui/system';
import { ReactComponent as logo } from '../../assets/pagopa-logo.svg';

export function Header() {
  return (
    <AppBar position="relative">
      <Toolbar sx={{ flexWrap: 'wrap' }}>
        <SvgIcon component={logo} viewBox="0 0 80 24" sx={{ width: '80px' }} />
        <Box sx={{ flexGrow: 1, textAlign: 'end' }}>
          <Button variant="contained">
            Esci
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}