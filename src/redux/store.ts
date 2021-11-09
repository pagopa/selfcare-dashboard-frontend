import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { LOG_REDUX_ACTIONS } from '../utils/constants';
import { partiesReducer } from './slices/partiesSlice';
import { userReducer } from './slices/userSlice';

const additionalMiddlewares = [LOG_REDUX_ACTIONS ? logger : undefined];

export const createStore = () =>
  configureStore({
    reducer: {
      parties: partiesReducer,
      user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
      additionalMiddlewares.reduce(
        (array, middleware) => (middleware ? array.concat(middleware) : array),
        getDefaultMiddleware()
      ),
  });

export const store = createStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
