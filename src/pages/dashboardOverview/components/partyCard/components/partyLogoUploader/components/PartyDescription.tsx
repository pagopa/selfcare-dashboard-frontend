import { Grid, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Utility to wait some time

type Props = {
  labelLink: string;
  open:
    | React.MouseEventHandler<HTMLAnchorElement>
    | React.MouseEventHandler<HTMLSpanElement>
    | undefined;
};

export function PartyDescription({ labelLink, open }: Props) {
  const { t } = useTranslation();
  return (
    <Grid container direction="column" justifyContent={'center'} alignItems={'center'}>
      <Link
        underline={'always'}
        color={'primary'}
        onClick={open}
        sx={{ fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
      >
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
        {t('overview.partyDescription.type')}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#000000',
          fontWeight: 'normal',
          lineHeight: '18px',
          fontSize: '12px',
          mt: 1,
        }}
      >
        {t('overview.partyDescription.size')}
      </Typography>
    </Grid>
  );
}
