import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import i18n from 'i18next';
import { createStore } from '../../redux/store';
import { mockedParties } from '../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../services/__mocks__/productService';
import RemoteRoutingAdmin from '../admin/RemoteRoutingAdmin';
import RemoteRoutingGroups from '../groups/RemoteRoutingGroups';
import RemoteRoutingProductUsers from '../users/RemoteRoutingProductUsers';
import RemoteRoutingUsers from '../users/RemoteRoutingUsers';

const commonProps = {
  history: createMemoryHistory(),
  store: createStore(),
  theme,
  i18n,
};

const pageProps = {
  ...commonProps,
  decorators: {} as any,
  party: mockedParties[0],
  products: mockedPartyProducts,
  activeProducts: mockedPartyProducts,
  productsMap: {},
};

describe('Remote routing microcomponents', () => {
  test.each([
    ['RemoteRoutingUsers', RemoteRoutingUsers],
    ['RemoteRoutingProductUsers', RemoteRoutingProductUsers],
    ['RemoteRoutingGroups', RemoteRoutingGroups],
  ])('%s renders the lazy loaded remote', async (_name, RemoteComponent) => {
    render(
      <ThemeProvider theme={theme}>
        <RemoteComponent {...pageProps} />
      </ThemeProvider>
    );
    expect(await screen.findByTestId('federation-mock')).toBeInTheDocument();
  });

  test('RemoteRoutingAdmin renders the lazy loaded remote', async () => {
    render(
      <ThemeProvider theme={theme}>
        <RemoteRoutingAdmin {...(commonProps as any)} />
      </ThemeProvider>
    );
    expect(await screen.findByTestId('federation-mock')).toBeInTheDocument();
  });
});
