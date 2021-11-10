import { User } from '../../model/User';
import { useAppDispatch } from '../../redux/hooks';
import { userActions } from '../../redux/slices/userSlice';
import { RootState } from '../../redux/store';

export const mockedUser: User = {
  name: 'NAME',
  surname: 'SURNAME',
  uid: 'UID',
  taxCode: 'AAAAAA00A00A000A',
  email: 'a@a.aa',
};

export const verifyMockExecution = (state: RootState) => {
  expect(state.user.logged).toMatchObject(mockedUser);
};

export default (WrappedComponent: React.ComponentType<any>) => () => {
  useAppDispatch()(userActions.setLoggedUser(mockedUser));
  return <WrappedComponent />;
};
