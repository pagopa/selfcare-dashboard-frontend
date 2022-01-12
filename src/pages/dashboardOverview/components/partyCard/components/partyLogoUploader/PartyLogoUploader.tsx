import { Grid } from '@mui/material';
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';
import { Box } from '@mui/system';
import { useState, useEffect } from 'react';
import { DashboardApi } from '../../../../../../api/DashboardApiClient';
import { useAppDispatch, useAppSelector } from '../../../../../../redux/hooks';
import { partiesActions, partiesSelectors } from '../../../../../../redux/slices/partiesSlice';
import { AppError, appStateActions } from '../../../../../../redux/slices/appStateSlice';
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
  // const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const urlLogo = useAppSelector(partiesSelectors.selectPartySelectedLogo);
  const dispatch = useAppDispatch();
  const setUrlLogo = (urlLogo?: string) =>
    dispatch(partiesActions.setPartySelectedPartyLogo(urlLogo));

  const [labelLink, setLabelLink] = useState('Modifica Logo');
  const addError = (error: AppError) => dispatch(appStateActions.addError(error));

  useEffect(() => {
    setTimeout(() => setLabelLink(getLabelLinkText()), 400);
  }, [urlLogo]);

  const handleOpen = () => {
    open();
    // setOpenLogoutModal(false);
  };
  const maxLength = 400;
  const minLegth = 300;

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
        .catch((reason) => {
          setLoading(false);
          addError({
            id: 'WRONG_FILE_EXTENSION',
            blocking: false,
            error: reason,
            techDescription: `Wrong File Extension : ${files[0]}`,
            displayableTitle: 'Caricamento non riuscito',
            displayableDescription: 'Spiacenti, qualcosa è andato storto. Riprova più tardi',
            toNotify: true,
            onRetry: () => handleOpen(),
          });
          setLabelLink(getLabelLinkText());
        });
    },
    onDropRejected: async (files: Array<FileRejection>) => {
      addError({
        id: 'WRONG_FILE_EXTENSION',
        blocking: false,
        error: new Error(),
        techDescription: `Wrong File Extension : ${files[0]}`,
        displayableTitle: 'Caricamento non riuscito',
        displayableDescription:
          'Il caricamento del logo non è andato a buon fine. Verifica che il formato e la dimensione siano corretti e caricalo di nuovo',
        toNotify: false,
        onRetry: () => handleOpen(),
      });
    },
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    accept: 'image/png',
    getFilesFromEvent: (event: DropEvent): Promise<Array<File | DataTransferItem>> => {
      const files = (event.target as any).files || (event as any).dataTransfer.files;
      const file = files[0];
      return new Promise((resolve) => {
        const image = new Image();

        // eslint-disable-next-line functional/immutable-data
        image.onload = function () {
          // eslint-disable-next-line functional/immutable-data
          file.width = image.width;
          // eslint-disable-next-line functional/immutable-data
          file.height = image.height;
          resolve([file]);
        };

        // eslint-disable-next-line functional/immutable-data
        image.src = URL.createObjectURL(file);
      });
    },
    validator: (file) => {
      if (
        (file as any).height > maxLength ||
        (file as any).height < minLegth ||
        (file as any).height !== (file as any).width
      ) {
        return {
          code: 'height-width',
          message: `Image width and height must be equal with a value betwenn 300-400`,
        };
      }
      return null;
    },
  });

  return (
    <Grid container direction="row" justifyItems={'center'} alignItems={'center'}>
      <Box {...getRootProps({ className: 'dropzone' })}>
        {canUploadLogo && <input {...getInputProps()} />}
        <PartyLogo loading={loading} urlLogo={urlLogo} />
        {canUploadLogo && <PartyDescription labelLink={labelLink} open={open} />}
      </Box>
    </Grid>
  );
}
