import { Theme } from '@mui/material';
import { History } from 'history';
import { i18n } from 'i18next';
import { DashboardDecoratorsType, DashboardPageProps } from '../pages/dashboard/Dashboard';
import { createStore } from '../redux/store';

export type MicroComponentsProps = {
  history: History;
  theme: Theme;
  store: ReturnType<typeof createStore>;
  i18n: i18n;
};

export type DashboardAdminMicrofrontendProps = {
  decorators?: DashboardDecoratorsType;
} & MicroComponentsProps;

export type DashboardMicrofrontendPageProps = {
  decorators?: DashboardDecoratorsType;
} & DashboardPageProps &
  MicroComponentsProps;
