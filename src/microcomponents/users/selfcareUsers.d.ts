// eslint-disable-next-line spaced-comment
/// <reference types="react" />

type Props = {
  history: any;
  decorators: DashboardDecoratorsType;
} & DashboardPageProps;

declare module 'selfcareUsers/RoutingProductUsers' {
  const RoutingProductUsers: React.ComponentType<Props>;

  export default RoutingProductUsers;
}

declare module 'selfcareUsers/RoutingUsers' {
  const RoutingUsers: React.ComponentType<Props>;

  export default RoutingUsers;
}
