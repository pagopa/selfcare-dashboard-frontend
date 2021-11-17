import { Grid } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { Box } from '@mui/system';
import { useState } from 'react';
import SessionModal from '../../../../../../components/SessionModal';
import { DashboardApi } from '../../../../../../api/DashboardApiClient';
import { useAppDispatch, useAppSelector } from '../../../../../../redux/hooks';
import { partiesActions, partiesSelectors } from '../../../../../../redux/slices/partiesSlice';
import { PartyLogo } from './components/PartyLogo';
import { PartyDescription } from './components/PartyDescription';

type Props = {
  institutionId: string;
  canUploadLogo: boolean;
};

export function FilePngUploader({ canUploadLogo, institutionId }: Props) {
  const [loading, setLoading] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const urlLogo = useAppSelector(partiesSelectors.selectPartySelectedLogo);
  const dispatch = useAppDispatch();
  const setUrlLogo = (urlLogo?: string) =>
    dispatch(partiesActions.setPartySelectedPartyLogo(urlLogo));

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

      DashboardApi.uploadLogo(institutionId, files[0])
        .then(() => {
          setUrlLogo(urlLogo);
          setLoading(false);
          setLabelLink('Modifica Logo');
        })
        .catch(() => {
          setLoading(false);
          setOpenLogoutModal(true);
        });
    },
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    accept: 'image/png',
  });

  return (
    <Grid container direction="row" justifyItems={'center'} alignItems={'center'}>
      <Box {...getRootProps({ className: 'dropzone' })}>
        {canUploadLogo && <input {...getInputProps()} />}
        <PartyLogo loading={loading} urlLogo={urlLogo} />
        {canUploadLogo && <PartyDescription labelLink={labelLink} open={open} />}
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
