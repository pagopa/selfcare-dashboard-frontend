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

declare module 'selfcareGroups/RoutingGroups' {
  const RoutingGroups: React.ComponentType<Props>;

  export default RoutingGroups;
}
