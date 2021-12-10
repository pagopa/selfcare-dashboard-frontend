import { Card, Grid, Link } from '@mui/material';
import { Box } from '@mui/material';
import { Party } from '../../../../../model/Party';
import { Product } from '../../../../../model/Product';
import { URL_FE_ONBOARDING } from '../../../../../utils/constants';
import BaseProductCard from '../../productCard/BaseProductCard';

type Props = {
  party: Party;
  product: Product;
  buttonLabel: string;
  infoLabel?: string;
};

export default function NotActiveProductCard({ party, product, buttonLabel, infoLabel }: Props) {
  return (
    <Grid item xs={4} key={product.id}>
      <Card
        sx={{ height: '100%', maxHeight: '410px', boxShadow: '0px 0px 80px rgba(0, 43, 85, 0.1)' }}
      >
        <Box mx={3} my={4}>
          <BaseProductCard
            disableBtn={false}
            cardTitle={product.title}
            cardSubTitle={product.description}
            buttonLabel={buttonLabel}
            logoCard={product.logo}
            tag={product.tag}
            btnAction={() =>
              window.location.assign(
                `${URL_FE_ONBOARDING}/${product.id}?institutionId=${party.institutionId}`
              )
            }
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
                    href={product.urlPublic}
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
