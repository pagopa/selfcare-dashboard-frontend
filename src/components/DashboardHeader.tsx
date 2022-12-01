import { PartySwitchItem } from '@pagopa/mui-italia/dist/components/PartySwitch';
import { Header, SessionModal } from '@pagopa/selfcare-common-frontend';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { roleLabels } from '@pagopa/selfcare-common-frontend/utils/constants';
import withParties, { WithPartiesProps } from '../decorators/withParties';
import { useTokenExchange } from '../hooks/useTokenExchange';
import { Product } from '../model/Product';
import { Party } from '../model/Party';
import { useAppSelector } from '../redux/hooks';
import { partiesSelectors } from '../redux/slices/partiesSlice';
import ROUTES from '../routes';
import { ENV } from './../utils/env';

type Props = WithPartiesProps & {
  onExit: (exitAction: () => void) => void;
  loggedUser?: User;
};

const DashboardHeader = ({ onExit, loggedUser, parties }: Props) => {
  const { invokeProductBo } = useTokenExchange();
  const { t } = useTranslation();
  const history = useHistory();

  const party = useAppSelector(partiesSelectors.selectPartySelected);
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

  const [openEnvironmentModal, setOpenEnvironmentModal] = useState<boolean>(false);
  const [productSelected, setProductSelected] = useState<Product>();
  const actualActiveProducts = useRef<Array<Product>>([]);
  const actualSelectedParty = useRef<Party>();

  const parties2Show = parties.filter((party) => party.status === 'ACTIVE');
  const activeProducts: Array<Product> = useMemo(
    () => products?.filter((p) => p.productOnBoardingStatus === 'ACTIVE' && p.authorized) ?? [],
    [products]
  );

  // eslint-disable-next-line functional/immutable-data
  actualActiveProducts.current = activeProducts;
  // eslint-disable-next-line functional/immutable-data
  actualSelectedParty.current = selectedParty;

  return (
    <div tabIndex={0}>
      <Header
        onExit={onExit}
        withSecondHeader={!!party}
        selectedPartyId={selectedParty?.partyId}
        productsList={activeProducts.map((p) => ({
          id: p.id,
          title: p.title,
          productUrl: p.urlPublic ?? '',
          linkType: p?.backOfficeEnvironmentConfigurations ? 'external' : 'internal',
        }))}
        partyList={parties2Show.map((party) => ({
          id: party.partyId,
          name: party.description,
          productRole: t(roleLabels[party.userRole].longLabelKey),
          logoUrl: party.urlLogo,
        }))}
        loggedUser={
          loggedUser
            ? {
                id: loggedUser ? loggedUser.uid : '',
                name: loggedUser?.name,
                surname: loggedUser?.surname,
                email: loggedUser?.email,
              }
            : false
        }
        assistanceEmail={ENV.ASSISTANCE.EMAIL}
        enableLogin={true}
        onSelectedProduct={(p) => {
          onExit(() => {
            const selectedProduct = actualActiveProducts.current.find((ap) => ap.id === p.id);
            setProductSelected(selectedProduct);
            if (
              actualSelectedParty.current &&
              selectedProduct?.backOfficeEnvironmentConfigurations
            ) {
              setOpenEnvironmentModal(true);
            } else if (selectedProduct && selectedProduct.id !== 'prod-selfcare') {
              void invokeProductBo(
                selectedProduct as Product,
                actualSelectedParty.current as Party
              );
            }
          });
        }}
        onSelectedParty={(selectedParty: PartySwitchItem) => {
          trackEvent('DASHBOARD_PARTY_SELECTION', {
            party_id: selectedParty.id,
          });
          onExit(() =>
            history.push(
              resolvePathVariables(ROUTES.PARTY_DASHBOARD.path, {
                partyId: selectedParty.id,
              })
            )
          );
        }}
        maxCharactersNumberMultiLineItem={25}
      />
      <SessionModal
        open={openEnvironmentModal}
        title={t('overview.activeProducts.activeProductsEnvModal.title')}
        message={
          <Trans i18nKey="overview.activeProducts.activeProductsEnvModal.message">
            L’ambiente di test ti permette di conoscere
            <strong>{{ productTitle: productSelected?.title }}</strong> e fare prove in tutta
            sicurezza. L’ambiente di produzione è il prodotto vero e proprio.
          </Trans>
        }
        onConfirmLabel={t('overview.activeProducts.activeProductsEnvModal.envProdButton')}
        onCloseLabel={t('overview.activeProducts.activeProductsEnvModal.backButton')}
        onConfirm={(e) =>
          invokeProductBo(
            productSelected as Product,
            actualSelectedParty.current as Party,
            (e.target as HTMLInputElement).value
          )
        }
        handleClose={() => {
          setOpenEnvironmentModal(false);
        }}
        productEnvironments={productSelected?.backOfficeEnvironmentConfigurations}
      />
    </div>
  );
};
export default withParties(DashboardHeader);
