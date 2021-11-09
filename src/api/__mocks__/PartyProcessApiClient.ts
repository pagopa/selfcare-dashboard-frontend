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
      role: 'Manager',
      description: 'Comune di Bari',
      status: 'Pending',
      institutionId: '1',
      attributes: [],
      digitalAddress: '',
      platformRole: 'admin',
    },
    {
      role: 'Manager',
      description: 'Comune di Milano',
      status: 'Pending',
      institutionId: '2',
      attributes: [],
      digitalAddress: '',
      platformRole: 'admin',
    },
  ],
};

export const PartyProcessApi = {
  getOnBoardingInfo: async (
    _request: RequestParams<GetOnBoardingInfoT> = {}
  ): Promise<OnBoardingInfo> => new Promise((resolve) => resolve(mockedOnBoardingInfo)),
};
