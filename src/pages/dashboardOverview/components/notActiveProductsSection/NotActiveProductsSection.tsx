/* eslint-disable sonarjs/no-identical-functions */
import { Grid } from '@mui/material';
import { usePermissions } from '@pagopa/selfcare-common-frontend/lib';
import TitleBox from '@pagopa/selfcare-common-frontend/lib/components/TitleBox';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Party } from '../../../../model/Party';
import { Product } from '../../../../model/Product';
import { ENV } from '../../../../utils/env';
import NotActiveProductCardContainer from './components/NotActiveProductCardContainer';

type Props = {
  party: Party;
  products: Array<Product>;
};

export default function NotActiveProductsSection({ party, products }: Readonly<Props>) {
  const [allowedCategoriesOnProdPN, setAllowedCategoriesOnProdPN] = React.useState<Array<string>>(
    []
  );
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const getCategoriesOnboardingAllowed = async () => {
    try {
      const response = await fetch(ENV.BASE_PATH_CDN_URL + '/assets/config.json');

      if (!response.ok) {
        console.error(`Failed to fetch config.json: ${response.status} - ${response.statusText}`);
        return;
      }

      const categoriesAllowedJSON = await response.json();

      const categoriesStringToArray = categoriesAllowedJSON?.product['prod-pn']?.ipa.PA?.split(
        ','
      ).map((c: string) => c.trim());

      setAllowedCategoriesOnProdPN(categoriesStringToArray);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void getCategoriesOnboardingAllowed();
  }, []);

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

  const isNotProductAllowed = (product: Product) => {
    if (party.institutionType === 'PSP' && product.id === 'prod-pagopa') {
      return false;
    }
    return !(
      product.id === 'prod-pn' &&
      party.categoryCode &&
      allowedCategoriesOnProdPN.includes(party.categoryCode)
    );
  };

  const eligibleProducts = products.filter(isProductEligible).filter(isNotProductAllowed);

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
