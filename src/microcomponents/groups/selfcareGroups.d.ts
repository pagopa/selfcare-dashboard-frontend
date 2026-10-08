// eslint-disable-next-line spaced-comment
/// <reference types="react" />

declare module 'selfcareGroups/RoutingGroups' {
  type Props = import('../dashboardMicrocomponentsUtils').DashboardMicrofrontendPageProps & {
    CONFIG: typeof import('@pagopa/selfcare-common-frontend/lib/config/env').CONFIG;
  };

  const RoutingGroups: React.ComponentType<Props>;

  export default RoutingGroups;
}
