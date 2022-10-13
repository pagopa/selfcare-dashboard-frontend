import { PartySwitchItem } from '@pagopa/mui-italia/dist/components/PartySwitch';
import { Header } from '@pagopa/selfcare-common-frontend';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { roleLabels } from '@pagopa/selfcare-common-frontend/utils/constants';
import withParties, { WithPartiesProps } from '../decorators/withParties';
import { useTokenExchange } from '../hooks/useTokenExchange';
import { Product } from '../model/Product';
import { Party } from '../model/Party';
import { useAppSelector } from '../redux/hooks';
import { partiesSelectors } from '../redux/slices/partiesSlice';
import ROUTES from '../routes';
import ChooseEnvironmentModal from '../pages/dashboardOverview/components/activeProductsSection/components/ChooseEnvironmentModal';
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

  const actualActiveProducts = useRef<Array<Product>>([]);
  const actualSelectedParty = useRef<Party>();

  const parties2Show = parties.filter((party) => party.status === 'ACTIVE');
  const activeProducts: Array<Product> = useMemo(
    () => products?.filter((p) => p.status === 'ACTIVE' && p.authorized) ?? [],
    [products]
  );

  // eslint-disable-next-line functional/immutable-data
  actualActiveProducts.current = activeProducts;
  // eslint-disable-next-line functional/immutable-data
  actualSelectedParty.current = selectedParty;

  return (
    <Header
      onExit={onExit}
      withSecondHeader={!!party}
      selectedPartyId={selectedParty?.partyId}
      productsList={activeProducts.map((p) => ({
        id: p.id,
        title: p.title,
        productUrl: p.urlPublic ?? '',
        linkType: 'internal',
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
          if (actualSelectedParty.current && selectedProduct?.backOfficeEnvironmentConfigurations) {
            ChooseEnvironmentModal(true, actualSelectedParty.current, selectedProduct);
          } else {
            invokeProductBo(
              selectedProduct as Product,
              actualSelectedParty.current as Party
            ).finally(() => console.log('end'));
          }
        });
      }}
      onSelectedParty={(selectedParty: PartySwitchItem) => {
        if (selectedParty) {
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
        }
      }}
      maxCharactersNumberMultiLineItem={25}
    />
  );
};
export default withParties(DashboardHeader);
