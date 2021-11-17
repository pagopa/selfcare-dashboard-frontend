import { RequestParams } from '@pagopa/ts-commons/lib/requests';
import { OnBoardingInfo } from '../generated/party-process/OnBoardingInfo';
import { GetOnBoardingInfoT } from '../generated/party-process/requestTypes';

export const mockedOnBoardingInfo = {
  person: {
    name: 'MOCKED NAME',
    surname: 'MOCKED SURNAME',
    taxCode: 'AAAAAA00A00A000A',
  },
  institutions: [
    {
      role: 'OPERATOR',
      description: 'Comune di Bari',
      state: 'ACTIVE',
      institutionId: '1',
      attributes: [],
      digitalAddress: 'address',
      platformRole: 'ADMIN_REF',
    },
    {
      role: 'MANAGER',
      description: 'Comune di Milano',
      state: 'PENDING',
      institutionId: '2',
      attributes: [],
      digitalAddress: '',
      platformRole: 'ADMIN_REF',
    },
  ],
};

export const PartyProcessApi = {
  getOnBoardingInfo: async (
    _request: RequestParams<GetOnBoardingInfoT> = {}
  ): Promise<OnBoardingInfo> => new Promise((resolve) => resolve(mockedOnBoardingInfo)),
};
