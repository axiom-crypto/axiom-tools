// Functions that are to be run after the typescript compiler runs

const fs = require('fs');
const packageJson = require('../package.json');

// Copies a modified version of package.json to the /dist folder
function copyPackageJson() {
  const packageJsonCopy = { ...packageJson };
  delete packageJsonCopy.scripts;
  delete packageJsonCopy.devDependencies;
  delete packageJsonCopy.publishConfig;
  fs.writeFileSync('./dist/package.json', JSON.stringify(packageJsonCopy, null, 2));
}

function writeCjsEsmPackageJson() {
  const cjsPackageJson = {
    "type": "commonjs",
  };
  const esmPackageJson = {
    "type": "module",
  };
  fs.writeFileSync('./dist/cjs/package.json', JSON.stringify(cjsPackageJson, null, 2));
  fs.writeFileSync('./dist/esm/package.json', JSON.stringify(esmPackageJson, null, 2));
}

function copyReadme() {
  fs.copyFileSync('./readme.md', './dist/readme.md');
}

function copyCircuitJson() {
  fs.copyFileSync('./src/constants/v2/circuit.json', './dist/constants/v2/circuit.json');
}

copyPackageJson();
copyReadme();
copyCircuitJson();
// writeCjsEsmPackageJson();
