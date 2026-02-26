/* eslint-disable sonarjs/no-identical-functions */
import { Grid } from '@mui/material';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Party } from '../../../../model/Party';
import { Product } from '../../../../model/Product';
import NotActiveProductCardContainer from './components/NotActiveProductCardContainer';

type Props = {
  party: Party;
  filteredProducts: Array<Product>;
};

export default function NotActiveProductsSection({ party, filteredProducts }: Readonly<Props>) {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <TitleBox
        title={t('overview.notActiveProductsSection.title')}
        mbTitle={2}
        mtTitle={5}
        variantTitle="h5"
        titleFontSize="22px"
      />
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <NotActiveProductCardContainer key={product.id} party={party} product={product} />
        ))}
      </Grid>
    </React.Fragment>
  );
}
