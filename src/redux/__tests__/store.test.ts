/* eslint-disable functional/no-let, functional/immutable-data */
describe('store', () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock('../../utils/constants');
  });

  test('createStore builds a store with all the reducers and no logger by default', async () => {
    const { createStore, store } = await import('../store');
    const state = createStore().getState();

    expect(Object.keys(state).sort()).toEqual(
      ['adminRoles', 'appState', 'parties', 'permissions', 'user'].sort()
    );
    expect(Object.keys(store.getState()).sort()).toEqual(Object.keys(state).sort());
  });

  test('adds redux-logger middleware when LOG_REDUX_ACTIONS is enabled', async () => {
    vi.doMock('../../utils/constants', async (importOriginal) => ({
      ...(await importOriginal<typeof import('../../utils/constants')>()),
      LOG_REDUX_ACTIONS: true,
    }));
    const groupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
    const groupCollapsedSpy = vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

    const { createStore } = await import('../store');
    const store = createStore();
    store.dispatch({ type: 'TEST_ACTION' });

    expect(
      groupSpy.mock.calls.length + groupCollapsedSpy.mock.calls.length + logSpy.mock.calls.length
    ).toBeGreaterThan(0);
    vi.restoreAllMocks();
  });
});
