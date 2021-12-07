import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import DashboardMenuContainer from './dashboardMenuContainer/DashboardMenuContainer';

type Props = {
  children?: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const party = useAppSelector(partiesSelectors.selectPartySelected);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header withSecondHeader={!!party} subHeaderChild={party && <DashboardMenuContainer />} />
      <Grid container direction="row" flexGrow={1}>
        {children}
      </Grid>
      <Footer />
    </Box>
  );
}
