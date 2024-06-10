import { Grid } from '@mui/material';
import { useUserNotify } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { Party } from '../../../../../model/Party';
import { Product } from '../../../../../model/Product';
import { ENV } from '../../../../../utils/env';
import NotActiveProductCard from './NotActiveProductCard';

type Props = {
  party: Party;
  product: Product;
};

export default function NotActiveProductCardContainer({ party, product }: Props) {
  const { t } = useTranslation();
  const addNotify = useUserNotify();

  const existingSubProductNotOnboarded = product.subProducts?.find((sp) =>
    party.products.map(
      (us) =>
        sp.id !== us.productId && us.productOnBoardingStatus !== 'ACTIVE' && sp.status === 'ACTIVE'
    )
  );

  const baseProductWithExistingSubProductNotOnboarded =
    existingSubProductNotOnboarded &&
    product.subProducts &&
    party.products.find((pp) => pp.productId === product.id);

  const goToOnboarding = (product: Product, party: Party): void => {
    const subUnitType = party.subunitType ? `&subunitType=${party.subunitType}` : '';
    const subUnitCode = party.subunitCode ? `&subunitCode=${party.subunitCode}` : '';
    const queryParam =
      baseProductWithExistingSubProductNotOnboarded &&
      existingSubProductNotOnboarded?.id === 'prod-io-premium'
        ? `?partyId=${party.partyId}`
        : `?partyExternalId=${party.externalId}`;

    if (
      baseProductWithExistingSubProductNotOnboarded &&
      existingSubProductNotOnboarded.id === 'prod-io-premium'
    ) {
      trackEvent('PREMIUM_CTA_JOIN', {
        cta_referral: window.location.href,
        ctaId: t('overview.notActiveProducts.joinButton'),
      });
    }

    window.location.assign(
      `${ENV.URL_FE.ONBOARDING}/${product.id}${
        baseProductWithExistingSubProductNotOnboarded ? `/${existingSubProductNotOnboarded.id}` : ''
      }${queryParam}${subUnitType}${subUnitCode}`
    );
  };

  return (
    <>
      <Grid item xs={12} sm={6} lg={3} xl={3} key={product.id}>
        <NotActiveProductCard
          image={
            baseProductWithExistingSubProductNotOnboarded
              ? existingSubProductNotOnboarded.imageUrl
              : product.imageUrl
          }
          urlLogo={
            baseProductWithExistingSubProductNotOnboarded
              ? (existingSubProductNotOnboarded.logo as string)
              : product.logo
          }
          title={
            baseProductWithExistingSubProductNotOnboarded && existingSubProductNotOnboarded.title
              ? existingSubProductNotOnboarded.title
              : product.title
          }
          description={
            baseProductWithExistingSubProductNotOnboarded &&
            existingSubProductNotOnboarded.description
              ? existingSubProductNotOnboarded.description
              : product.description
          }
          disableBtn={false}
          btnAction={() => {
            const isOnboardingNotCompletedYet = !!party.products.find(
              (pp) =>
                pp.productId === product.id &&
                (pp.productOnBoardingStatus === 'TOBEVALIDATED' ||
                  pp.productOnBoardingStatus === 'PENDING')
            );
            if (isOnboardingNotCompletedYet) {
              addNotify({
                component: 'SessionModal',
                id: 'Notify_Example',
                title: t('overview.adhesionPopup.title'),
                message: t('overview.adhesionPopup.description'),
                confirmLabel: t('overview.adhesionPopup.confirmButton'),
                closeLabel: t('overview.adhesionPopup.closeButton'),
                onConfirm: () => goToOnboarding(product, party),
              });
            } else {
              goToOnboarding(product, party);
            }
          }}
          buttonLabel={t('overview.notActiveProducts.joinButton')}
          urlPublic={product.urlPublic}
          product={product}
        />
      </Grid>
    </>
  );
}
