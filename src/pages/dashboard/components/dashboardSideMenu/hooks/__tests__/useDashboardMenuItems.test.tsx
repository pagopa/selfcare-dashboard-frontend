import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { Mock } from 'vitest';
import { partiesActions } from '../../../../../../redux/slices/partiesSlice';
import { createStore } from '../../../../../../redux/store';
import { getBillingToken } from '../../../../../../services/tokenExchangeService';
import { mockedParties } from '../../../../../../services/__mocks__/partyService';
import { useDashboardMenuItems } from '../useDashboardMenuItems';

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

vi.mock('../../../../../../services/tokenExchangeService', () => ({
  getBillingToken: vi.fn(),
}));

const party = mockedParties[0];
const partyId = party.partyId;

const allVisibleFlags = {
  isAddDelegateSectionVisible: true,
  isInvoiceSectionVisible: true,
  isHandleDelegationsVisible: true,
  isDocumentsSectionVisible: true,
};

const noneVisibleFlags = {
  isAddDelegateSectionVisible: false,
  isInvoiceSectionVisible: false,
  isHandleDelegationsVisible: false,
  isDocumentsSectionVisible: false,
};

const fullPermissions = [
  {
    productId: 'prod-io',
    actions: [
      'Selc:ListProductUsers',
      'Selc:ListAllProductUsers',
      'Selc:ListProductGroups',
      'Selc:ViewContract',
    ],
  },
];

type SetupOptions = {
  path?: string;
  flags?: typeof allVisibleFlags;
  permissions?: Array<{ productId: string; actions: Array<string> }>;
  withParty?: boolean;
};

const setup = ({
  path = `/dashboard/${partyId}`,
  flags = allVisibleFlags,
  permissions = fullPermissions,
  withParty = true,
}: SetupOptions = {}) => {
  const store = createStore();
  store.dispatch(setProductPermissions(permissions));
  store.dispatch(partiesActions.setPartySelected(party));
  const history = createMemoryHistory();
  history.push(path);
  const setDrawerOpen = vi.fn();
  const wrapper = ({ children }: PropsWithChildren) => (
    <Router history={history}>
      <Provider store={store}>{children}</Provider>
    </Router>
  );
  const { result } = renderHook(
    () =>
      useDashboardMenuItems({
        party: withParty ? party : undefined,
        ...flags,
        setDrawerOpen,
      }),
    { wrapper }
  );
  const item = (key: string) => {
    const found = result.current.find((i) => i.key === key);
    if (!found) {
      throw new Error(`menu item ${key} not found`);
    }
    return found;
  };
  return { result, store, history, setDrawerOpen, item };
};

const oldLocation = window.location;
const assignMock = vi.fn();

beforeAll(() => {
  // eslint-disable-next-line functional/immutable-data
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: { ...oldLocation, assign: assignMock },
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
});

const expectDocumentsNavigation = () => {
  const { item, history } = setup();
  act(() => item('documents').action());
  expect(trackEvent).toHaveBeenCalledWith('DASHBOARD_OPEN_DOCUMENT', { party_id: partyId });
  expect(history.location.pathname).toBe(`/dashboard/${partyId}/documents`);
};

describe('useDashboardMenuItems - institution user', () => {
  it('returns all the items when everything is visible', () => {
    const { result } = setup();
    expect(result.current.map((i) => i.key)).toEqual([
      'techpartner',
      'overview',
      'delegations',
      'documents',
      'users',
      'groups',
      'invoices',
    ]);
  });

  it('returns only the overview when no section is visible and no permission is granted', () => {
    const { result } = setup({ flags: noneVisibleFlags, permissions: [] });
    expect(result.current.map((i) => i.key)).toEqual(['overview']);
  });

  it('shows groups with the ListAllProductGroups permission only', () => {
    const { result } = setup({
      flags: noneVisibleFlags,
      permissions: [{ productId: 'prod-io', actions: ['Selc:ListAllProductGroups'] }],
    });
    expect(result.current.map((i) => i.key)).toEqual(['overview', 'groups']);
  });

  it('builds paths and marks the overview item as selected', () => {
    const { item } = setup();
    expect(item('overview').path).toBe(`/dashboard/${partyId}`);
    expect(item('overview').isSelected).toBe(true);
    expect(item('techpartner').path).toBe(`/dashboard/${partyId}/delegate`);
    expect(item('techpartner').isSelected).toBe(false);
    expect(item('invoices').path).toBe('#');
    expect(item('invoices').isSelected).toBe(false);
  });

  it('marks users as selected on nested users routes', () => {
    const { item } = setup({ path: `/dashboard/${partyId}/users/123` });
    expect(item('users').isSelected).toBe(true);
    expect(item('overview').isSelected).toBe(false);
  });

  it.each([
    ['techpartner', `/dashboard/${partyId}/delegate`],
    ['overview', `/dashboard/${partyId}`],
    ['delegations', `/dashboard/${partyId}/delegations`],
    ['users', `/dashboard/${partyId}/users`],
    ['groups', `/dashboard/${partyId}/groups`],
  ])('navigates to %s and closes the drawer', (key, expectedPath) => {
    const { item, history, setDrawerOpen } = setup({ path: '/dashboard' });
    act(() => item(key).action());
    expect(history.location.pathname).toBe(expectedPath);
    expect(setDrawerOpen).toHaveBeenCalledWith(false);
  });

  it('tracks the documents opening and navigates to documents', expectDocumentsNavigation);

  it('redirects to the billing url on invoice click', async () => {
    (getBillingToken as Mock).mockResolvedValue('https://billing.url');
    const { item, store } = setup();

    act(() => item('invoices').action());

    expect(getBillingToken).toHaveBeenCalledWith(partyId, undefined, expect.any(String));
    await waitFor(() => expect(assignMock).toHaveBeenCalledWith('https://billing.url'));
    await waitFor(() => expect(store.getState().appState.loading.result).toBe(false));
  });

  it('dispatches an error when the billing token cannot be retrieved', async () => {
    (getBillingToken as Mock).mockRejectedValue(new Error('billing error'));
    const { item, store } = setup();

    act(() => item('invoices').action());

    await waitFor(() =>
      expect(store.getState().appState.errors).toEqual([
        expect.objectContaining({
          id: expect.stringMatching(`^TokenExchangeInvoiceError-${partyId}`),
          toNotify: true,
        }),
      ])
    );
    expect(assignMock).not.toHaveBeenCalled();
  });

  it('uses an empty partyId when no party is given', async () => {
    (getBillingToken as Mock).mockResolvedValue('https://billing.url');
    const { item } = setup({ withParty: false });

    expect(item('overview').path).toBe('/dashboard/');
    act(() => item('invoices').action());
    expect(getBillingToken).toHaveBeenCalledWith('', undefined, expect.any(String));
    await waitFor(() => expect(assignMock).toHaveBeenCalled());
  });
});

describe('useDashboardMenuItems - PagoPA user', () => {
  beforeEach(() => {
    (isPagoPaUser as Mock).mockReturnValue(true);
  });

  it('returns the admin flow items outside the admin area', () => {
    const { result } = setup();
    expect(result.current.map((i) => i.key)).toEqual([
      'adminPage',
      'onboardings',
      'techpartner',
      'overview',
      'delegations',
      'documents',
      'users',
      'groups',
    ]);
  });

  it('hides the party sections inside the admin area', () => {
    const { result, item } = setup({ path: '/dashboard/admin/search' });
    expect(result.current.map((i) => i.key)).toEqual(['adminPage', 'onboardings']);
    expect(item('adminPage').isSelected).toBe(true);
    expect(item('onboardings').isSelected).toBe(false);
  });

  it('marks the onboardings item as selected on nested onboardings routes', () => {
    const { item } = setup({ path: '/dashboard/admin/onboardings/abc' });
    expect(item('onboardings').isSelected).toBe(true);
  });

  it('uses the ListAllProductUsers permission to show users', () => {
    const { result } = setup({
      flags: noneVisibleFlags,
      permissions: [{ productId: 'prod-io', actions: ['Selc:ListProductUsers'] }],
    });
    expect(result.current.map((i) => i.key)).toEqual(['adminPage', 'onboardings', 'overview']);
  });

  it('falls back to the onboarded institution id for the overview path without party', () => {
    const { item } = setup({ withParty: false });
    expect(item('overview').path).toBe('/dashboard/onboarded');
  });

  it('resets the selected party and navigates to the admin search', () => {
    const { item, store, history, setDrawerOpen } = setup();
    expect(store.getState().parties.selected).toBeDefined();

    act(() => item('adminPage').action());

    expect(store.getState().parties.selected).toBeUndefined();
    expect(history.location.pathname).toBe('/dashboard/admin/search');
    expect(setDrawerOpen).toHaveBeenCalledWith(false);
  });

  it.each([
    ['onboardings', '/dashboard/admin/onboardings'],
    ['techpartner', `/dashboard/${partyId}/delegate`],
    ['overview', `/dashboard/${partyId}`],
    ['delegations', `/dashboard/${partyId}/delegations`],
    ['users', `/dashboard/${partyId}/users`],
    ['groups', `/dashboard/${partyId}/groups`],
  ])('navigates to %s', (key, expectedPath) => {
    const { item, history } = setup({ path: '/dashboard' });
    act(() => item(key).action());
    expect(history.location.pathname).toBe(expectedPath);
  });

  it('tracks the documents opening and navigates to documents', expectDocumentsNavigation);
});
