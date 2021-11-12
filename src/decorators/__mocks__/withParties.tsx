import { Party } from '../../model/Party';
import { useAppDispatch } from '../../redux/hooks';
import { partiesActions } from '../../redux/slices/partiesSlice';
import { RootState } from '../../redux/store';

export const mockedParties: Array<Party> = [
  {
    role: 'Manager',
    description: 'Comune di Bari',
    urlLogo: 'image',
    status: 'Pending',
    institutionId: '1',
    attributes: [],
    digitalAddress: '',
    platformRole: 'admin',
  },
  {
    role: 'Manager',
    description: 'Comune di Milano',
    urlLogo: 'image',
    status: 'Pending',
    institutionId: '2',
    attributes: [],
    digitalAddress: '',
    platformRole: 'admin',
  },
  {
    role: 'Manager',
    description: 'Comune di Roma',
    urlLogo: 'image',
    status: 'Active',
    institutionId: '3',
    attributes: [],
    digitalAddress: '',
    platformRole: 'admin',
  },
  {
    role: 'Manager',
    description: 'Comune di Napoli',
    urlLogo: 'image',
    status: 'Active',
    institutionId: '4',
    attributes: [],
    digitalAddress: '',
    platformRole: 'admin',
  },
];

export const verifyMockExecution = (state: RootState) => {
  expect(state.parties.list).toMatchObject(mockedParties);
};

export default (WrappedComponent: React.ComponentType<any>) => () => {
  useAppDispatch()(partiesActions.setPartiesList(mockedParties));
  return <WrappedComponent />;
};
