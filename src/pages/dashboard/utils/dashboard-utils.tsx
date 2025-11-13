// src/pages/dashboard/dashboard.utils.ts
import React from 'react';
import { Route } from 'react-router';
import { Party } from '../../../model/Party';
import { Product, ProductsMap } from '../../../model/Product';
import { RouteConfig, RoutesObject } from '../../../routes';

/**
 * Decorators shape used in the Dashboard
 */
export type DashboardDecoratorsType = {
  withProductRolesMap: (WrappedComponent: React.ComponentType<any>) => React.ComponentType<any>;
  withSelectedProduct: (WrappedComponent: React.ComponentType<any>) => React.ComponentType<any>;
  withSelectedProductRoles: (
    WrappedComponent: React.ComponentType<any>
  ) => React.ComponentType<any>;
};

/**
 * Apply configured decorators in a stable order only when route requests them.
 */
export const reduceDecorators = (
  decorators: DashboardDecoratorsType,
  route: RouteConfig
): ((WrappedComponent: React.ComponentType<any>) => React.ComponentType<any>) =>
  ['withProductRolesMap', 'withSelectedProductRoles', 'withSelectedProduct'].reduce(
    (out, decorator) =>
      (route as any)[decorator]
        ? (WrappedComponent: React.ComponentType<any>) =>
            (decorators as any)[decorator](out(WrappedComponent))
        : out,
    (WrappedComponent: React.ComponentType<any>) => WrappedComponent
  );

/**
 * Compute top button text for mobile collapsed side menu.
 * - t is react-i18next translation function
 */
export const getButtonText = (pathname: string, t: (key: string) => string): string => {
  const pathMap: Record<string, string> = {
    users: 'overview.sideMenu.institutionManagement.referents.title',
    groups: 'overview.sideMenu.institutionManagement.groups.title',
    delegations: 'overview.sideMenu.institutionManagement.delegations.title',
    delegate: 'overview.ptPage.title',
    documents: 'overview.sideMenu.institutionManagement.documents.title',
    search: 'overview.sideMenu.institutionManagement.adminPage.title',
  };

  const key = Object.keys(pathMap).find((key) => pathname.includes(key));
  return key ? t(pathMap[key]) : t('overview.sideMenu.institutionManagement.overview.title');
};

/**
 * Recursively build <Route /> elements from the routes object.
 * This mirrors the original logic but lives here as a pure renderer helper.
 */
export const buildRoutes = (
  party: Party,
  products: Array<Product>,
  activeProducts: Array<Product>,
  productsMap: ProductsMap,
  decorators: DashboardDecoratorsType,
  rs: RoutesObject
) =>
  Object.values(rs).map((route, i) => {
    const { path, exact, component: Component, subRoutes } = route;
    const decoratorResult = Component ? reduceDecorators(decorators, route) : undefined;
    const WrappedComponent = Component && decoratorResult ? decoratorResult(Component) : undefined;
    return (
      <Route path={path} exact={exact} key={i}>
        {WrappedComponent && (
          <WrappedComponent
            party={party}
            products={products}
            activeProducts={activeProducts}
            productsMap={productsMap}
          />
        )}
        {subRoutes && Object.keys(subRoutes).length > 0 && (
          <React.Fragment>
            {buildRoutes(party, products, activeProducts, productsMap, decorators, subRoutes)}
          </React.Fragment>
        )}
      </Route>
    );
  });
