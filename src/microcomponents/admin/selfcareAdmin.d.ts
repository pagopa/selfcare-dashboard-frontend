// eslint-disable-next-line spaced-comment
/// <reference types="react" />

declare module 'selfcareAdmin/RoutingAdmin' {
  type Props = import('../dashboardMicrocomponentsUtils').DashboardAdminMicrofrontendProps & {
    CONFIG: typeof import('@pagopa/selfcare-common-frontend/lib/config/env').CONFIG;
  };

  const RoutingAdmin: React.ComponentType<Props>;

  export default RoutingAdmin;
}
