import { createRequire } from 'module';
const require = createRequire(import.meta.url);
try {
    const resolved = require.resolve('@pagopa/selfcare-common-frontend/package.json');
    console.log('Success:', resolved);
} catch (e) {
    console.log('Error resolving package.json:', e.message);
}
