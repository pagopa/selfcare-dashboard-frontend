import isEmpty from 'lodash/isEmpty';
import { storageDelete, storageRead, storageWrite } from '../utils/storage-utils';
import { MOCK_USER, STORAGE_KEY_TOKEN, STORAGE_KEY_USER, URL_FE_LOGIN } from '../utils/constants';
import { useAppDispatch } from '../redux/hooks';
import { User } from '../model/User';
import { userActions } from '../redux/slices/userSlice';

const testToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZ1cmlvdml0YWxlQG1hcnRpbm8uaXQiLCJmYW1pbHlfbmFtZSI6IlNhcnRvcmkiLCJmaXNjYWxfbnVtYmVyIjoiU1JUTkxNMDlUMDZHNjM1UyIsIm5hbWUiOiJBbnNlbG1vIiwiZnJvbV9hYSI6ZmFsc2UsImxldmVsIjoiTDIiLCJpYXQiOjE2MzgzODcyNjUsImV4cCI6MTYzODM5MDg2NSwiaXNzIjoiU1BJRCIsImp0aSI6IjAxRk5WUVZCRzI3TThFMDZNTUUwUDgxVDEzIn0.N4-vqpoBhuLmgc8ALGYfxT9OI-st7pYkybpXqSHfeLWLeTOlMGIRvq-oPl6h2fHYbU73sKECSMbjSCLFXAvxpU9cQrDJ3pQOMq8zojzZvM8VADY_JPXiImvxLHznLtDLR_Be1H03zredzZc1-JfckC5s0aJXT18rdghJgUGGlDL1RKJDLnXn-TZrDRACjCTmiqF-fpqaB-Jqp3h28d5iLeqearU-mzDe_Bm5h7a5j-A-x-bmFcMwV_o2c9tHA8lWZEN0SSW8L9oami-rSVHKBahSteRDzlCWfOVcQlW9kvqJV9Hsu-Alo6ZOYTCfIsJWjA_Fwr5uIqsKEQriBfaQmg';

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
      storageWrite(STORAGE_KEY_TOKEN, testToken, 'string');
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
