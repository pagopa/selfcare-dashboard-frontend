import { Grid } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { Box } from '@mui/system';
import { useState, useEffect } from 'react';
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

const getLabelLinkText = () =>
  document.querySelector('#partyLogo')?.children[0].tagName === 'svg'
    ? 'Carica il logo del tuo Ente'
    : 'Modifica Logo';

export function PartyLogoUploader({ canUploadLogo, institutionId }: Props) {
  const [loading, setLoading] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const urlLogo = useAppSelector(partiesSelectors.selectPartySelectedLogo);
  const dispatch = useAppDispatch();
  const setUrlLogo = (urlLogo?: string) =>
    dispatch(partiesActions.setPartySelectedPartyLogo(urlLogo));

  const [labelLink, setLabelLink] = useState('Modifica Logo');

  useEffect(() => {
    setTimeout(() => setLabelLink(getLabelLinkText()), 400);
  }, [urlLogo]);

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
          setLabelLink(getLabelLinkText());
        });
    },
    onDropRejected: async () => {
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
        {canUploadLogo && <input {...getInputProps()} />}
        <PartyLogo loading={loading} urlLogo={urlLogo} />
        {canUploadLogo && <PartyDescription labelLink={labelLink} open={open} />}
      </Box>

      <SessionModal
        handleClose={() => setOpenLogoutModal(false)}
        onConfirm={handleOpen}
        open={openLogoutModal}
        title={'Caricamento non riuscito'}
        message={
          'Il caricamento del logo non è andato a buon fine. Verifica che il formato e la dimensione siano corretti e caricalo di nuovo'
        }
        height="100%"
      />
    </Grid>
  );
}
