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
  const value1 = products.filter((p) => p.id === 'prod-interop-coll');
  const value2 = products.filter((p) => p.id === 'prod-interop');

  const result = value1.length > 0 && value2.length > 0;

  return (
    <React.Fragment>
      <TitleBox title={t('overview.activeProductsSection.title')} mbTitle={2} variantTitle="h5" />
      <Grid container spacing={3}>
        {products &&
          products
            .filter((p) =>
              result
                ? p.productOnBoardingStatus === 'ACTIVE' && p.id !== 'prod-interop-coll'
                : p.productOnBoardingStatus === 'ACTIVE'
            )
            .map((product) => (
              <ActiveProductCardContainer
                key={product.id}
                party={party}
                product={product}
                result={result}
              />
            ))}
      </Grid>
    </React.Fragment>
  );
}
