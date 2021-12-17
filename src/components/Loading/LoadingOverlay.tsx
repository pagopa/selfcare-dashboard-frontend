import { Modal, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import MDSpinner from 'react-md-spinner';
import { useAppSelector } from '../../redux/hooks';
import { appStateSelectors } from '../../redux/slices/appStateSlice';

export function LoadingOverlay() {
  const theme = useTheme();
  const loading = useAppSelector(appStateSelectors.selectLoading);

  return (
    <Modal open={loading} sx={{ outline: 0 }}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100px',
          outline: 0,
        }}
      >
        <MDSpinner singleColor={theme.palette.primary.main} role="loadingSpinner" />
      </Box>
    </Modal>
  );
}
