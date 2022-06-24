import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Link,
  useTheme,
  Tooltip,
  Paper,
} from '@mui/material';
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
      <Card sx={{ maxWidth: 345, height: '411px', borderRadius: '16px', width: '100%' }}>
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
            borderRadius: theme.shape,
            backgroundColor: 'background.paper',
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
        <Paper
          sx={{
            height: '180px',
            borderRadius: theme.spacing(2),
          }}
        >
          <CardContent sx={{ p: '0px 24px' }}>
            <Grid item xs={12}>
              <Typography variant="h6">{title}</Typography>
            </Grid>
            <Grid item xs={12} height="48px">
              <Tooltip title={description}>
                <Typography
                  sx={{
                    fontSize: theme.typography.fontSize,
                    height: '100%',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                  }}
                >
                  {description}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid
              mt={1}
              height="16px"
              item
              xs={12}
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Trans i18nKey="discoverMore">
                <Link
                  sx={{ fontSize: '14px', fontWeight: '700', color: '#0073E6' }}
                  href={urlPublic}
                >
                  {urlPublic && 'Scopri di più'}
                </Link>
              </Trans>
            </Grid>

            <Grid
              item
              xs={12}
              sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
              py={2}
            >
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
          </CardContent>
        </Paper>
      </Card>
    </Grid>
  );
}
