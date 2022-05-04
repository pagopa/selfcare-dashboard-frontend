import React from 'react';
import { Grid } from '@mui/material';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { useTranslation } from 'react-i18next';
import { Product } from '../../../../model/Product';
import { Party } from '../../../../model/Party';
import ActiveProductCardContainer from './components/ActiveProductCardContainer';

type Props = {
  party: Party;
  products: Array<Product>;
};

export default function ActiveProductsSection({ party, products }: Props) {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <TitleBox
        title={t('overview.activeProductsSection.title')}
        mbTitle={2}
        mtTitle={10}
        variantTitle="h6"
      />
      <Grid container spacing={2}>
        {products &&
          products
            .filter((p) => p.status === 'ACTIVE')
            .map((product) => (
              <ActiveProductCardContainer
                key={product.id}
                party={party}
                product={product}
                tooltip={t('overview.activeProductsSection.tooltip')}
              />
            ))}
      </Grid>
    </React.Fragment>
  );
}
