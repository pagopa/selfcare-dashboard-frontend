import { AppBar, Grid, Toolbar, Typography} from '@mui/material';
import DashboardMenuContainer from './dashboardMenuContainer/DashboardMenuContainer';

export default function SubHeader() { 
  return (
    <AppBar
    position="relative"
    sx={{ alignItems: 'center', height: '107px', backgroundColor: '#0066CC' }}
  >
    <Toolbar sx={{ width: { xs: '100%', lg: '90%' }, minHeight: '107px !important' }}>
      <Grid container>
        <Grid container item direction="column" xs={6}>
          <Grid item>
            <Typography
              component="div"
              sx={{
                fontWeight: 'bold',
                fontSize: '24px',
                lineHeight: '36px',
                textAlign: 'left',
                color: 'background.default',
              }}
            >
              Self Care
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              component="div"
              sx={{
                fontWeight: 'normal',
                fontSize: '14px',
                lineHeight: '24px',
                textAlign: 'left',
                color: 'background.default',
              }}
            >
              Gestisci i tuoi prodotti e servizi PagoPA
            </Typography>
          </Grid>
        </Grid>
         <DashboardMenuContainer />
      </Grid>
    </Toolbar>
  </AppBar>
  );
}


// const SubHeader = () => {
// const
// return (
//   <AppBar
//   position="relative"
//   sx={{ alignItems: 'center', height: '107px', backgroundColor: '#0066CC' }}
// >
//   <Toolbar sx={{ width: { xs: '100%', lg: '90%' }, minHeight: '107px !important' }}>
//     <Grid container>
//       <Grid container item direction="column" xs={6}>
//         <Grid item>
//           <Typography
//             component="div"
//             sx={{
//               fontWeight: 'bold',
//               fontSize: '24px',
//               lineHeight: '36px',
//               textAlign: 'left',
//               color: 'background.default',
//             }}
//           >
//             Self Care
//           </Typography>
//         </Grid>
//         <Grid item>
//           <Typography
//             component="div"
//             sx={{
//               fontWeight: 'normal',
//               fontSize: '14px',
//               lineHeight: '24px',
//               textAlign: 'left',
//               color: 'background.default',
//             }}
//           >
//             Gestisci i tuoi prodotti e servizi PagoPA
//           </Typography>
//         </Grid>
//       </Grid>

//       <Grid container item direction="row" xs={6} alignContent="center" justifyContent="end">
//        <DashboardMenuContainer />
//       </Grid>
//     </Grid>
//   </Toolbar>
// </AppBar>
// );};

// export default SubHeader;
