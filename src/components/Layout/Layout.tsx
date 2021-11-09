import { Box } from '@mui/system';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

type Props = {
  children?: Array<React.ReactChild | false>;
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
