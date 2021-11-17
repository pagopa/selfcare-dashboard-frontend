import { InstitutionResource } from '../../api/generated/b4f-dashboard/InstitutionResource';
import { InstitutionInfo } from '../../api/generated/party-process/InstitutionInfo';
import { institutionInfo2Party, institutionResource2Party } from '../Party';

test('Test institutionInfo2Party', () => {
  const institutionInfo: InstitutionInfo = {
    role: 'MANAGER',
    description: 'Comune di Bari',
    state: 'PENDING',
    institutionId: '1',
    attributes: ['Ente locale'],
    digitalAddress: 'address',
    platformRole: 'ADMIN_REF',
  };

  const party = institutionInfo2Party(institutionInfo);
  expect(party).toStrictEqual({
    role: 'MANAGER',
    description: 'Comune di Bari',
    status: 'PENDING',
    institutionId: '1',
    digitalAddress: 'address',
    platformRole: 'ADMIN_REF',
    category: 'Ente locale',
    urlLogo: 'https://selcdcheckoutsa.z6.web.core.windows.net/institutions/1/logo.png',
  });
});

test('Test institutionResource2Party', () => {
  const institutionResource: InstitutionResource = {
    name: 'Comune di Bari',
    status: 'PENDING',
    id: '1',
    category: 'Ente locale',
    mailAddress: 'address',
    fiscalCode: 'fiscalCode',
    IPACode: 'IPACode',
    userRole: 'OPERATOR',
    // platformRole: 'ADMIN_REF' TODO model to update
  };

  const party = institutionResource2Party(institutionResource);
  expect(party).toStrictEqual({
    role: 'OPERATOR',
    description: 'Comune di Bari',
    status: 'PENDING',
    institutionId: '1',
    digitalAddress: 'address',
    platformRole: 'ADMIN_REF',
    category: 'Ente locale',
    urlLogo: 'https://selcdcheckoutsa.z6.web.core.windows.net/institutions/1/logo.png',
  });
});
