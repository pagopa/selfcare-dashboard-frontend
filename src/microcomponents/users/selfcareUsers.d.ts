// eslint-disable-next-line spaced-comment
/// <reference types="react" />

declare module 'selfcareUsers/RoutingProductUsers' {
  type Props = import('../dashboardMicrocomponentsUtils').DashboardMicrofrontendPageProps & {
    CONFIG: typeof import('@pagopa/selfcare-common-frontend/lib/config/env').CONFIG;
  };

  const RoutingProductUsers: React.ComponentType<Props>;

  export default RoutingProductUsers;
}

declare module 'selfcareUsers/RoutingUsers' {
  type Props = import('../dashboardMicrocomponentsUtils').DashboardMicrofrontendPageProps & {
    CONFIG: typeof import('@pagopa/selfcare-common-frontend/lib/config/env').CONFIG;
  };

  const RoutingUsers: React.ComponentType<Props>;

  export default RoutingUsers;
}
