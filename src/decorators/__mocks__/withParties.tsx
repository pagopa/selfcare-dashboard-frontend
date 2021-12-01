import { useEffect } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { partiesActions } from '../../redux/slices/partiesSlice';
import { RootState } from '../../redux/store';
import { mockedParties } from '../../services/__mocks__/partyService';

export const verifyMockExecution = (state: RootState) => {
  expect(state.parties.list).toMatchObject(mockedParties);
};

export default (WrappedComponent: React.ComponentType<any>) => () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(partiesActions.setPartiesList(mockedParties));
  }, []);
  return <WrappedComponent />;
};
