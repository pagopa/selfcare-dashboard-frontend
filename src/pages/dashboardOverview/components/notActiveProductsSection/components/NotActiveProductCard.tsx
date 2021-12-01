import { Card, Grid, Link } from '@mui/material';
import { Box } from '@mui/material';
import { Product } from '../../../../../model/Product';
import BaseProductCard from '../../productCard/BaseProductCard';

type Props = {
  product: Product;
  buttonLabel: string;
  infoLabel?: string;
};

export default function NotActiveProductCard({ product, buttonLabel, infoLabel }: Props) {
  const isDisabled = product.authorized === false;
  return (
    <Grid item xs={4} key={product.id}>
      <Card
        sx={{ height: '100%', maxHeight: '410px', boxShadow: '0px 0px 80px rgba(0, 43, 85, 0.1)' }}
      >
        <Box mx={3} my={4}>
          <BaseProductCard
            disableBtn={isDisabled}
            cardTitle={product.title}
            cardSubTitle={product.description}
            buttonLabel={buttonLabel}
            logoCard={product.logo}
            tag={product.tag}
            btnAction={() => product.urlPublic && window.location.assign(product.urlPublic)}
            heightLogo="70px"
            heightTitle="80px"
            heightSubTitle="80px"
            heightButton="45px"
          />
          <Grid container height="30px">
            <Grid item xs={12} px={2}>
              <Box mb={3}>
                {product.urlPublic && (
                  <Link
                    underline="none"
                    sx={{ fontSize: '14px', fontWeight: '700', color: '#0073E6' }}
                  >
                    {infoLabel}
                  </Link>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Grid>
  );
}
