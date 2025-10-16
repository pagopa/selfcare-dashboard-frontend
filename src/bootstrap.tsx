import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import '@pagopa/selfcare-common-frontend/index.css';
import LoadingOverlay from '@pagopa/selfcare-common-frontend/lib/components/Loading/LoadingOverlay';
import { CONFIG } from '@pagopa/selfcare-common-frontend/lib/config/env';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './consentAndAnalyticsConfiguration';
import './index.css';
import './locale';
import { store } from './redux/store';
import reportWebVitals from './reportWebVitals';
import { MOCK_USER } from './utils/constants';
import { ENV } from './utils/env';

const onSuccessEncoded = encodeURIComponent(location.pathname + location.search);

// eslint-disable-next-line functional/immutable-data
CONFIG.MOCKS.MOCK_USER = MOCK_USER;
// eslint-disable-next-line functional/immutable-data
CONFIG.URL_FE.LOGIN = `${ENV.URL_FE.LOGIN}/login?onSuccess=` + onSuccessEncoded;
// eslint-disable-next-line functional/immutable-data
CONFIG.URL_FE.LOGOUT = ENV.URL_FE.LOGOUT;
// eslint-disable-next-line functional/immutable-data
CONFIG.URL_FE.ASSISTANCE = ENV.URL_FE.ASSISTANCE;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
          <LoadingOverlay />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
