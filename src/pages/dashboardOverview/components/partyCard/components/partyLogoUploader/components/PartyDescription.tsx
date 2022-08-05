import { Grid, Typography } from '@mui/material';
import { useTranslation, Trans } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import { ButtonNaked } from '@pagopa/mui-italia';
import { MouseEventHandler } from 'react';

// Utility to wait some time

type Props = {
  labelLink: string;
  open: MouseEventHandler<HTMLButtonElement> | undefined;
  loading: boolean;
  files: Array<File>;
};

export function PartyDescription({ labelLink, open, loading, files }: Props) {
  const { t } = useTranslation();
  return (
    <Grid container justifyContent={'flex-start'} alignItems={'center'}>
      <ButtonNaked
        component="button"
        onClick={open}
        startIcon={!loading ? <EditIcon /> : undefined}
        sx={{ color: 'primary.main' }}
        weight="default"
      >
        {files && files.length > 0 && files[0].name ? labelLink : t('overview.partyLogo.modify')}
      </ButtonNaked>
      <Typography
        mt={1}
        variant="body2"
        sx={{
          color: '#5C6F82',
          fontWeight: '400',
          lineHeight: '18px',
          fontSize: '14px',
          width: '100%',
        }}
      >
        {t('overview.partyLogo.size')}
      </Typography>
      <Typography
        mt={1}
        sx={{ fontSize: '12px', fontWeight: 'fontWeightRegular', color: 'text.secondary' }}
      >
        <Trans i18nKey="overview.partyLogo.info">
          Inserisci solo il logo del tuo ente.
          <br />
          Sarai responsabile dell’inserimento di immagini diverse da quella indicata.
        </Trans>
      </Typography>
    </Grid>
  );
}
