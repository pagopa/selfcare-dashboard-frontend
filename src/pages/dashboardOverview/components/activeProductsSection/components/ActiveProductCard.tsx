import { Card, Grid, Box, Typography } from '@mui/material';
import { formatDateAsLongString } from '@pagopa/selfcare-common-frontend/utils/utils';
import { useTranslation } from 'react-i18next';
import { useTokenExchange } from '../../../../../hooks/useTokenExchange';
import { Party } from '../../../../../model/Party';
import { Product } from '../../../../../model/Product';
import BaseProductCard from '../../productCard/BaseProductCard';

type Props = {
  party: Party;
  product: Product;
};

export default function ActiveProductCard({ party, product }: Props) {
  const { t } = useTranslation();
  const { invokeProductBo } = useTokenExchange();
  const isDisabled = product.authorized === false;
  const lastServiceActivationDate = undefined; // actually this info is not available

  return (
    <Grid item xs={6}>
      <Card sx={{ height: '100%', boxShadow: '0px 0px 80px rgba(0, 43, 85, 0.1)' }}>
        <Box mx={8} my={5}>
          <BaseProductCard
            disableBtn={isDisabled}
            cardTitle={product.title}
            cardSubTitle={
              product.activationDateTime
                ? t('overview.activeProductCard.activationOf') +
                  `${
                    product.activationDateTime && formatDateAsLongString(product.activationDateTime)
                  }`
                : t('overview.activeProductCard.active')
            }
            buttonLabel={t('overview.activeProductCard.buttonLabel')}
            urlLogo={product.logo}
            tag={product.tag}
            btnAction={() => invokeProductBo(product, party)}
            heightLogo="70px"
            heightTitle="80px"
            heightSubTitle="20px"
            heightButton="45px"
          />
          {lastServiceActivationDate && (
            <Typography variant="h5" sx={{ fontSize: '16px' }} mx={1}>
              {t('overview.lastServiceActive') +
                `${lastServiceActivationDate && formatDateAsLongString(lastServiceActivationDate)}`}
            </Typography>
          )}
        </Box>
      </Card>
    </Grid>
  );
}
