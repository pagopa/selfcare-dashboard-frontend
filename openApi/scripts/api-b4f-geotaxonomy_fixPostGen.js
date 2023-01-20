const regexReplace = require('regex-replace');

regexReplace('array', 'Array<string>', 'src/api/generated/b4f-geotaxonomy/requestTypes.ts', {
  fileContentsOnly: true,
});
