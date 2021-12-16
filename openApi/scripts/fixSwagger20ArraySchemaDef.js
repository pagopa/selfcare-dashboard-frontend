const regexReplace = require('regex-replace');
const fs = require('fs');

console.log(`Fixing Swagger 2.0 schema array definition in ${process.argv[2]}`);

const filePath = process.argv[2];
const pattern =
  /"schema"\s*:\s*\{[^{]+\{\s*"\$ref"\s*:\s*"#\/definitions\/([^"]+)"[^,]+,\s+"type"\s*:\s*"array"[^}]+}((?:\n|.)*"definitions"\s*:\s*\{)/gm;

function fixArrayDef() {
  regexReplace(
    pattern,
    '"schema":{"$ref":"#/definitions/$1Array"}$2"$1Array":{"type": "array", "items": {"$ref": "#/definitions/$1"}},',
    filePath
  ).then((r) => {
    fs.readFile(filePath, 'utf8', function (err, doc) {
      if (doc.match(pattern)) {
        fixArrayDef();
      }
    });
  });
}

fixArrayDef();
