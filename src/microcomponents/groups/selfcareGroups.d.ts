// eslint-disable-next-line spaced-comment
/// <reference types="react" />

type Props = {
  history: any;
  decorators: DashboardDecoratorsType;
} & DashboardPageProps;

declare module 'selfcareGroups/RoutingGroups' {
  const RoutingGroups: React.ComponentType<DashboardMicrofrontendPageProps>;

  export default RoutingGroups;
}
