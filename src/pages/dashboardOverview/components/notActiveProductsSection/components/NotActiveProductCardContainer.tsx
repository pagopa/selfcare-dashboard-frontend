import { Grid } from '@mui/material';
import { SessionModal } from '@pagopa/selfcare-common-frontend';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Party } from '../../../../../model/Party';
import { Product } from '../../../../../model/Product';
import { ENV } from '../../../../../utils/env';
import NotActiveProductCard from './NotActiveProductCard';

type Props = {
  party: Party;
  product: Product;
};

const goToOnboarding = (product: Product, party: Party): void =>
  window.location.assign(
    `${ENV.URL_FE.ONBOARDING}/${product.id}?partyExternalId=${party.externalId}`
  );

export default function NotActiveProductCardContainer({ party, product }: Props) {
  const { t } = useTranslation();
  const [onboardingPendingProduct, setOnboardingPendingProduct] = useState<Product | undefined>();

  return (
    <Grid item xs={4} key={product.id}>
      <NotActiveProductCard
        image={product.imageUrl}
        urlLogo={product.logo}
        title={product.title}
        description={product.description}
        disableBtn={false}
        btnAction={() => {
          if (product.status === 'PENDING') {
            setOnboardingPendingProduct(product);
          } else {
            goToOnboarding(product, party);
          }
        }}
        buttonLabel={t('overview.notActiveProducts.joinButton')}
        urlPublic={product.urlPublic}
      />
      <SessionModal
        open={!!onboardingPendingProduct}
        handleClose={() => setOnboardingPendingProduct(undefined)}
        title={t('overview.adhesionPopup.title')}
        message={t('overview.adhesionPopup.description')}
        onConfirmLabel={t('overview.adhesionPopup.confirmButton')}
        onConfirm={() => goToOnboarding(onboardingPendingProduct as Product, party)}
        onCloseLabel={t('overview.adhesionPopup.closeButton')}
      />
    </Grid>
  );
}
