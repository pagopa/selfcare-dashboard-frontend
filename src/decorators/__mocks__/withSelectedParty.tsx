import { useAppDispatch } from '../../redux/hooks';
import { partiesActions } from '../../redux/slices/partiesSlice';
import { RootState } from '../../redux/store';
import { mockedParties } from '../../services/__mocks__/partyService';

export const verifyMockExecution = (state: RootState) => {
  expect(state.parties.selected).toMatchObject(mockedParties[0]);
};

export default (WrappedComponent: React.ComponentType<any>) => () => {
  useAppDispatch()(partiesActions.setPartySelected(mockedParties[0]));
  return <WrappedComponent />;
};
