import { PartySwitchItem } from '@pagopa/mui-italia/dist/components/PartySwitch';
import { Header, SessionModal } from '@pagopa/selfcare-common-frontend';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { roleLabels } from '@pagopa/selfcare-common-frontend/utils/constants';
import SessionModalInteropProduct from '../pages/dashboardOverview/components/activeProductsSection/components/SessionModalInteropProduct';
import withParties, { WithPartiesProps } from '../decorators/withParties';
import { useTokenExchange } from '../hooks/useTokenExchange';
import { Product } from '../model/Product';
import { Party } from '../model/Party';
import { useAppSelector } from '../redux/hooks';
import { partiesSelectors } from '../redux/slices/partiesSlice';
import ROUTES, { DASHBOARD_ROUTES } from '../routes';
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

  const [openCustomEnvInteropModal, setOpenCustomEnvInteropModal] = useState<boolean>(false);
  const [openGenericEnvProductModal, setOpenGenericEnvProductModal] = useState<boolean>(false);

  const [productSelected, setProductSelected] = useState<Product>();
  const actualActiveProducts = useRef<Array<Product>>([]);
  const actualSelectedParty = useRef<Party>();

  const parties2Show = parties.filter((party) => party.status === 'ACTIVE');

  const onboardedPartyProducts = party?.products.filter(
    (pp) => pp.productOnBoardingStatus === 'ACTIVE' && pp.authorized
  );

  const activeProducts: Array<Product> = useMemo(
    () =>
      products?.filter((p) => onboardedPartyProducts?.some((op) => op.productId === p.id)) ?? [],
    [onboardedPartyProducts]
  );

  // eslint-disable-next-line functional/immutable-data
  actualActiveProducts.current = activeProducts;
  // eslint-disable-next-line functional/immutable-data
  actualSelectedParty.current = selectedParty;

  const prodInteropAndProdInteropColl =
    onboardedPartyProducts?.find(
      (p) => p.productId === 'prod-interop-coll' && p.authorized === true
    ) &&
    onboardedPartyProducts.find((p) => p.productId === 'prod-interop' && p.authorized === true);

  const prodInteropAndProdInteropAts =
    onboardedPartyProducts?.find(
      (p) => p.productId === 'prod-interop-att' && p.authorized === true
    ) &&
    onboardedPartyProducts.find((p) => p.productId === 'prod-interop' && p.authorized === true);

  return (
    <div tabIndex={0}>
      <Header
        onExit={onExit}
        withSecondHeader={!!party}
        selectedPartyId={selectedParty?.partyId}
        productsList={activeProducts
          .filter((p) =>
            prodInteropAndProdInteropColl
              ? p.id !== 'prod-interop-coll'
              : prodInteropAndProdInteropAts
              ? p.id !== 'prod-interop-att'
              : 'prod-interop'
          )
          .map((p) => ({
            id: p.id,
            title: p.title,
            productUrl: p.urlPublic ?? '',
            linkType: p?.backOfficeEnvironmentConfigurations ? 'external' : 'internal',
          }))}
        partyList={
          parties2Show.map((party) => ({
            id: party.partyId ?? '',
            name: party.description ?? '',
            productRole: t(roleLabels[party.userRole]?.longLabelKey),
            logoUrl: party.urlLogo,
            parentName: party.parentDescription,
          })) ?? []
        }
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
        enableAssistanceButton={ENV.ENV !== 'UAT'}
        assistanceEmail={ENV.ASSISTANCE.EMAIL}
        onDocumentationClick={() => {
          trackEvent('OPEN_OPERATIVE_MANUAL', {
            from: 'dashboard',
          });
          window.open(ENV.URL_DOCUMENTATION, '_blank');
        }}
        enableLogin={true}
        onSelectedProduct={(p) => {
          onExit(() => {
            const selectedProduct = actualActiveProducts.current.find((ap) => ap.id === p.id);
            setProductSelected(selectedProduct);
            if (
              actualSelectedParty.current &&
              (prodInteropAndProdInteropColl || prodInteropAndProdInteropAts) &&
              p.id === 'prod-interop'
            ) {
              setOpenCustomEnvInteropModal(true);
            } else if (
              actualSelectedParty.current &&
              selectedProduct?.backOfficeEnvironmentConfigurations
            ) {
              setOpenGenericEnvProductModal(true);
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
          onExit(() => {
            const redirectRoute = party?.delegation
              ? DASHBOARD_ROUTES.TECHPARTNER.path
              : ROUTES.PARTY_DASHBOARD.path;
            history.push(
              resolvePathVariables(redirectRoute, {
                partyId: selectedParty.id,
              })
            );
          });
        }}
        maxCharactersNumberMultiLineItem={25}
      />
      <SessionModalInteropProduct
        open={openCustomEnvInteropModal}
        title={t('overview.activeProducts.activeProductsEnvModal.title')}
        message={
          <Trans
            i18nKey="overview.activeProducts.activeProductsEnvModal.message"
            values={{ productTitle: productSelected?.title }}
            components={{ 1: <strong /> }}
          >
            {`Sei stato abilitato ad operare in entrambi gli ambienti. Ti ricordiamo che l’ambiente di collaudo ti permette di conoscere <1>{{productTitle}}</1> e fare prove in tutta sicurezza. L’ambiente di produzione è il prodotto in esercizio.`}
          </Trans>
        }
        onConfirmLabel={t('overview.activeProducts.activeProductsEnvModal.enterButton')}
        onCloseLabel={t('overview.activeProducts.activeProductsEnvModal.backButton')}
        onConfirm={() =>
          invokeProductBo(productSelected as Product, actualSelectedParty.current as Party)
        }
        handleClose={() => {
          setOpenCustomEnvInteropModal(false);
        }}
        prodInteropAndProdInteropColl={!!prodInteropAndProdInteropColl}
        prodInteropAndProdInteropAtt={!!prodInteropAndProdInteropAts}
        products={products}
        party={party}
      />
      <SessionModal
        open={openGenericEnvProductModal}
        title={t('overview.activeProducts.activeProductsEnvModal.title')}
        message={
          <Trans
            i18nKey="overview.activeProducts.activeProductsEnvModal.messageProduct"
            values={{ productTitle: productSelected?.title }}
            components={{ 1: <strong /> }}
          >
            {`L’ambiente di test ti permette di conoscere <1>{{productTitle}}</1> e fare prove in tutta sicurezza. L’ambiente di Produzione è il prodotto in esercizio effettivo.`}
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
          setOpenGenericEnvProductModal(false);
        }}
        productEnvironments={productSelected?.backOfficeEnvironmentConfigurations as any} // TODO Modify the prop expected type
      />
    </div>
  );
};
export default withParties(DashboardHeader);
