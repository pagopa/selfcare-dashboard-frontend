const regexReplace = require('regex-replace');

regexReplace(
  'readonly sort\\?: array;',
  'readonly sort?: Array<string>;',
  'src/api/generated/b4f-dashboard/requestTypes.ts',
  { fileContentsOnly: true }
);

regexReplace(
  /("format": *"uri",[\s]*"type": "string")/gi,
  '"$ref": "#/definitions/STRINGWrapper"',
  'openApi/generated/dashboard-swagger20.json',
  { fileContentsOnly: true }
);

regexReplace(
  /("type": *"string",[\s]*"format": "uri")/gi,
  '"type": "string"',
  'openApi/dashboard-api-docs.json',
  {
    fileContentsOnly: true,
  }
);
