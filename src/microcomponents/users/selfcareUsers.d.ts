// eslint-disable-next-line spaced-comment
/// <reference types="react" />

type Props = {
  history: any;
  store: any;
  theme: any;
  i18n: any;
  decorators: any;
  party: any;
  products: any;
  activeProducts: any;
  productsMap: any;
  CONFIG: any;
};

declare module 'selfcareUsers/RoutingProductUsers' {
  const RoutingProductUsers: React.ComponentType<Props>;

  export default RoutingProductUsers;
}

declare module 'selfcareUsers/RoutingUsers' {
  const RoutingUsers: React.ComponentType<Props>;

  export default RoutingUsers;
}
