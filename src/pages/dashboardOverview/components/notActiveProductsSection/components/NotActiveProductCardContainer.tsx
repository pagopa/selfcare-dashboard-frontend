import { Grid } from '@mui/material';
import { useUserNotify } from '@pagopa/selfcare-common-frontend';
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
  const addNotify = useUserNotify();
  return (
    <Grid item xs={6} lg={4} xl={3} key={product.id}>
      <NotActiveProductCard
        image={product.imageUrl}
        urlLogo={product.logo}
        title={product.title}
        description={product.description}
        disableBtn={false}
        btnAction={() => {
          if (product.status === 'PENDING') {
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
  );
}
