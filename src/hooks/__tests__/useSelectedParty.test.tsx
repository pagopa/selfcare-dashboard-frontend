/* eslint-disable functional/no-let, functional/immutable-data */
import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import type { Mock } from 'vitest';
import { BaseParty, Party } from '../../model/Party';
import { partiesActions } from '../../redux/slices/partiesSlice';
import { createStore } from '../../redux/store';
import { mockedParties } from '../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../services/__mocks__/productService';
import { fetchPartyDetails } from '../../services/partyService';
import { fetchProducts } from '../../services/productService';
import { useSelectedParty } from '../useSelectedParty';

vi.mock('../../services/partyService', () => ({ fetchPartyDetails: vi.fn() }));
vi.mock('../../services/productService', () => ({ fetchProducts: vi.fn() }));
vi.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', async (importOriginal) => {
  const actual: any = await importOriginal();
  return { ...actual, isPagoPaUser: vi.fn(() => false) };
});

const party = mockedParties[0];

const renderUseSelectedParty = (store: ReturnType<typeof createStore>) =>
  renderHook(() => useSelectedParty(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    ),
  });

const storeWithParties = (parties: Array<BaseParty>) => {
  const store = createStore();
  store.dispatch(partiesActions.setPartiesList(parties));
  return store;
};

beforeEach(() => {
  vi.clearAllMocks();
  (isPagoPaUser as Mock).mockReturnValue(false);
  (fetchPartyDetails as Mock).mockResolvedValue(party);
  (fetchProducts as Mock).mockResolvedValue(mockedPartyProducts);
});

describe('useSelectedParty', () => {
  test('fetches party and products and stores them with permissions and institution types', async () => {
    const store = storeWithParties([
      { ...party, status: 'ACTIVE', userRole: 'ADMIN' } as BaseParty,
    ]);
    const { result } = renderUseSelectedParty(store);

    let value: any;
    await act(async () => {
      value = await result.current.fetchSelectedParty(party.partyId);
    });

    expect(value).toEqual([party, mockedPartyProducts]);
    const state = store.getState();
    expect(state.parties.selected).toEqual({ ...party, status: 'ACTIVE', userRole: 'ADMIN' });
    expect(state.parties.selectedProducts).toEqual(mockedPartyProducts);
    expect(state.permissions.productPermissions.length).toBe(
      party.products.filter((p) => p.productOnBoardingStatus === 'ACTIVE').length
    );
    expect(state.parties.selectedPartyInstitutionTypes?.length).toBe(
      party.products.filter((p) => p.productOnBoardingStatus === 'ACTIVE').length
    );
  });

  test('uses the fetched party status for PagoPA users', async () => {
    (isPagoPaUser as Mock).mockReturnValue(true);
    const pagoPaParty = { ...party, status: 'SUSPENDED', userRole: 'LIMITED' } as Party;
    (fetchPartyDetails as Mock).mockResolvedValue(pagoPaParty);
    const store = createStore();
    const { result } = renderUseSelectedParty(store);

    await act(async () => {
      await result.current.fetchSelectedParty(party.partyId);
    });

    expect(store.getState().parties.selected?.status).toBe('SUSPENDED');
    expect(store.getState().parties.selected?.userRole).toBe('LIMITED');
  });

  test('rejects and clears the selection when the party is not active', async () => {
    const store = storeWithParties([{ ...party, status: 'SUSPENDED' } as BaseParty]);
    const { result } = renderUseSelectedParty(store);

    await act(async () => {
      await expect(result.current.fetchSelectedParty(party.partyId)).rejects.toThrow(
        'INVALID_PARTY_STATE_SUSPENDED'
      );
    });
    expect(store.getState().parties.selected).toBeUndefined();
    expect(store.getState().parties.selectedProducts).toBeUndefined();
  });

  test('rejects when the party cannot be found', async () => {
    (fetchPartyDetails as Mock).mockResolvedValue(null);
    const { result } = renderUseSelectedParty(createStore());

    await act(async () => {
      await expect(result.current.fetchSelectedParty('missing')).rejects.toThrow(
        'Cannot find partyId missing'
      );
    });
  });

  test('rejects when products cannot be found', async () => {
    (fetchProducts as Mock).mockResolvedValue(null);
    const { result } = renderUseSelectedParty(
      storeWithParties([{ ...party, status: 'ACTIVE' } as BaseParty])
    );

    await act(async () => {
      await expect(result.current.fetchSelectedParty(party.partyId)).rejects.toThrow(
        'Cannot find products of partyId'
      );
    });
  });

  test('returns the already selected party without fetching again', async () => {
    const store = createStore();
    store.dispatch(partiesActions.setPartySelected(party));
    const { result } = renderUseSelectedParty(store);

    let value: any;
    await act(async () => {
      value = await result.current.fetchSelectedParty(party.partyId);
    });

    expect(value).toEqual([party, []]);
    expect(fetchPartyDetails).not.toHaveBeenCalled();
    expect(fetchProducts).not.toHaveBeenCalled();
  });

  test('restores the party permissions when re-entering the cached party', async () => {
    // e.g. a PagoPA user going back to the party after the admin area loaded admin-wide permissions
    const store = createStore();
    store.dispatch(partiesActions.setPartySelected(party));
    store.dispatch(
      setProductPermissions([{ productId: 'ALL', actions: ['Selc:ListAllProductUsers'] }])
    );
    const { result } = renderUseSelectedParty(store);

    await act(async () => {
      await result.current.fetchSelectedParty(party.partyId);
    });

    expect(fetchPartyDetails).not.toHaveBeenCalled();
    expect(store.getState().permissions.productPermissions).toEqual(
      party.products
        .filter((p) => p.productOnBoardingStatus === 'ACTIVE')
        .map((p) => ({ productId: p.productId, actions: [...(p.userProductActions ?? [])] }))
    );
  });

  test('keeps the cached roles of the products when switching party', async () => {
    const store = storeWithParties([{ ...party, status: 'ACTIVE' } as BaseParty]);
    store.dispatch(partiesActions.setPartySelected({ ...mockedParties[1] }));
    const cachedRoles = { list: [] } as any;
    store.dispatch(
      partiesActions.setPartySelectedProductsRolesMap({ [mockedPartyProducts[0].id]: cachedRoles })
    );
    const { result } = renderUseSelectedParty(store);

    await act(async () => {
      await result.current.fetchSelectedParty(party.partyId);
    });

    expect(store.getState().parties.selectedProductsRolesMap).toEqual({
      [mockedPartyProducts[0].id]: cachedRoles,
    });
  });
});
