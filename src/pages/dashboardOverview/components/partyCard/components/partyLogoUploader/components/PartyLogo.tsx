import { CircularProgress, Box } from '@mui/material';
import CustomAvatar from '@pagopa/selfcare-common-frontend/components/CustomAvatar';

type Props = {
  loading: boolean;
  urlLogo?: string;
};

export function PartyLogo({ loading, urlLogo }: Props) {
  return (
    <Box sx={{ width: '152px', height: '152px', alignItems: 'center' }}>
      <Box sx={{ position: 'relative', display: loading ? undefined : 'none' }}>
        <CircularProgress
          variant="determinate"
          sx={{
            color: '#D1E7FF',
          }}
          size={152}
          thickness={5}
          value={100}
        />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          sx={{
            color: 'primary.main',
            animationDuration: '1.5s',
            position: 'absolute',
            left: 0,
          }}
          size={152}
          thickness={7}
        />
      </Box>

      <CustomAvatar
        customAlt=""
        customSrc={urlLogo}
        customWidth="100%"
        customHeight="100%"
        loading={loading}
        id="partyLogo"
      />
    </Box>
  );
}
