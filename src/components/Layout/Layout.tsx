import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import { Footer, Header } from '@pagopa/selfcare-common-frontend';
import {
  useUnloadEventLogout,
  useUnloadEventOnExit,
} from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import React from 'react';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import { ENV } from '../../utils/env';
import DashboardMenuContainer from './dashboardMenuContainer/DashboardMenuContainer';

type Props = {
  children?: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const party = useAppSelector(partiesSelectors.selectPartySelected);
  const onExit = useUnloadEventOnExit();
  const onLogout = useUnloadEventLogout();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header
        withSecondHeader={!!party}
        subHeaderChild={party && <DashboardMenuContainer />}
        onExitAction={onLogout}
      />
      <Grid container direction="row" flexGrow={1}>
        {children}
      </Grid>
      <Footer
        assistanceEmail={ENV.ASSISTANCE.ENABLE ? ENV.ASSISTANCE.EMAIL : undefined}
        onExit={onExit}
      />
    </Box>
  );
}
