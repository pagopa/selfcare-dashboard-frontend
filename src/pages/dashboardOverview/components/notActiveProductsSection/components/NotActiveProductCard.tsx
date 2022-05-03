import { Typography, Box, Card, CardContent, Button, Grid } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';

type Props = {
  image?: string;
  urlLogo?: string;
  description: string;
  btnAction?: () => void;
  disableBtn: boolean;
  buttonLabel: string;
};

export default function NotActiveProductCard({
  image,
  urlLogo,
  description,
  btnAction,
  disableBtn,
  buttonLabel,
}: Props) {
  return (
    <Grid container>
      <Card sx={{ maxWidth: 345, height: '411px' }}>
        <Box
          sx={{
            width: '100%',
            height: '191px',
            position: 'relative',
            '&::after': { position: 'absolute' },
          }}
        >
          <CardMedia component="img" height="100%" image={image} />
        </Box>
        <Box
          mx={3}
          sx={{
            width: '88px',
            height: '88px',
            borderRadius: '4px',
            backgroundColor: 'white',
            marginTop: '-32px',
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
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }} p={3}>
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
        </Box>
      </Card>
    </Grid>
  );
}
