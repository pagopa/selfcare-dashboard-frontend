import { Alert, Grid, SvgIcon, Typography, Box, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import { ReactComponent as logo } from '../../../../../../../assets/RoleSearchTable/confirmUserUpdate.svg';
type Props = {
  userName?: string;
  userSurname?: string;
  userStatus?: string;
  closeToast: React.MouseEventHandler<HTMLButtonElement>;
};
const CustomAlert = styled(Alert)({
  '.MuiAlert-icon': { display: 'none' },
});

export default function UserToast({ userName, userSurname, userStatus, closeToast }: Props) {
  return (
    <Grid container justifyContent="end">
      <Grid item xs={12} display="flex" justifyContent="flex-end" >
        <Box sx={{borderLeft:'4px solid #00CF86',borderRadius:'5px',boxShadow: '0px 0px 45px rgba(0, 0, 0, 0.1)'}}> 
        <CustomAlert
        className='userToast'
          variant="outlined"
          sx={{
            width:'376px',
            minHeight:'120px',
            maxHeight: '100%',
            margin: '0 10px',
            padding:'0',
            border:'none'
          }}
        >
          <Grid container>
            <Grid item xs={2}>
              <SvgIcon
                component={logo}
                viewBox="0 0 80 24"
                sx={{ width: '80px',  height: '37px', marginLeft: '13px'}}
              />
            </Grid>
            <Grid item xs={8} >
              <Typography pt={1} pb={1}>REFERENTE {userStatus?.toUpperCase()}</Typography>
              <Typography>
                Hai {userStatus} correttamente{' '}
                </ Typography>
                <Typography>
                <strong>
                  {userName} {userSurname}.
                </strong>
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <IconButton  onClick={closeToast}>
                  <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </CustomAlert>
        </ Box> 
      </Grid>
    </Grid>
  );
}
