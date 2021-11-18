const regexReplace = require('regex-replace');

regexReplace(
  '"Content-Type": "multipart/form-data"',
  '// "Content-Type": "multipart/form-data", TODO manually fixed',
  'src/api/generated/b4f-dashboard/client.ts',
  { fileContentsOnly: true }
);
regexReplace(
  'logo.uri',
  '{const formData = new FormData(); formData.append("logo", logo); return formData; }, // TODO manually fixed',
  'src/api/generated/b4f-dashboard/client.ts',
  { fileContentsOnly: true }
);
regexReplace(
  'readonly logo: string',
  'readonly logo: File // TODO manually fixed',
  'src/api/generated/b4f-dashboard/requestTypes.ts',
  { fileContentsOnly: true }
);
regexReplace(
  '"Content-Type" \\| "Authorization",',
  '"Authorization", // TODO manually fixed',
  'src/api/generated/b4f-dashboard/requestTypes.ts',
  { fileContentsOnly: true }
);
regexReplace(
  'RequestParams<SaveInstitutionLogoUsingPUTT>\\s+> = \\{\\s+method: "put",\\n',
  '$&// @ts-ignore',
  'src/api/generated/b4f-dashboard/client.ts',
  { fileContentsOnly: true }
);
