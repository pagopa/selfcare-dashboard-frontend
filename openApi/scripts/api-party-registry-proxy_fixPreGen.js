import regexReplace from 'regex-replace';

regexReplace(
  /("format": *"uri",[\s]*"type": "string")/gi,
  '"$ref": "#/definitions/STRINGWrapper"',
  'openApi/generated-party-registry-proxy/party-registry-proxy-swagger20.json',
  { fileContentsOnly: true }
);
