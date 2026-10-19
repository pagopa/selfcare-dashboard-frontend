import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, Switch } from 'react-router-dom';
import { mockedParties } from '../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../services/__mocks__/productService';
import { buildRoutes, getButtonText, reduceDecorators } from '../dashboard-utils';

const t = (key: string) => `t:${key}`;

describe('getButtonText', () => {
  it.each([
    ['/dashboard/admin/onboardings', 'overview.sideMenu.institutionManagement.onboardings.title'],
    ['/dashboard/1/users', 'overview.sideMenu.institutionManagement.referents.title'],
    ['/dashboard/1/groups', 'overview.sideMenu.institutionManagement.groups.title'],
    ['/dashboard/1/delegations', 'overview.sideMenu.institutionManagement.delegations.title'],
    ['/dashboard/1/delegate', 'overview.ptPage.title'],
    ['/dashboard/1/documents', 'overview.sideMenu.institutionManagement.documents.title'],
    ['/dashboard/admin/search', 'overview.sideMenu.institutionManagement.adminPage.title'],
    ['/dashboard/1', 'overview.sideMenu.institutionManagement.overview.title'],
  ])('returns the right label for %s', (pathname, key) => {
    expect(getButtonText(pathname, t)).toBe(`t:${key}`);
  });
});

describe('reduceDecorators', () => {
  const Component = () => null;
  const tag = (name: string) =>
    vi.fn((Wrapped: React.ComponentType<any>) =>
      Object.assign(() => null, { inner: Wrapped, decorator: name })
    );

  it('returns the component untouched when the route requests no decorator', () => {
    const decorators = {
      withProductRolesMap: tag('rolesMap'),
      withSelectedProduct: tag('product'),
      withSelectedProductRoles: tag('productRoles'),
    };
    const result = reduceDecorators(decorators, { path: '/x' } as any)(Component);
    expect(result).toBe(Component);
    expect(decorators.withProductRolesMap).not.toHaveBeenCalled();
  });

  it('applies only the requested decorators in a stable order', () => {
    const decorators = {
      withProductRolesMap: tag('rolesMap'),
      withSelectedProduct: tag('product'),
      withSelectedProductRoles: tag('productRoles'),
    };
    const result: any = reduceDecorators(decorators, {
      path: '/x',
      withProductRolesMap: true,
      withSelectedProduct: true,
    } as any)(Component);

    expect(decorators.withSelectedProductRoles).not.toHaveBeenCalled();
    // outermost decorator is the last one in the chain
    expect(result.decorator).toBe('product');
    expect(result.inner.decorator).toBe('rolesMap');
    expect(result.inner.inner).toBe(Component);
  });
});

describe('buildRoutes', () => {
  const identity = (C: React.ComponentType<any>) => C;
  const decorators = {
    withProductRolesMap: identity,
    withSelectedProduct: identity,
    withSelectedProductRoles: identity,
  };
  const Page = ({ party }: any) => <div>{`page of ${party.description}`}</div>;
  const Child = () => <div>child page</div>;

  const routes = {
    PARENT: {
      path: '/dashboard/:partyId/parent',
      exact: false,
      subRoutes: {
        CHILD: { path: '/dashboard/:partyId/parent/child', exact: true, component: Child },
      },
    },
    PAGE: { path: '/dashboard/:partyId', exact: true, component: Page, withProductRolesMap: true },
  } as any;

  const renderAt = (path: string) => {
    const history = createMemoryHistory();
    history.push(path);
    render(
      <Router history={history}>
        <Switch>
          {buildRoutes(
            mockedParties[0],
            mockedPartyProducts,
            mockedPartyProducts,
            {},
            decorators,
            routes
          )}
        </Switch>
      </Router>
    );
  };

  it('renders the decorated component passing the party', () => {
    renderAt('/dashboard/1');
    expect(screen.getByText(`page of ${mockedParties[0].description}`)).toBeInTheDocument();
  });

  it('renders nested sub routes of a route without component', () => {
    renderAt('/dashboard/1/parent/child');
    expect(screen.getByText('child page')).toBeInTheDocument();
  });
});
