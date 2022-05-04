import { Typography, Box, Card, CardContent, Button, Grid, Link, useTheme } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import { Trans } from 'react-i18next';

type Props = {
  image?: string;
  urlLogo?: string;
  description: string;
  title: string;
  btnAction?: () => void;
  disableBtn: boolean;
  buttonLabel: string;
  urlPublic?: string;
};

export default function NotActiveProductCard({
  image,
  urlLogo,
  description,
  btnAction,
  disableBtn,
  buttonLabel,
  urlPublic,
  title,
}: Props) {
  const theme = useTheme();

  return (
    <Grid container>
      <Card sx={{ maxWidth: 345, height: '411px', borderRadius: '16px' }}>
        <Box
          sx={{
            width: '100%',
            height: '191px',
            position: 'relative',
            '&::after': { position: 'absolute' },
          }}
        >
          <CardMedia component="img" height="100%" width="100%" image={image} />
        </Box>
        <Box
          mx={3}
          sx={{
            width: '88px',
            height: '88px',
            borderRadius: '4px',
            backgroundColor: 'white',
            marginTop: '-3rem',
            position: 'relative',
            textAlign: 'center',
            '&::after': {
              position: 'absolute',
              display: 'inline-block',
              top: '40px',
              left: '40px',
            },
          }}
          mr={2}
        >
          <img src={urlLogo} style={{ paddingTop: '15px' }} />
        </Box>
        <CardContent sx={{ p: '0px 24px' }}>
          <Typography variant="h6">{title}</Typography>
          <Typography sx={{ fontSize: theme.typography.fontSize, height: '50px' }}>
            {description}
          </Typography>
        </CardContent>
        <Grid container p={3}>
          <Grid
            item
            xs={6}
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            {urlPublic && (
              <Trans i18nKey="discoverMore">
                <Link
                  sx={{ fontSize: '14px', fontWeight: '700', color: '#0073E6' }}
                  href={urlPublic}
                >
                  {'Scopri di più'}
                </Link>
              </Trans>
            )}
          </Grid>

          <Grid item xs={6} sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={btnAction}
              disabled={disableBtn}
              variant="outlined"
              sx={{
                height: '40px',
                fontWeight: 'bold',
                borderWidth: 'medium',
                borderColor: '#0073E6',
                '&:hover': { borderWidth: 'medium', backgroundColor: 'transparent' },
              }}
            >
              {buttonLabel}
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}
