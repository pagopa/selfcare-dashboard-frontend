/* eslint-disable sonarjs/no-identical-functions */
import { Grid } from '@mui/material';
import { usePermissions } from '@pagopa/selfcare-common-frontend/lib';
import TitleBox from '@pagopa/selfcare-common-frontend/lib/components/TitleBox';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Party } from '../../../../model/Party';
import { Product } from '../../../../model/Product';
import NotActiveProductCardContainer from './components/NotActiveProductCardContainer';

type Props = {
  party: Party;
  products: Array<Product>;
};

export default function NotActiveProductsSection({ party, products }: Props) {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

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

  const isProductEligible = (product: Product) => {
    const isActive = product.status === 'ACTIVE';
    const isNotOnboarded = !party.products.some(
      (pp) => pp.productId === product.id && pp.productOnBoardingStatus === 'ACTIVE'
    );
    const hasEligibleSubProducts =
      product.subProducts &&
      party.products.find(
        (pp) =>
          pp.productId === product.id &&
          hasPermission(pp.productId, Actions.AccessProductBackoffice)
      ) &&
      product.subProducts.some(
        (subProduct) => !party.products.some((pp) => pp.productId === subProduct.id)
      );

    return isActive && (isNotOnboarded || hasEligibleSubProducts);
  };

  const isProductAllowed = (product: Product) => {
    if (party.institutionType === 'PSP' && product.id === 'prod-pagopa') {
      return false;
    }
    return !(product.id === 'prod-pn' && !isOnboardingAllowedInProdPN(party?.category));
  };

  const eligibleProducts = products.filter(isProductEligible).filter(isProductAllowed);

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
        {eligibleProducts.map((product) => (
          <NotActiveProductCardContainer key={product.id} party={party} product={product} />
        ))}
      </Grid>
    </React.Fragment>
  );
}
