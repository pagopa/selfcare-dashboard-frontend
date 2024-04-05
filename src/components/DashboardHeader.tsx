import { PartySwitchItem } from '@pagopa/mui-italia/dist/components/PartySwitch';
import { Header } from '@pagopa/selfcare-common-frontend';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { roleLabels } from '@pagopa/selfcare-common-frontend/utils/constants';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import withParties, { WithPartiesProps } from '../decorators/withParties';
import { useTokenExchange } from '../hooks/useTokenExchange';
import { Party } from '../model/Party';
import { Product } from '../model/Product';
import GenericEnvProductModal from '../pages/dashboardOverview/components/activeProductsSection/components/GenericEnvProductModal';
import SessionModalInteropProduct from '../pages/dashboardOverview/components/activeProductsSection/components/SessionModalInteropProduct';
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

  const [openCustomEnvInteropModal, setOpenCustomEnvInteropModal] = useState<boolean>(false);
  const [openGenericEnvProductModal, setOpenGenericEnvProductModal] = useState<boolean>(false);

  const [productSelected, setProductSelected] = useState<Product>();
  const actualActiveProducts = useRef<Array<Product>>([]);
  const actualSelectedParty = useRef<Party>();
  const [showDocBtn, setShowDocBtn] = useState(false);

  useEffect(() => {
    if (i18n.language === 'it') {
      setShowDocBtn(true);
    } else {
      setShowDocBtn(false);
    }
  }, [i18n.language]);

  const parties2Show = parties.filter((party) => party.status === 'ACTIVE');

  const authorizedProdInterop = party?.products.find(
    (p) => p.productId === 'prod-interop' && p.authorized === true
  );

  const authorizedProdAtst = party?.products?.find(
    (p) => p.productId === 'prod-interop-atst' && p.authorized === true
  );

  const authorizedProdColl = party?.products?.find(
    (p) => p.productId === 'prod-interop-coll' && p.authorized === true
  );

  const authorizedInteropProducts = [
    authorizedProdInterop,
    authorizedProdAtst,
    authorizedProdColl,
  ].filter((product) => product);

  const hasMoreThanOneInteropEnv = authorizedInteropProducts.length > 1;

  const onboardedPartyProducts = party?.products.filter(
    (pp) =>
      pp.productOnBoardingStatus === 'ACTIVE' &&
      (pp.authorized || (hasMoreThanOneInteropEnv && pp.productId === 'prod-interop'))
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

  return (
    <div tabIndex={0}>
      <Header
        onExit={onExit}
        withSecondHeader={!!party}
        selectedPartyId={selectedParty?.partyId}
        productsList={activeProducts
          .filter((p) =>
            hasMoreThanOneInteropEnv
              ? p.id !== 'prod-interop-coll' && p.id !== 'prod-interop-atst'
              : true
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
        onDocumentationClick={
          showDocBtn
            ? () => {
                trackEvent('OPEN_OPERATIVE_MANUAL', {
                  from: 'dashboard',
                });
                window.open(ENV.URL_DOCUMENTATION, '_blank');
              }
            : undefined
        }
        enableLogin={true}
        onSelectedProduct={(p) => {
          onExit(() => {
            const selectedProduct = actualActiveProducts.current.find((ap) => ap.id === p.id);
            setProductSelected(selectedProduct);
            if (
              actualSelectedParty.current &&
              hasMoreThanOneInteropEnv &&
              p.id.startsWith('prod-interop')
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
            history.push(
              resolvePathVariables(ROUTES.PARTY_DASHBOARD.path, {
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
        authorizedProdInterop={!!authorizedProdInterop}
        authorizedProdColl={!!authorizedProdColl}
        authorizedProdAtst={!!authorizedProdAtst}
        products={products}
        party={party}
      />
      <GenericEnvProductModal
        open={openGenericEnvProductModal}
        title={t('overview.activeProducts.activeProductsEnvModal.title')}
        message={
          <Trans
            i18nKey="overview.activeProducts.activeProductsEnvModal.message"
            values={{ productTitle: productSelected?.title }}
            components={{ 1: <strong /> }}
          >
            {`Sei stato abilitato ad operare negli ambienti riportati di seguito per il prodotto <1>{{productTitle}}</1>.`}
          </Trans>
        }
        onConfirmLabel={t('overview.activeProducts.activeProductsEnvModal.enterButton')}
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
