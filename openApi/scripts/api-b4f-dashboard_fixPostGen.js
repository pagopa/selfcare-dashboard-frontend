const regexReplace = require('regex-replace');

regexReplace(
  '\\["x-selc-institutionId\\?"\\]: xSelcInstitutionId_',
  '["x-selc-institutionId"]: xSelcInstitutionId_',
  'src/api/generated/b4f-dashboard/client.ts',
  { fileContentsOnly: true }
);

regexReplace(
  '"x-selc-institutionId\\?": string;',
  '"x-selc-institutionId"?: string;',
  'src/api/generated/b4f-dashboard/client.ts',
  { fileContentsOnly: true }
);

regexReplace(
  '"x-selc-institutionId": xSelcInstitutionId_',
  '"x-selc-institutionId": xSelcInstitutionId_ ?? ""',
  'src/api/generated/b4f-dashboard/client.ts',
  { fileContentsOnly: true }
);
