import { InstitutionResource } from '../../api/generated/b4f-dashboard/InstitutionResource';
import { InstitutionInfo } from '../../api/generated/party-process/InstitutionInfo';
import { institutionInfo2Party, institutionResource2Party } from '../Party';

test('Test institutionInfo2Party', () => {
  const institutionInfo: InstitutionInfo = {
    role: 'Manager',
    description: 'Comune di Bari',
    status: 'Pending',
    institutionId: '1',
    attributes: ['Ente locale'],
    digitalAddress: 'address',
    platformRole: 'admin',
  };

  const party = institutionInfo2Party(institutionInfo);
  expect(party).toStrictEqual({
    role: 'Manager',
    description: 'Comune di Bari',
    status: 'Pending',
    institutionId: '1',
    digitalAddress: 'address',
    platformRole: 'admin',
    category: 'Ente locale',
    urlLogo: 'https://selcdcheckoutsa.z6.web.core.windows.net/institutions/1/logo.png',
  });
});

test('Test institutionResource2Party', () => {
  const institutionResource: InstitutionResource = {
    name: 'Comune di Bari',
    status: 'Pending',
    id: '1',
    category: 'Ente locale',
    mailAddress: 'address',
    fiscalCode: 'fiscalCode',
    IPACode: 'IPACode',
    userRole: 'Operator',
    // platformRole: 'admin' TODO model to update
  };

  const party = institutionResource2Party(institutionResource);
  expect(party).toStrictEqual({
    role: 'Operator',
    description: 'Comune di Bari',
    status: 'Pending',
    institutionId: '1',
    digitalAddress: 'address',
    platformRole: 'admin',
    category: 'Ente locale',
    urlLogo: 'https://selcdcheckoutsa.z6.web.core.windows.net/institutions/1/logo.png',
  });
});
