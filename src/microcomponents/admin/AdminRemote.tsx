import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import { useHistory } from 'react-router-dom';
import RemoteRoutingAdmin from './RemoteRoutingAdmin';

/** Admin remote wired with the host history, store, theme and i18n. */
const AdminRemote = () => {
  const theme = useTheme();
  const store = useStore();
  const { i18n } = useTranslation();
  const history = useHistory();

  return <RemoteRoutingAdmin history={history} store={store} theme={theme} i18n={i18n} />;
};

export default AdminRemote;
