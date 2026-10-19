/* eslint-disable functional/no-let, functional/immutable-data */
import { BaseParty, Party } from '../../../model/Party';
import { Product } from '../../../model/Product';
import { ProductRolesLists } from '../../../model/ProductRole';
import { createStore } from '../../store';
import { partiesActions, partiesSelectors } from '../partiesSlice';

const cacheBusted = (url: string) => {
  const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escapedUrl}[?&]t=\\d+$`);
};

const rolesLists = { list: [] } as unknown as ProductRolesLists;

describe('partiesSlice', () => {
  test('initial state selectors return defaults', () => {
    const state = createStore().getState();

    expect(partiesSelectors.selectPartiesList(state)).toBeUndefined();
    expect(partiesSelectors.selectPartySelected(state)).toBeUndefined();
    expect(partiesSelectors.selectPartySelectedLogo(state)).toBeUndefined();
    expect(partiesSelectors.selectPartySelectedProducts(state)).toBeUndefined();
    expect(partiesSelectors.selectPartySelectedProductsRolesMap(state)).toEqual({});
    expect(partiesSelectors.selectPartySelectedProductRoles(state, 'prod-io')).toBeUndefined();
    expect(partiesSelectors.selectPartySelectedInstitutionTypes(state)).toEqual([]);
  });

  test('setPartiesList adds a cache buster only to parties having a logo', () => {
    const store = createStore();
    store.dispatch(
      partiesActions.setPartiesList([
        { partyId: '1', urlLogo: 'https://logo/1.png' },
        { partyId: '2' },
      ] as Array<BaseParty>)
    );

    const list = partiesSelectors.selectPartiesList(store.getState()) as Array<BaseParty>;
    expect(list[0].urlLogo).toMatch(cacheBusted('https://logo/1.png'));
    expect(list[1].urlLogo).toBeUndefined();
  });

  test('setPartySelected stores the party, its logo and resets the roles map', () => {
    const store = createStore();
    store.dispatch(partiesActions.setPartySelectedProductsRolesMap({ 'prod-io': rolesLists }));

    store.dispatch(
      partiesActions.setPartySelected({ partyId: '1', urlLogo: 'https://logo/1.png' } as Party)
    );

    let state = store.getState();
    expect(partiesSelectors.selectPartySelected(state)?.partyId).toBe('1');
    expect(partiesSelectors.selectPartySelectedLogo(state)).toMatch(
      cacheBusted('https://logo/1.png')
    );
    expect(partiesSelectors.selectPartySelectedProductsRolesMap(state)).toEqual({});

    store.dispatch(partiesActions.setPartySelected({ partyId: '2' } as Party));
    state = store.getState();
    expect(partiesSelectors.selectPartySelectedLogo(state)).toBeUndefined();

    store.dispatch(partiesActions.setPartySelected(undefined));
    expect(partiesSelectors.selectPartySelected(store.getState())).toBeUndefined();
  });

  test('setPartySelectedPartyLogo updates the logo url with a cache buster', () => {
    const store = createStore();
    store.dispatch(partiesActions.setPartySelectedPartyLogo('https://logo/new.png?v=1'));
    expect(partiesSelectors.selectPartySelectedLogo(store.getState())).toMatch(
      cacheBusted('https://logo/new.png?v=1')
    );

    store.dispatch(partiesActions.setPartySelectedPartyLogo(undefined));
    expect(partiesSelectors.selectPartySelectedLogo(store.getState())).toBeUndefined();
  });

  test('setPartySelectedProducts stores the products', () => {
    const store = createStore();
    const products = [{ id: 'prod-io' }] as Array<Product>;
    store.dispatch(partiesActions.setPartySelectedProducts(products));
    expect(partiesSelectors.selectPartySelectedProducts(store.getState())).toEqual(products);
  });

  test('addPartySelectedProductRoles initializes and merges the roles map', () => {
    const store = createStore();
    store.dispatch(partiesActions.addPartySelectedProductRoles({ 'prod-io': rolesLists }));
    store.dispatch(partiesActions.addPartySelectedProductRoles({ 'prod-pn': rolesLists }));

    const state = store.getState();
    expect(Object.keys(partiesSelectors.selectPartySelectedProductsRolesMap(state))).toEqual([
      'prod-io',
      'prod-pn',
    ]);
    expect(partiesSelectors.selectPartySelectedProductRoles(state, 'prod-pn')).toEqual(rolesLists);
    expect(partiesSelectors.selectPartySelectedProductRoles(state, 'missing')).toBeUndefined();
  });

  test('selectPartySelectedInstitutionTypes filters undefined values', () => {
    const store = createStore();
    store.dispatch(partiesActions.setPartySelectedInstitutionTypes(['PA', undefined, 'GSP']));
    expect(partiesSelectors.selectPartySelectedInstitutionTypes(store.getState())).toEqual([
      'PA',
      'GSP',
    ]);
  });
});
