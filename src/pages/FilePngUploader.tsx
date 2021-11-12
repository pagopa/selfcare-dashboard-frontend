import { Avatar, CircularProgress, Grid, Link, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { Box } from '@mui/system';
import { useState } from 'react';
import SessionModal from '../components/SessionModal';

// Utility to wait some time

export const sleep = async (ms: number) => await new Promise((resolve) => setTimeout(resolve, ms));

type Props = {
  urlLogo?: string;
};

export function FilePngUploader({ urlLogo }: Props) {
  const [loading, setLoading] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const [labelLink, setLabelLink] = useState(
    urlLogo !== undefined ? 'Modifica Logo' : 'Carica il logo del tuo ente'
  );
  const handleOpen = () => {
    open();
    setOpenLogoutModal(false);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDropAccepted: async (files: Array<File>) => {
      setLoading(true);
      setLabelLink(files[0].name);
      const formData = new FormData();
      formData.append('file', files[0]);
      await sleep(2000);
      /* const uploadDocument = await fetchWithLogs(
          { endpoint: 'ONBOARDING_COMPLETE_REGISTRATION', endpointParams: { token } },
          { method: 'POST', data: formData, headers: { 'Content-Type': 'multipart/form-data' } }
        ); */

      setLoading(false);
      setLabelLink('Modifica Logo');
      // TODO RIMUOVIMI
      setOpenLogoutModal(true);
    },
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    accept: 'image/png',
  });

  return (
    <Grid container direction="row" justifyItems={'center'} alignItems={'center'}>
      <Box {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <Box sx={{ position: 'relative', display: loading ? undefined : 'none' }}>
          <CircularProgress
            variant="determinate"
            sx={{
              color: '#D1E7FF',
            }}
            size={152}
            thickness={5}
            value={100}
          />
          <CircularProgress
            variant="indeterminate"
            disableShrink
            sx={{
              color: 'primary.main',
              animationDuration: '1.5s',
              position: 'absolute',
              left: 0,
            }}
            size={152}
            thickness={7}
          />
        </Box>
        <Avatar
          alt=""
          src={urlLogo}
          sx={{
            width: '152px',
            height: '152px',
            mt: '40px',
            mb: 4,
            display: !loading ? undefined : 'none',
          }}
        />
        <Grid container direction="column" justifyContent={'center'} alignItems={'center'}>
          <Link component="button" underline={'always'} color={'primary'} onClick={open}>
            {labelLink}
          </Link>
          <Typography
            display="center"
            sx={{
              color: '#000000',
              fontWeight: 'normal',
              lineHeight: '18px',
              fontSize: '12px',
              mt: 1,
            }}
          >
            {'formato .png'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#000000',
              fontWeight: 'normal',
              lineHeight: '18px',
              fontSize: '12px',
              mt: 1,
              mb: '43px',
            }}
          >
            {'dimensione 300x300px'}
          </Typography>
        </Grid>
      </Box>

      <SessionModal
        handleClose={() => setOpenLogoutModal(false)}
        onConfirm={handleOpen}
        open={openLogoutModal}
        title={'Errore Caricamento'}
        message={'Il formato o la dimensione del file potrebbero esser diversi da quelli indicati'}
      />
    </Grid>
  );
}
