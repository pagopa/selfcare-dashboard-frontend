import { Grid } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { Box } from '@mui/system';
import { useState } from 'react';
import SessionModal from '../../../../../../components/SessionModal';
import { PartyLogo } from './components/PartyLogo';
import { PartyDescription } from './components/PartyDescription';

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
        <PartyLogo loading={loading} urlLogo={urlLogo} />
        <PartyDescription labelLink={labelLink} open={open} />
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
