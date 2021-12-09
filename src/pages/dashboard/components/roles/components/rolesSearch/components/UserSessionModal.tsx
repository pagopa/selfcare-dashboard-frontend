import * as React from 'react';
import { Typography, Box, Button, Grid, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

type Props = {
  open: boolean;
  handleClose: React.MouseEventHandler<HTMLButtonElement>;
  message: string;
  title: string;
  onConfirm?: React.MouseEventHandler<HTMLButtonElement>;
  buttonLabel1: string;
  buttonLabel2: string;
  userName?: string | false;
  userSurname?: string | false;
  message2?: string | false;
};
export default function UserSessionModal({
  open,
  handleClose,
  message,
  onConfirm,
  title,
  buttonLabel1,
  buttonLabel2,
  userName,
  userSurname,
  message2,
}: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Dialog
      // sx={{ backgroundColor:'white'}}
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <Grid container direction="column" sx={{ height: '100%', width: '21.9em' }}>
        <Box mx={3} sx={{ height: '100%' }}>
          <Grid container item mt={4}>
            <Grid item xs={10}>
              <IconButton
                // color="primary"
                onClick={handleClose}
                style={{ position: 'absolute', top: '20px', right: '16px', zIndex: 100 }}
              >
                <ClearOutlinedIcon />
              </IconButton>
              <Typography variant="h5" sx={{ fontSize: '18px', fontWeight: '600' }}>
                {title}
              </Typography>
            </Grid>
          </Grid>

          <Grid container item>
            <Grid item xs={12} my={3}>
              <Typography variant="body2">
                {message}
                <strong>
                  {userName} {userSurname}.
                </strong>
                <br />
                {message2}
              </Typography>
            </Grid>
          </Grid>

          {onConfirm && (
            <Grid item xs={12} mb={2}>
              <Button
                sx={{ width: '100%' }}
                color="primary"
                variant="contained"
                onClick={onConfirm}
              >
                {buttonLabel1}
              </Button>
            </Grid>
          )}

          <Grid item xs={12} mb={3}>
            <Button onClick={handleClose} sx={{ width: '100%' }} color="primary" variant="outlined">
              {buttonLabel2}
            </Button>
          </Grid>
        </Box>
      </Grid>
    </Dialog>
  );
}
