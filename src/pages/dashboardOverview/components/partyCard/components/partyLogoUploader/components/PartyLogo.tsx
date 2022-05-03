import { Box } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { EntityAvatar } from '@pagopa/mui-italia/dist/components/EntityAvatar';

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
        <EntityAvatar customSrc={urlLogo} id="partyLogo" customAlt={undefined} />
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'white',
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
