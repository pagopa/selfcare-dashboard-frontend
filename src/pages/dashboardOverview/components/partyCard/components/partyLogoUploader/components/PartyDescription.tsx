import { CloudUpload } from '@mui/icons-material';
import { Grid, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ButtonNaked, theme } from '@pagopa/mui-italia';
import { MouseEventHandler } from 'react';
import { Trans, useTranslation } from 'react-i18next';
// Utility to wait some time

type Props = {
  open: MouseEventHandler<HTMLButtonElement> | undefined;
  loading: boolean;
  isLoaded: boolean;
};

export function PartyDescription({ open, loading, isLoaded }: Props) {
  const { t } = useTranslation();

  return (
    <Stack>
      {!loading && !isLoaded ? (
        <Grid
          container
          sx={{
            borderRadius: '10px',
            border: `1px dashed ${theme.palette.primary.main}`,
            backgroundColor: '#ebf4fd',
            gap: '10px',
          }}
        >
          <Grid item xs={12} py={3} display={'flex'} direction={'column'} alignItems={'center'}>
            <CloudUpload color="primary" sx={{ pb: 1 }} />
            <ButtonNaked
              component="button"
              onClick={open}
              sx={{ color: 'primary.main' }}
              weight="default"
            >
              {t('overview.partyLogo.upload')}
            </ButtonNaked>
            {!loading && !isLoaded && (
              <Typography fontSize={'10px'}>
                <Trans i18nKey={t('overview.partyLogo.size')}>
                  Dimensione esatta 300 x 300px - Formato .png
                </Trans>
              </Typography>
            )}
          </Grid>
        </Grid>
      ) : (
        <Grid container justifyContent={'center'} alignItems={'center'} pt={2}>
          <CloudUpload color="primary" />
          <ButtonNaked
            component="button"
            onClick={open}
            sx={{ color: 'primary.main', p: '8px' }}
            weight="default"
          >
            {t('overview.partyLogo.modify')}
          </ButtonNaked>
        </Grid>
      )}

      <Box>
        <Typography
          mt={2}
          mb={3}
          sx={{ fontSize: '12px', fontWeight: 'fontWeightRegular', color: 'text.secondary', textAlign: 'center' }}
        >
          {t('overview.partyLogo.info')}
        </Typography>
      </Box>
    </Stack>
  );
}
