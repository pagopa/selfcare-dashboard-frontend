import { Card, Grid, Box, Typography } from '@mui/material';
import { useTokenExchange } from '../../../../../hooks/useTokenExchange';
import { Party } from '../../../../../model/Party';
import { Product } from '../../../../../model/Product';
import BaseProductCard from '../../productCard/BaseProductCard';
import { formatDateAsLongString } from '../../../../../utils/utils';

type Props = {
  party: Party;
  product: Product;
  buttonLabel: string;
  lastServiceActivationDate?: Date;
};
export default function ActiveProductCard({
  party,
  product,
  buttonLabel,
  lastServiceActivationDate,
}: Props) {
  const { invokeProductBo } = useTokenExchange();
  const isDisabled = product.authorized === false;
  return (
    <Grid item xs={6}>
      <Card sx={{ height: '100%', boxShadow: '0px 0px 80px rgba(0, 43, 85, 0.1)' }}>
        <Box mx={8} my={5}>
          <BaseProductCard
            disableBtn={isDisabled}
            cardTitle={product.title}
            cardSubTitle={
              product.activationDateTime ?
              `Attivo dal ${
                product.activationDateTime && formatDateAsLongString(product.activationDateTime)
              }` : 'Attivo'
            }
            buttonLabel={buttonLabel}
            logoCard={product.logo}
            tag={product.tag}
            btnAction={() => invokeProductBo(product, party)}
            heightLogo="70px"
            heightTitle="80px"
            heightSubTitle="20px"
            heightButton="45px"
          />
          {lastServiceActivationDate && (
            <Typography variant="h5" sx={{ fontSize: '16px' }} mx={1}>{`Ultimo servizio attivato: ${
              lastServiceActivationDate && formatDateAsLongString(lastServiceActivationDate)
            }`}</Typography>
          )}
        </Box>
      </Card>
    </Grid>
  );
}
