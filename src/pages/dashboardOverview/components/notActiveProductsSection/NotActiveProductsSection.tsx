/* eslint-disable sonarjs/no-identical-functions */
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

  const isOnboardingAllowedInProdPN = (category?: string): boolean => {
    const allowedCategories = [
      'Regioni, Province Autonome e loro Consorzi e Associazioni', // L4
      'Comuni e loro Consorzi e Associazioni', // L6
      "Citta' Metropolitane", // L45
      'Agenzie, Enti e Consorzi Pubblici per il Diritto allo Studio Universitario', // L15
      'Federazioni Nazionali, Ordini, Collegi e Consigli Professionali', // C14
    ];

    return category !== undefined && allowedCategories.includes(category);
  };

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
        {products
          .filter(
            (p) =>
              p.status === 'ACTIVE' &&
              (party.products.some(
                (us) => us.productId === p.id && us.productOnBoardingStatus !== 'ACTIVE'
              ) ||
                !party.products.some((us) => us.productId === p.id) ||
                (p.subProducts &&
                  party.products.find((pp) => pp.productId === p.id && pp.authorized) &&
                  p.subProducts.some(
                    (subProduct) => !party.products.some((us) => us.productId === subProduct.id)
                  )))
          )
          .filter(
            (p) =>
              (party.institutionType === 'PSP' ? p.id !== 'prod-pagopa' : p.id) &&
              (p.id !== 'prod-pn' || isOnboardingAllowedInProdPN(party?.category))
          )
          .map((product) => (
            <NotActiveProductCardContainer key={product.id} party={party} product={product} />
          ))}
      </Grid>
    </React.Fragment>
  );
}
