import { Grid } from '@mui/material';
import { useErrorDispatcher, useUserNotify } from '@pagopa/selfcare-common-frontend/lib';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { useTranslation } from 'react-i18next';
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
  const addError = useErrorDispatcher();

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

  const getOnboardingStatus = async (productId: string) => {
    const token = storageTokenOps.read();
    const subUnitCode = party.subunitCode ? `&subunitCode=${party.subunitCode}` : '';

    void fetch(
      `${ENV.URL_API.API_DASHBOARD}/v2/institutions/onboardings/${productId}/pending?taxCode=${party.fiscalCode}${subUnitCode}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }
    ).then((res) => {
      if (res.status === 204) {
        goToOnboarding(product, party);
        return;
      }
      if (res.status === 200) {
        addNotify({
          component: 'SessionModal',
          id: 'Notify_Example',
          title: t('overview.adhesionPopup.title'),
          message: t('overview.adhesionPopup.description'),
          confirmLabel: t('overview.adhesionPopup.confirmButton'),
          closeLabel: t('overview.adhesionPopup.closeButton'),
          onConfirm: () => goToOnboarding(product, party),
        });
        return;
      }

      addError({
        id: `OnboardingStatusError-${product.id}`,
        blocking: false,
        error: new Error('Something gone wrong retrieving onboarding status'),
        techDescription: 'Something gone wrong retrieving onboarding status',
        toNotify: true,
      });
    });
  };

  return (
    <>
      <Grid item xs={12} sm={6} lg={4} xl={3} key={product.id}>
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
            const prodID = baseProductWithExistingSubProductNotOnboarded
              ? existingSubProductNotOnboarded.id
              : product.id;
            void getOnboardingStatus(prodID ?? '');
          }}
          buttonLabel={t('overview.notActiveProducts.joinButton')}
          urlPublic={product.urlPublic}
          product={product}
        />
      </Grid>
    </>
  );
}
