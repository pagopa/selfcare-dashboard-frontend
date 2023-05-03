import React from 'react';
import { Grid } from '@mui/material';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { useTranslation } from 'react-i18next';
import { Product } from '../../../../model/Product';
import { Party } from '../../../../model/Party';
import NotActiveProductCardContainer from './components/NotActiveProductCardContainer';

type Props = {
  party: Party;
  products: Array<Product>;
};

export default function NotActiveProductsSection({ party, products }: Props) {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <TitleBox
        title={t('overview.notActiveProductsSection.title')}
        mbTitle={2}
        mtTitle={5}
        variantTitle="h5"
      />
      <Grid container spacing={3}>
        {products &&
          products
            .filter((product) => {
              const prodInactive =
                product.status === 'ACTIVE' && product.productOnBoardingStatus !== 'ACTIVE';
              const prodActiveWithSubProdInactive = product.subProducts.find(
                (sp) =>
                  product.status === 'ACTIVE' &&
                  product.productOnBoardingStatus === 'ACTIVE' &&
                  sp.productOnBoardingStatus !== 'ACTIVE'
              );
              return prodInactive || !!prodActiveWithSubProdInactive;
            })
            .map((product) => (
              <NotActiveProductCardContainer key={product.id} party={party} product={product} />
            ))}
      </Grid>
    </React.Fragment>
  );
}
