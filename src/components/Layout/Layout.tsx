
import { Box } from '@mui/system';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';

type Props = {
    children?:React.ReactChild ;
};

export default function Layout({children} : Props) {
    return (
        <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
            <Header/>
            {children}
            <Footer/>
        </Box>
    );
}
