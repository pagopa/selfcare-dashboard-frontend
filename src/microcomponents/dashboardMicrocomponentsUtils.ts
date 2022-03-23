import { Theme } from '@mui/material';
import { createStore } from '../redux/store';

export type MicroComponentsProps = {
  history: History;
  theme: Theme;
  store: ReturnType<typeof createStore>;
};
