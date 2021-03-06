import {
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Link,
  useTheme,
  Tooltip,
  Stack,
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
  const truncateText = {
    fontSize: theme.typography.fontSize,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical' as const,
  };

  return (
    <Card sx={{ height: '100%', borderRadius: theme.spacing(2), width: '100%' }}>
      <Grid item xs={12}>
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
      </Grid>
      <Grid item xs={12}>
        <Box
          mx={3}
          sx={{
            width: '64px',
            height: '64px',
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
          <img src={urlLogo} style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <CardContent sx={{ height: '100%', width: '100%' }}>
          <Grid item xs={12} mb={1}>
            <Tooltip title={title.length > 21 ? title : ''}>
              <Typography
                variant="h6"
                sx={{
                  ...truncateText,
                  WebkitLineClamp: 1,
                }}
              >
                {title}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={12} height="48px">
            <Tooltip title={description.length > 99 ? description : ''}>
              <Typography
                sx={{
                  ...truncateText,
                  WebkitLineClamp: 2,
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
                sx={{
                  fontSize: 'fontSize',
                  fontWeight: 'fontWeightBold',
                  color: 'primary.main',
                }}
                href={urlPublic}
              >
                {urlPublic && 'Scopri di pi??'}
              </Link>
            </Trans>
          </Grid>
          <Stack
            display="flex"
            alignItems="flex-end"
            justifyContent="flex-end"
            direction="row"
            sx={{ width: '100%' }}
            mt={3}
          >
            <CardActions sx={{ p: 0 }}>
              <Button
                onClick={btnAction}
                disabled={disableBtn}
                variant="outlined"
                sx={{
                  height: '40px',
                  fontWeight: 'fontWeightBold',
                  borderWidth: 'medium',
                  borderColor: 'primary.main',
                  '&:hover': { borderWidth: 'medium', backgroundColor: 'transparent' },
                }}
              >
                {buttonLabel}
              </Button>
            </CardActions>
          </Stack>
        </CardContent>
      </Grid>
    </Card>
  );
}
