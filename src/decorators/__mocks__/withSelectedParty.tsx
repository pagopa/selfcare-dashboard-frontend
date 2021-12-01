import { useEffect } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { partiesActions } from '../../redux/slices/partiesSlice';
import { RootState } from '../../redux/store';
import { mockedParties } from '../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../services/__mocks__/productService';

export const verifyMockExecution = (state: RootState) => {
  expect(state.parties.selected).toMatchObject(mockedParties[0]);
};

export default (WrappedComponent: React.ComponentType<any>) => () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(partiesActions.setPartySelected(mockedParties[0]));
    dispatch(partiesActions.setPartySelectedProducts(mockedPartyProducts));
  }, []);
  return <WrappedComponent />;
};
