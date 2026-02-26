import { appStateReducer } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import { permissionsReducer } from '@pagopa/selfcare-common-frontend/redux/slices/permissionsSlice';
import { userReducer } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { LOG_REDUX_ACTIONS } from '../utils/constants';
import { partiesReducer } from './slices/partiesSlice';

const additionalMiddlewares = [LOG_REDUX_ACTIONS ? logger : undefined];

export const createStore = () =>
  configureStore({
    reducer: {
      parties: partiesReducer,
      user: userReducer,
      permissions: permissionsReducer,
      appState: appStateReducer,
    },
    middleware: (getDefaultMiddleware: any) =>
      additionalMiddlewares.reduce(
        (array, middleware) => (middleware ? array.concat(middleware) : array),
        getDefaultMiddleware({ serializableCheck: false })
      ),
  });

export const store = createStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
