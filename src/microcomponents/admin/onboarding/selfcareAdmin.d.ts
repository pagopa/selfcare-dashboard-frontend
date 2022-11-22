// eslint-disable-next-line spaced-comment
/// <reference types="react" />

type Props = {
  history: any;
  store: any;
  theme: any;
  i18n: any;
  decorators: any;
  CONFIG: any;
};

declare module 'selfcareAdmin/RoutingAdmin' {
  const RoutingAdmin: React.ComponentType<any>;

  export default RoutingAdmin;
}
