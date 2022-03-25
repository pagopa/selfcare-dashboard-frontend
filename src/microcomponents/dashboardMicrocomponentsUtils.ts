import { Theme } from '@mui/material';
import { History } from 'history';
import { DashboardDecoratorsType, DashboardPageProps } from '../pages/dashboard/Dashboard';
import { createStore } from '../redux/store';

export type MicroComponentsProps = {
  history: History;
  theme: Theme;
  store: ReturnType<typeof createStore>;
};

export type DashboardMicrofrontendPageProps = {
  decorators: DashboardDecoratorsType;
} & DashboardPageProps &
  MicroComponentsProps;
