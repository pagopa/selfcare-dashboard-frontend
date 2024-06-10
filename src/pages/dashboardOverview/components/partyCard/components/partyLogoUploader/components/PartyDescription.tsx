import { CloudUpload } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
import { Grid, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ButtonNaked, theme } from '@pagopa/mui-italia';
import { MouseEventHandler } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import PartyLogo from './PartyLogo';
// Utility to wait some time

type Props = {
  labelLink: string;
  open: MouseEventHandler<HTMLButtonElement> | undefined;
  loading: boolean;
  urlLogo?: string;
};

export function PartyDescription({ labelLink, open, loading, urlLogo }: Props) {
  const { t } = useTranslation();
  const isLogoNotPresent = document.querySelector('#partyLogo')?.children[0].tagName === 'svg';

  return (
    <Stack>
      {urlLogo && <PartyLogo urlLogo={urlLogo} loading={loading} />}
      {!urlLogo && (
        <Grid
          container
          sx={{
            borderRadius: '10px',
            border: `2px dashed ${theme.palette.primary.main}`,
            backgroundColor: '#ebf4fd',
          }}
        >
          <Grid item xs={12} py={3} display={'flex'} direction={'column'} alignItems={'center'}>
            <CloudUpload color="primary" />
            <ButtonNaked
              component="button"
              onClick={open}
              startIcon={
                !loading && isLogoNotPresent ? (
                  <UploadIcon sx={{ fontSize: '23px !important' }} />
                ) : (
                  <EditIcon />
                )
              }
              sx={{ color: 'primary.main' }}
              weight="default"
            >
              {labelLink}
            </ButtonNaked>
            {!loading && isLogoNotPresent && (
              <Typography fontSize={'10px'}>
                <Trans i18nKey={t('overview.partyLogo.size')}>
                  Dimensione esatta 300 x 300px - Formato .png
                </Trans>
              </Typography>
            )}
          </Grid>
        </Grid>
      )}
      <Box>
        <Typography
          mt={1}
          sx={{ fontSize: '12px', fontWeight: 'fontWeightRegular', color: 'text.secondary' }}
        >
          {!loading && isLogoNotPresent ? (
            <Trans i18nKey="overview.partyLogo.info">
              Inserisci solo il logo del tuo ente.
              <br />
              Sarai responsabile dell’inserimento di immagini diverse da quella indicata.
            </Trans>
          ) : (
            <Trans i18nKey="overview.partyLogo.infoEditLabel">
              Dimensione esatta 300 x 300px - Formato .jpg o .png
            </Trans>
          )}
        </Typography>
      </Box>
    </Stack>
  );
}
