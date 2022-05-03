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
    `${ENV.URL_FE.ONBOARDING}/${product.id}?institutionId=${party.institutionId}`
  );

export default function NotActiveProductCardContainer({ party, product }: Props) {
  const { t } = useTranslation();
  const [onboardingPendingProduct, setOnboardingPendingProduct] = useState<Product | undefined>();

  return (
    <Grid item xs={4} key={product.id}>
      {/* <BaseProductCard
            disableBtn={false}
            cardTitle={product.title}
            cardSubTitle={product.description}
            buttonLabel={t('overview.notActiveProducts.joinButton')}
            urlLogo={product.logo}
            image={product.imageUrl}
            tag={product.tag}
            btnAction={() => {
              if (product.status === 'PENDING') {
                setOnboardingPendingProduct(product);
              } else {
                goToOnboarding(product, party);
              }
            }}
            heightLogo="70px"
            heightTitle="80px"
            heightSubTitle="80px"
            heightButton="45px"
            titleFontSize="24px"
            subTitleFontSize="16px"
          /> */}
      <NotActiveProductCard
        image={product.imageUrl}
        urlLogo={product.logo}
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
      />
      {/* <Grid container height="30px">
        <Grid item xs={12} px={2}>
          <Box mb={3}>
            {product.urlPublic && (
              <Trans i18nKey="discoverMore">
                <Link
                  underline="none"
                  sx={{ fontSize: '14px', fontWeight: '700', color: '#0073E6' }}
                  href={product.urlPublic}
                >
                  {'SCOPRI DI PIÙ →'}
                </Link>
              </Trans>
            )}
          </Box>
        </Grid>
      </Grid> */}
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
