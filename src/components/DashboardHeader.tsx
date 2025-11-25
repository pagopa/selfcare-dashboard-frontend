import { PartySwitchItem } from '@pagopa/mui-italia/dist/components/PartySwitch';
import { Header, SessionModal, usePermissions } from '@pagopa/selfcare-common-frontend/lib';
import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import { User } from '@pagopa/selfcare-common-frontend/lib/model/User';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { Actions, roleLabels } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
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
import { INTEROP_PRODUCT_ENUM, interopProductIdList } from '../utils/constants';
import { startWithProductInterop } from '../utils/helperFunctions';
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
  const [openExitModal, setOpenExitModal] = useState<boolean>(false);

  const actualActiveProducts = useRef<Array<Product>>([]);
  const actualSelectedParty = useRef<Party>();
  const [showDocBtn, setShowDocBtn] = useState(false);
  const { hasPermission } = usePermissions();

  useEffect(() => {
    if (isPagoPaUser) {
      setShowDocBtn(false);
      return;
    }
    setShowDocBtn(i18n.language === 'it');
  }, [i18n.language, isPagoPaUser]);

  const parties2Show = isPagoPaUser
    ? [party]
    : parties?.filter((party) => party.status === 'ACTIVE');

  const findAuthorizedProduct = (productId: string) =>
    party?.products.find(
      (p) =>
        p.productId === productId && hasPermission(p.productId, Actions.AccessProductBackoffice)
    );

  const authorizedInteropProducts = interopProductIdList
    .map(findAuthorizedProduct)
    .filter(Boolean)
    .map((p) => p?.productId ?? '');

  const hasMoreThanOneInteropEnv = authorizedInteropProducts.length > 1;

  const authorizedPartyProducts = party?.products.filter(
    (pp) =>
      pp.productOnBoardingStatus === 'ACTIVE' &&
      (hasPermission(pp.productId ?? '', Actions.AccessProductBackoffice) ||
        (hasMoreThanOneInteropEnv && pp.productId === INTEROP_PRODUCT_ENUM.INTEROP))
  );

  const activeProducts: Array<Product> = useMemo(
    () =>
      products?.filter((p) => authorizedPartyProducts?.some((op) => op.productId === p.id)) ?? [],
    [authorizedPartyProducts]
  );

  // eslint-disable-next-line functional/immutable-data
  actualActiveProducts.current = activeProducts;
  // eslint-disable-next-line functional/immutable-data
  actualSelectedParty.current = selectedParty;

  const lang = i18n.language;

  const pagoPaInstitution: PartySwitchItem = {
    id: 'pagoPA1231313',
    name: 'PagoPA S.p.A.',
    logoUrl: 'icons/icon-48x48.png',
    productRole: t('searchBackstagePage.supportRole'),
  };

  const fixedParty =
    isPagoPaUser && location.pathname?.includes('admin') ? pagoPaInstitution : undefined;

  return (
    <div>
      <Header
        onExit={onExit}
        onLogoutClick={() => setOpenExitModal(true)}
        withSecondHeader={!!party || !!fixedParty}
        selectedPartyId={selectedParty?.partyId}
        productsList={activeProducts
          .filter((p) =>
            startWithProductInterop(p.id) && hasMoreThanOneInteropEnv
              ? p.id === authorizedInteropProducts[0]
              : true
          )
          .map((p) => ({
            id: p.id,
            title: startWithProductInterop(p.id)
              ? products?.find((pp) => pp.id === INTEROP_PRODUCT_ENUM.INTEROP)?.title ?? ''
              : p.title,
            productUrl: p.urlPublic ?? '',
            linkType: p?.backOfficeEnvironmentConfigurations ? 'external' : 'internal',
          }))}
        partyList={
          parties2Show?.map((party) => ({
            id: party?.partyId ?? '',
            name: party?.description ?? '',
            productRole:
              isPagoPaUser && !location.pathname?.includes('admin')
                ? undefined
                : t(
                    roleLabels[(party?.userRole ?? 'ADMIN') as keyof typeof roleLabels].longLabelKey
                  ),
            logoUrl: party?.urlLogo,
            parentName: party?.parentDescription,
          })) ?? []
        }
        fixedParty={fixedParty}
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
        enableAssistanceButton={ENV.ENV !== 'UAT' && !isPagoPaUser}
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
              startWithProductInterop(p.id)
            ) {
              setOpenCustomEnvInteropModal(true);
            } else if (
              actualSelectedParty.current &&
              selectedProduct?.backOfficeEnvironmentConfigurations &&
              selectedProduct?.backOfficeEnvironmentConfigurations.length > 0
            ) {
              setOpenGenericEnvProductModal(true);
            } else if (selectedProduct && selectedProduct.id !== 'prod-selfcare') {
              void invokeProductBo(
                selectedProduct,
                actualSelectedParty.current as Party,
                undefined,
                lang
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
      <SessionModal
        open={openExitModal}
        title={t('exitModal.title')}
        message=""
        onConfirmLabel={t('exitModal.confirm')}
        onCloseLabel={t('exitModal.cancel')}
        handleClose={() => {
          setOpenExitModal(false);
        }}
        onConfirm={() => {
          setOpenExitModal(false);
          // window.location.assign(isPagoPaUser ? ENV.URL_FE.LOGIN_GOOGLE : ENV.URL_FE.LOGOUT);
          window.location.assign(ENV.URL_FE.LOGOUT);
        }}
      />
      <SessionModalInteropProduct
        open={openCustomEnvInteropModal}
        title={t('overview.activeProducts.activeProductsEnvModal.title')}
        message={
          <Trans
            i18nKey="overview.activeProducts.activeProductsEnvModal.message"
            values={{
              productTitle: startWithProductInterop(productSelected?.id)
                ? products?.find((pp) => pp.id === INTEROP_PRODUCT_ENUM.INTEROP)?.title
                : productSelected?.title,
            }}
            components={{ 1: <strong /> }}
          >
            {`Sei stato abilitato ad operare in entrambi gli ambienti. Ti ricordiamo che l’ambiente di collaudo ti permette di conoscere <1>{{productTitle}}</1> e fare prove in tutta sicurezza. L’ambiente di produzione è il prodotto in esercizio.`}
          </Trans>
        }
        onConfirmLabel={t('overview.activeProducts.activeProductsEnvModal.enterButton')}
        onCloseLabel={t('overview.activeProducts.activeProductsEnvModal.backButton')}
        onConfirm={() =>
          invokeProductBo(
            productSelected as Product,
            actualSelectedParty.current as Party,
            undefined,
            lang
          )
        }
        handleClose={() => {
          setOpenCustomEnvInteropModal(false);
        }}
        authorizedInteropProducts={authorizedInteropProducts}
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
            (e.target as HTMLInputElement).value,
            lang
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
