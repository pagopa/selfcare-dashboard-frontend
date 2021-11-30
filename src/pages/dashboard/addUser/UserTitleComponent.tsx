import { Grid, Typography } from '@mui/material';
import { Product } from '../../../model/Product';

type Props = {
  title?: string;
  subTitle?: string;
  selectedProduct?: Product;
 
};
export default function UserTitleComponent({ title, subTitle, selectedProduct }: Props) {
  return (
    <Grid container>
      <Grid item xs={12} mb={2}> 
        <Typography variant="h1" sx={{color: 'text.primary' }}>
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
      {selectedProduct &&<Typography variant="h5" sx={{color: 'text.primary'}}>
          {subTitle} {selectedProduct.description}
        </Typography>}
      </Grid>
    </Grid>
  );
}
