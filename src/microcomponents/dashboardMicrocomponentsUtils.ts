import { Theme } from '@mui/material';
import { History } from 'history';
import { createStore } from '../redux/store';

export type MicroComponentsProps = {
  history: History;
  theme: Theme;
  store: ReturnType<typeof createStore>;
};
