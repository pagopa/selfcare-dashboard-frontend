import { Box } from '@mui/system';
import React from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

type Props = {
  children?: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header withSecondHeader={true} />
      {children}
      <Footer />
    </Box>
  );
}
