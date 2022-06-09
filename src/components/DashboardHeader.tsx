import { PartySwitchItem } from '@pagopa/mui-italia/dist/components/PartySwitch';
import { Header } from '@pagopa/selfcare-common-frontend';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import withParties, { WithPartiesProps } from '../decorators/withParties';
import { useTokenExchange } from '../hooks/useTokenExchange';
import { Product } from '../model/Product';
import { Party } from '../model/Party';
import { useAppSelector } from '../redux/hooks';
import { partiesSelectors } from '../redux/slices/partiesSlice';
import ROUTES from '../routes';

type Props = WithPartiesProps & {
  onExit: (exitAction: () => void) => void;
  loggedUser?: User;
};

const DashboardHeader = ({ onExit, loggedUser, parties }: Props) => {
  const history = useHistory();
  const party = useAppSelector(partiesSelectors.selectPartySelected);
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const parties2Show = parties.filter(
    (party) => party.status === 'ACTIVE' && party.partyId !== selectedParty?.partyId
  );
  const activeProducts: Array<Product> = useMemo(
    () => products?.filter((p) => p.status === 'ACTIVE' && p.authorized) ?? [],
    [products]
  );

  const { invokeProductBo } = useTokenExchange();

  return (
    <Header
      onExit={onExit}
      withSecondHeader={!!party}
      productsList={activeProducts.map((p) => ({
        id: p.id,
        title: p.title,
        productUrl: p.urlPublic ?? '',
        linkType: 'internal',
      }))}
      partyList={parties2Show.map((party) => ({
        id: party.partyId,
        name: party.description,
        productRole: '',
        logoUrl: party.urlLogo,
      }))}
      loggedUser={{
        id: loggedUser ? loggedUser.uid : '',
        name: loggedUser?.name,
        surname: loggedUser?.surname,
        email: loggedUser?.email,
      }}
      assistanceEmail="assistance@selfcare.it"
      enableLogin={true}
      onSelectedProduct={(p) =>
        invokeProductBo(activeProducts.find((ap) => ap.id === p.id) as Product, party as Party)
      }
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
    />
  );
};
export default withParties(DashboardHeader);
