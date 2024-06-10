import { Box, CircularProgress, Grid } from '@mui/material';

type Props = {
  loading: boolean;
  urlLogo?: string;
};

export default function PartyLogo({ loading, urlLogo }: Props) {
  return (
    <Box
      width="60px"
      height="60px"
      mr={2}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {!loading ? (
        <Grid>
          <img src={urlLogo} alt="partyLogo" id="partyLogo"></img>
        </Grid>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'background.paper',
            borderRadius: '50%',
            width: '100%',
            height: '100%',
            alignItems: 'center',
          }}
        >
          <CircularProgress sx={{ color: '#5C6F82' }} size={30} />
        </Box>
      )}
    </Box>
  );
}
