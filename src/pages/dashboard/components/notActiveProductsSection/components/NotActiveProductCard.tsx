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
      <Card sx={{ maxHeight: '369px', boxShadow: '0px 0px 80px rgba(0, 43, 85, 0.1)' }}>
        <Box mx={3} my={4}>
          <BaseProductCard
            disableBtn={isDisabled}
            cardTitle={product.title}
            cardSubTitle={product.description}
            buttonLabel={buttonLabel}
            logoCard={product.logo}
            tag={product.tag}
            btnAction={() => product.urlPublic && window.location.assign(product.urlPublic)}
            customHeight='80px'
          />
          {product.urlPublic && <Box mb={3}>
            <Link
              underline="none"
              sx={{ fontSize: '14px', fontWeight: '700', color: '#0073E6' }}
              mx={1}
            >
              {infoLabel}
            </Link>
          </Box>}
        </Box>
      </Card>
    </Grid>
  );
}
