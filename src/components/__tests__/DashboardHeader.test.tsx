import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import i18n from 'i18next';
import { createMemoryHistory } from 'history';
import { Mock } from 'vitest';
import { ProductOnBoardingStatusEnum } from '../../api/generated/b4f-dashboard/OnboardedProductResource';
import { StatusEnum } from '../../api/generated/b4f-dashboard/SubProductResource';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { partiesActions } from '../../redux/slices/partiesSlice';
import { createStore } from '../../redux/store';
import { ENV } from '../../utils/env';
import { renderWithProviders } from '../../utils/test-utils';
import DashboardHeader from '../DashboardHeader';

const { headerProps, invokeProductBoMock } = vi.hoisted(() => ({
  headerProps: { current: undefined as any },
  invokeProductBoMock: vi.fn(),
}));

vi.mock('../../decorators/withParties');

vi.mock('../../hooks/useTokenExchange', () => ({
  useTokenExchange: () => ({ invokeProductBo: invokeProductBoMock }),
}));

vi.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', async (importOriginal) => ({
  ...(await importOriginal<any>()),
  isPagoPaUser: vi.fn(() => false),
}));

vi.mock(
  '@pagopa/selfcare-common-frontend/lib/services/analyticsService',
  async (importOriginal) => ({
    ...(await importOriginal<any>()),
    trackEvent: vi.fn(),
  })
);

vi.mock('@pagopa/selfcare-common-frontend/lib', async (importOriginal) => ({
  ...(await importOriginal<any>()),
  Header: (props: any) => {
    // eslint-disable-next-line functional/immutable-data
    headerProps.current = props;
    return (
      <div data-testid="header-mock">
        <button onClick={props.onLogoutClick}>logout</button>
        {props.onDocumentationClick && (
          <button onClick={props.onDocumentationClick}>documentation</button>
        )}
        {props.productsList.map((p: any) => (
          <button key={p.id} onClick={() => props.onSelectedProduct(p)}>
            {`product-${p.id}`}
          </button>
        ))}
        {props.partyList.map((p: any) => (
          <button key={p.id} onClick={() => props.onSelectedParty(p)}>
            {`party-${p.id}`}
          </button>
        ))}
      </div>
    );
  },
}));

const buildProduct = (id: string, overrides: Partial<Product> = {}): Product => ({
  id,
  title: `Title ${id}`,
  description: `Description ${id}`,
  logo: `logo-${id}`,
  urlBO: `https://bo.${id}.it`,
  urlPublic: `https://public.${id}.it`,
  status: StatusEnum.ACTIVE,
  imageUrl: '',
  delegable: false,
  ...overrides,
});

const products: Array<Product> = [
  buildProduct('prod-io'),
  buildProduct('prod-selfcare'),
  buildProduct('prod-pagopa', {
    backOfficeEnvironmentConfigurations: [{ environment: 'Collaudo', url: 'https://coll.it' }],
  }),
  buildProduct('prod-interop', { title: 'Interoperabilità' }),
  buildProduct('prod-interop-coll', { title: 'Interop collaudo' }),
  buildProduct('prod-pn'),
];

const onboarded = (productId: string, status = ProductOnBoardingStatusEnum.ACTIVE) => ({
  productId,
  productOnBoardingStatus: status,
  userRole: 'ADMIN',
});

const party: Party = {
  partyId: 'party-1',
  description: 'Comune di Test',
  registeredOffice: 'Via Roma 1',
  typology: 'PA',
  userRole: 'ADMIN',
  status: 'ACTIVE',
  products: [
    onboarded('prod-io'),
    onboarded('prod-selfcare'),
    onboarded('prod-pagopa'),
    onboarded('prod-interop'),
    onboarded('prod-interop-coll'),
    onboarded('prod-pn', ProductOnBoardingStatusEnum.PENDING),
  ],
};

const BO_ACTION = 'Selc:AccessProductBackoffice';
const BO_ADMIN_ACTION = 'Selc:AccessProductBackofficeAdmin';

const allPermissions = [
  { productId: 'prod-io', actions: [BO_ACTION] },
  { productId: 'prod-selfcare', actions: [BO_ACTION] },
  { productId: 'prod-pagopa', actions: [BO_ADMIN_ACTION] },
  { productId: 'prod-interop', actions: [BO_ACTION] },
  { productId: 'prod-interop-coll', actions: [BO_ACTION] },
  { productId: 'prod-pn', actions: [BO_ACTION] },
];

const loggedUser = {
  uid: 'uid-1',
  name: 'Mario',
  surname: 'Rossi',
  email: 'mario@rossi.it',
  taxCode: 'RSSMRA80A01H501U',
};

type SetupOptions = {
  path?: string;
  withParty?: boolean;
  permissions?: Array<{ productId: string; actions: Array<string> }>;
  withUser?: boolean;
  onExit?: (exitAction: () => void) => void;
};

const setup = ({
  path = '/dashboard/party-1',
  withParty = true,
  permissions = allPermissions,
  withUser = true,
  onExit = (exitAction) => exitAction(),
}: SetupOptions = {}) => {
  const store = createStore();
  const history = createMemoryHistory();
  history.push(path);
  if (withParty) {
    store.dispatch(partiesActions.setPartySelected(party));
    store.dispatch(partiesActions.setPartySelectedProducts(products));
  }
  store.dispatch(setProductPermissions(permissions));
  const onExitMock = vi.fn(onExit);
  const result = renderWithProviders(
    <DashboardHeader onExit={onExitMock} loggedUser={withUser ? loggedUser : undefined} />,
    store,
    history
  );
  return { ...result, onExitMock };
};

const oldLocation = window.location;
const assignMock = vi.fn();

beforeAll(() => {
  // eslint-disable-next-line functional/immutable-data
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: { ...oldLocation, assign: assignMock, pathname: '/dashboard' },
  });
});

afterAll(() => {
  // eslint-disable-next-line functional/immutable-data
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: oldLocation,
  });
});

beforeEach(() => {
  (isPagoPaUser as Mock).mockReturnValue(false);
  // eslint-disable-next-line functional/immutable-data
  headerProps.current = undefined;
});

describe('DashboardHeader', () => {
  it('passes the authorized active products and the active parties to the Header', async () => {
    setup();

    await screen.findByTestId('header-mock');
    const props = headerProps.current;

    expect(props.withSecondHeader).toBe(true);
    expect(props.selectedPartyId).toBe('party-1');
    expect(props.enableAssistanceButton).toBe(true);
    expect(props.fixedParty).toBeUndefined();
    expect(props.loggedUser).toEqual({
      id: 'uid-1',
      name: 'Mario',
      surname: 'Rossi',
      email: 'mario@rossi.it',
    });

    // pending product excluded, only the first interop env is shown with the base interop title
    expect(props.productsList.map((p: any) => p.id)).toEqual([
      'prod-io',
      'prod-selfcare',
      'prod-pagopa',
      'prod-interop',
    ]);
    expect(props.productsList.find((p: any) => p.id === 'prod-interop').title).toBe(
      'Interoperabilità'
    );
    expect(props.productsList.find((p: any) => p.id === 'prod-pagopa').linkType).toBe('external');
    expect(props.productsList.find((p: any) => p.id === 'prod-io').linkType).toBe('internal');

    // only ACTIVE parties from the parties list
    expect(props.partyList.length).toBeGreaterThan(0);
    expect(props.partyList.some((p: any) => p.id === '2')).toBe(false);
    expect(props.partyList.find((p: any) => p.id === '1').productRole).toBe(
      'common.roles.limited.longLabel'
    );
    expect(props.partyList.find((p: any) => p.id === '3').productRole).toBe(
      'common.roles.admin.longLabel'
    );
  });

  it('passes loggedUser=false and no second header when there is no user nor party', async () => {
    setup({ withUser: false, withParty: false });
    await screen.findByTestId('header-mock');

    expect(headerProps.current.loggedUser).toBe(false);
    expect(headerProps.current.withSecondHeader).toBe(false);
    expect(headerProps.current.productsList).toEqual([]);
  });

  it('hides the second header in the contract update wizard', async () => {
    setup({ path: '/dashboard/party-1/documents/prod-io/update-contract' });
    await screen.findByTestId('header-mock');
    expect(headerProps.current.withSecondHeader).toBe(false);
  });

  it('shows the interop products separately when only one interop env is authorized', async () => {
    setup({
      permissions: allPermissions.filter((p) => p.productId !== 'prod-interop-coll'),
    });
    await screen.findByTestId('header-mock');

    const ids = headerProps.current.productsList.map((p: any) => p.id);
    expect(ids).toContain('prod-interop');
    expect(ids).not.toContain('prod-interop-coll');
  });

  it('invokes the product back office for a product without environments', async () => {
    const { onExitMock } = setup();

    fireEvent.click(await screen.findByText('product-prod-io'));

    expect(onExitMock).toHaveBeenCalled();
    expect(invokeProductBoMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'prod-io' }),
      expect.objectContaining({ partyId: 'party-1' }),
      undefined,
      'it'
    );
  });

  it('does not invoke the back office for prod-selfcare', async () => {
    setup();
    fireEvent.click(await screen.findByText('product-prod-selfcare'));
    expect(invokeProductBoMock).not.toHaveBeenCalled();
  });

  it('opens the generic environment modal for products with back office environments', async () => {
    setup();

    fireEvent.click(await screen.findByText('product-prod-pagopa'));

    expect(await screen.findByText('In quale ambiente vuoi entrare?')).toBeInTheDocument();
    expect(invokeProductBoMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText('Ambiente di Produzione'));
    fireEvent.click(screen.getByRole('button', { name: 'Entra' }));
    expect(invokeProductBoMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'prod-pagopa' }),
      expect.objectContaining({ partyId: 'party-1' }),
      '',
      'it'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Annulla' }));
    await waitFor(() =>
      expect(screen.queryByText('In quale ambiente vuoi entrare?')).not.toBeInTheDocument()
    );
  });

  it('opens the interop environment modal when more than one interop env is authorized', async () => {
    setup();

    fireEvent.click(await screen.findByText('product-prod-interop'));

    expect(await screen.findByText('In quale ambiente vuoi entrare?')).toBeInTheDocument();
    expect(invokeProductBoMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText('Ambiente di Produzione'));
    fireEvent.click(screen.getByRole('button', { name: 'Entra' }));
    expect(invokeProductBoMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'prod-interop' }),
      expect.objectContaining({ partyId: 'party-1' }),
      undefined,
      'it'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Annulla' }));
    await waitFor(() =>
      expect(screen.queryByText('In quale ambiente vuoi entrare?')).not.toBeInTheDocument()
    );
  });

  it('does nothing until the exit action is confirmed', async () => {
    setup({ onExit: () => undefined });
    fireEvent.click(await screen.findByText('product-prod-io'));
    expect(invokeProductBoMock).not.toHaveBeenCalled();
  });

  it('tracks the party selection and navigates to the party dashboard', async () => {
    const { history } = setup();

    fireEvent.click(await screen.findByText('party-3'));

    expect(trackEvent).toHaveBeenCalledWith('DASHBOARD_PARTY_SELECTION', { party_id: '3' });
    expect(history.location.pathname).toBe('/dashboard/3');
  });

  it('opens the documentation when the language is italian', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    setup();

    fireEvent.click(await screen.findByText('documentation'));

    expect(trackEvent).toHaveBeenCalledWith('OPEN_OPERATIVE_MANUAL', { from: 'dashboard' });
    expect(openSpy).toHaveBeenCalledWith(ENV.URL_DOCUMENTATION, '_blank');
    openSpy.mockRestore();
  });

  it('does not show the documentation button when the language is not italian', async () => {
    await act(async () => {
      await i18n.changeLanguage('en');
    });
    try {
      setup();
      await screen.findByTestId('header-mock');
      expect(screen.queryByText('documentation')).not.toBeInTheDocument();
      expect(headerProps.current.onDocumentationClick).toBeUndefined();
    } finally {
      // the header is still mounted, so the language switch re-renders it
      await act(async () => {
        await i18n.changeLanguage('it');
      });
    }
  });

  it('opens the logout modal, closes it and confirms logout', async () => {
    setup();

    fireEvent.click(await screen.findByText('logout'));
    expect(
      await screen.findByText('Confermi di voler uscire da Area Riservata?')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Annulla' }));
    await waitFor(() =>
      expect(
        screen.queryByText('Confermi di voler uscire da Area Riservata?')
      ).not.toBeInTheDocument()
    );

    fireEvent.click(screen.getByText('logout'));
    fireEvent.click(await screen.findByRole('button', { name: 'Esci' }));
    expect(assignMock).toHaveBeenCalledWith(ENV.URL_FE.LOGOUT);
  });

  describe('PagoPA user', () => {
    beforeEach(() => {
      (isPagoPaUser as Mock).mockReturnValue(true);
    });

    it('shows only the selected party without role and disables assistance and docs', async () => {
      setup();
      await screen.findByTestId('header-mock');
      const props = headerProps.current;

      expect(props.partyList).toEqual([
        {
          id: 'party-1',
          name: 'Comune di Test',
          productRole: undefined,
          logoUrl: undefined,
          parentName: undefined,
        },
      ]);
      expect(props.enableAssistanceButton).toBe(false);
      expect(props.onDocumentationClick).toBeUndefined();
      expect(props.fixedParty).toBeUndefined();
    });

    it('uses the PagoPA fixed party and shows the role in the admin area', async () => {
      setup({ path: '/dashboard/admin/search', withParty: false });
      await screen.findByTestId('header-mock');
      const props = headerProps.current;

      expect(props.fixedParty).toEqual(
        expect.objectContaining({ id: 'pagoPA1231313', productRole: 'Supporto' })
      );
      expect(props.withSecondHeader).toBe(true);
      // no party selected: a single empty entry with the default ADMIN role label
      expect(props.partyList).toEqual([
        expect.objectContaining({ id: '', name: '', productRole: 'common.roles.admin.longLabel' }),
      ]);
    });

    it('shows the not integrated modal for products not allowed in backstage', async () => {
      setup();

      fireEvent.click(await screen.findByText('product-prod-io'));

      expect(
        await screen.findByText(
          'Il back-office non è ancora integrato in Area Riservata Backstage.'
        )
      ).toBeInTheDocument();
      expect(invokeProductBoMock).not.toHaveBeenCalled();

      fireEvent.click(screen.getByRole('button', { name: 'close' }));
      await waitFor(() =>
        expect(
          screen.queryByText('Il back-office non è ancora integrato in Area Riservata Backstage.')
        ).not.toBeInTheDocument()
      );
    });

    it('logs out through the google logout url', async () => {
      setup();

      fireEvent.click(await screen.findByText('logout'));
      expect(
        await screen.findByText('Confermi di voler uscire da Area Riservata Backstage?')
      ).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Esci' }));
      expect(assignMock).toHaveBeenCalledWith(`${ENV.URL_FE.LOGOUT}/google`);
    });
  });
});
