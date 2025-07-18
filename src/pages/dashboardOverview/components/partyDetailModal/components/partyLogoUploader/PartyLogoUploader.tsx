import { Grid } from '@mui/material';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/lib/hooks/useErrorDispatcher';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { uniqueId } from 'lodash';
import { useState } from 'react';
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { DashboardApi } from '../../../../../../api/DashboardApiClient';
import { useAppDispatch, useAppSelector } from '../../../../../../redux/hooks';
import { partiesActions, partiesSelectors } from '../../../../../../redux/slices/partiesSlice';
import { PartyDescription } from './components/PartyDescription';
import PartyLogo from './components/PartyLogo';

type Props = {
  partyId?: string;
  canUploadLogo: boolean;
  setclearCache: React.Dispatch<React.SetStateAction<boolean>>;
};

export function PartyLogoUploader({ canUploadLogo, partyId, setclearCache }: Readonly<Props>) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const urlLogo = useAppSelector(partiesSelectors.selectPartySelectedLogo);
  const dispatch = useAppDispatch();
  const setUrlLogo = (urlLogo?: string) =>
    dispatch(partiesActions.setPartySelectedPartyLogo(urlLogo));

  const addError = useErrorDispatcher();

  const maxLength = 400;
  const minLegth = 300;

  const onFileRejected = (files: Array<FileRejection>) => {
    addError({
      id: 'WRONG_FILE_EXTENSION',
      blocking: false,
      error: new Error(),
      techDescription: `Wrong File Extension : ${files[0]}`,
      displayableTitle: t('overview.partyLogo.uploadError.title'),
      displayableDescription: t('overview.partyLogo.uploadError.description'),
      toNotify: false,
      onRetry: open,
    });
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDropAccepted: (files: Array<File>) => {
      setLoading(true);

      const requestId = uniqueId();
      trackEvent('DASHBOARD_PARTY_CHANGE_LOGO', { party_id: partyId, request_id: requestId });

      DashboardApi.uploadLogo(partyId as string, files[0])
        .then(() => {
          setUrlLogo(urlLogo);
          setclearCache(true);
          setLoading(false);

          trackEvent('DASHBOARD_PARTY_CHANGE_LOGO_SUCCESS', {
            party_id: partyId,
            request_id: requestId,
          });
        })
        .catch((reason) => {
          trackEvent('DASHBOARD_PARTY_CHANGE_LOGO_FAILURE', {
            party_id: partyId,
            request_id: requestId,
          });
          setLoading(false);
          addError({
            id: 'FILE_UPLOAD_ERROR',
            blocking: false,
            error: reason,
            techDescription: 'An error occurred while uploading new logo',
            displayableTitle: t('overview.partyLogo.modifyError.title'),
            displayableDescription: t('overview.partyLogo.modifyError.description'),
            toNotify: false,
            onRetry: open,
          });
        });
    },
    onDropRejected: onFileRejected,
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    accept: 'image/png',
    getFilesFromEvent: (event: DropEvent): Promise<Array<File | DataTransferItem>> => {
      const files = (event.target as any)?.files || (event as any)?.dataTransfer.files;
      const file = files[0];
      if (!file) {
        return new Promise((resolve) => resolve([]));
      }
      return new Promise((resolve, error) => {
        if (file.type !== 'image/png') {
          error();
          return;
        }
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
      }).catch((_reason) => {
        onFileRejected(files);
        return [];
      }) as Promise<Array<File | DataTransferItem>>;
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
    <Grid container>
      <Grid item xs={12} {...getRootProps({ className: 'dropzone' })}>
        {canUploadLogo && (
          <>
            <Grid item display={'flex'} justifyContent={'center'} alignItems={'center'} xs={12}>
              <input {...getInputProps()} />
              <PartyLogo
                loading={loading}
                urlLogo={urlLogo}
                isLoaded={isLoaded}
                setIsLoaded={setIsLoaded}
              />
            </Grid>
            <Grid>
              <PartyDescription open={open} loading={loading} isLoaded={isLoaded} />
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
}
