const regexReplace = require('regex-replace');

console.log(`Fixing Swagger 2.0 schema array definition in ${process.argv[2]}`);

regexReplace(
  /"schema"\s*:\s*\{[^{]+\{\s*"\$ref"\s*:\s*"#\/definitions\/([^"]+)"[^,]+,\s+"type"\s*:\s*"array"[^}]+}((?:\n|.)*"definitions"\s*:\s*\{)/gms,
  '"schema":{"$ref":"#/definitions/$1Array"}$2"$1Array":{"type": "array", "items": {"$ref": "#/definitions/$1"}},',
  process.argv[2]
);
