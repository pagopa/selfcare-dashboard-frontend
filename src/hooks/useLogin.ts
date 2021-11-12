import isEmpty from 'lodash/isEmpty';
import { storageDelete, storageRead, storageWrite } from '../utils/storage-utils';
import { MOCK_USER, STORAGE_KEY_TOKEN, STORAGE_KEY_USER, URL_FE_LOGIN } from '../utils/constants';
import { useAppDispatch } from '../redux/hooks';
import { User } from '../model/User';
import { userActions } from '../redux/slices/userSlice';

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const setUser = (user: User) => dispatch(userActions.setLoggedUser(user));

  const attemptSilentLogin = async () => {
    if (MOCK_USER) {
      setUser({
        uid: '0',
        taxCode: 'AAAAAA00A00A000A',
        name: 'loggedName',
        surname: 'loggedSurname',
        email: 'loggedEmail@aa.aa',
      });
      storageWrite(STORAGE_KEY_TOKEN, 'DUMMY_TOKEN', 'string');
      return;
    }

    const sessionStorageUser = storageRead(STORAGE_KEY_USER, 'object');

    // If there are no credentials, it is impossible to get the user, so
    if (isEmpty(sessionStorageUser)) {
      // Remove any partial data that might have remained, just for safety
      storageDelete(STORAGE_KEY_USER);
      // Go to the login view
      window.location.assign(URL_FE_LOGIN);
      // This return is necessary
      return;
    }

    // Otherwise, set the user to the one stored in the storage
    setUser(sessionStorageUser);
  };

  return { attemptSilentLogin };
};
