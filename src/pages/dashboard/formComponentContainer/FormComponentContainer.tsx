import { Grid } from '@mui/material';
import FormComponent from './FormComponent';
import UserTitleComponent from './UserTitleComponent';
import BreadCrumbComponent from './BreadCrumbComponent';

export default function FormComponentContainer() {
  // const [products, setProducts]=useState:()
  
  return (
      <Grid container className='FormComponentContainer'>
          <Grid item xs={12} mt={10} mb={3}>
          <BreadCrumbComponent  />
          </Grid>
        <Grid item xs={12} mb={9}>
          <UserTitleComponent
            title="Aggiungi un Referente"
            subTitle="Inserisci i dati della persona che vuoi autorizzare a gestire"
          />
        </Grid>
        <Grid item xs={12}>
          <FormComponent/>
        </Grid>
      </Grid>
  );
}
