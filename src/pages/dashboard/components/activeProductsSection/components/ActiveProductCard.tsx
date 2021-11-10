import { Card, Grid,Box,Typography } from '@mui/material';
import { Product } from '../../../../../model/Product';
import BaseProductCard from '../../productCardPC/BaseProductCard';

type Props={
    product: Product;
    buttonLabel:string;
    infoLabel:string;
};
export default function ActiveProductCard({product,buttonLabel,infoLabel}: Props) {
    const isDisabled = product.authorized === false;
    return (
      <Grid item xs={4}>
        <Card sx={{ height: '359px', boxShadow:'0px 0px 80px rgba(0, 43, 85, 0.1)'}}>
          <Box mx={8} my={5}>
            <BaseProductCard
              disableBtn={isDisabled}
              cardTitle={product.title}
              cardSubTitle={product.description}
              buttonLabel={buttonLabel}
              logoCard={product.logo}
              tag={product.tag}
              btnAction={() => product.urlPublic && window.location.assign(product.urlPublic)}
            />
            <Typography mx={1}>{infoLabel}</Typography>
          </Box>
        </Card>
      </Grid>
    );
  
}
