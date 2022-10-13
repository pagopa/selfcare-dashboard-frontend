import { Grid, Typography } from '@mui/material';
import { formatDateAsLongString } from '@pagopa/selfcare-common-frontend/utils/utils';
import { useTranslation } from 'react-i18next';
import { useTokenExchange } from '../../../../../hooks/useTokenExchange';
import { Party } from '../../../../../model/Party';
import { Product } from '../../../../../model/Product';
import ActiveProductCard from './ActiveProductCard';
import ChooseEnvironmentModal from './ChooseEnvironmentModal';

type Props = {
  party: Party;
  product: Product;
};

export default function ActiveProductCardContainer({ party, product }: Props) {
  const { t } = useTranslation();
  const { invokeProductBo } = useTokenExchange();
  const isDisabled = product.authorized === false;
  const lastServiceActivationDate = undefined; // actually this info is not available

  return (
    <Grid item xs={6} lg={4} xl={3}>
      <ActiveProductCard
        disableBtn={isDisabled}
        cardTitle={product.title}
        buttonLabel={t('overview.activeProducts.manageButton')}
        urlLogo={product.logo}
        btnAction={() =>
          product.backOfficeEnvironmentConfigurations
            ? ChooseEnvironmentModal(true, party, product)
            : invokeProductBo(product, party)
        }
        party={party}
        product={product}
      />
      {lastServiceActivationDate && (
        <Typography variant="h5" sx={{ fontSize: '16px' }} mx={1}>
          {t('overview.lastServiceActive') +
            `${lastServiceActivationDate && formatDateAsLongString(lastServiceActivationDate)}`}
        </Typography>
      )}
    </Grid>
  );
}
