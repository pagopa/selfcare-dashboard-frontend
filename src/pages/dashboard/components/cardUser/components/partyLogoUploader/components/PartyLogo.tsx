import { Avatar, CircularProgress } from '@mui/material';

import { Box } from '@mui/system';

type Props = {
  loading: boolean;
  urlLogo?: string;
};

export function PartyLogo({ loading, urlLogo }: Props) {
  return (
    <Box sx={{ width: '152px', height: '152px', mt: 5, mb: 4, alignItems: 'center' }}>
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

      <Avatar
        alt=""
        src={urlLogo}
        sx={{
          width: '100%',
          height: '100%',
          display: !loading ? undefined : 'none',
        }}
      />
    </Box>
  );
}
