import { Card, Grid, Link } from '@mui/material';
import { Box } from '@mui/material';
import { SessionModal } from '@pagopa/selfcare-common-frontend';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Party } from '../../../../../model/Party';
import { Product } from '../../../../../model/Product';
import { ENV } from '../../../../../utils/env';
import BaseProductCard from '../../productCard/BaseProductCard';

type Props = {
  party: Party;
  product: Product;
};

const goToOnboarding = (product: Product, party: Party): void =>
  window.location.assign(
    `${ENV.URL_FE.ONBOARDING}/${product.id}?institutionId=${party.externalId}`
  );

export default function NotActiveProductCard({ party, product }: Props) {
  const { t } = useTranslation();
  const [onboardingPendingProduct, setOnboardingPendingProduct] = useState<Product | undefined>();

  return (
    <Grid item xs={4} key={product.id}>
      <Card
        sx={{ height: '100%', maxHeight: '410px', boxShadow: '0px 0px 80px rgba(0, 43, 85, 0.1)' }}
      >
        <Box mx={3} my={4}>
          <BaseProductCard
            disableBtn={false}
            cardTitle={product.title}
            cardSubTitle={product.description}
            buttonLabel={t('overview.notActiveProducts.joinButton')}
            urlLogo={product.logo}
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
          />
          <Grid container height="30px">
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
          </Grid>
        </Box>
      </Card>
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
