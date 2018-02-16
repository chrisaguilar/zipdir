const path = require('path');

const tsConfig = require('../tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');

const baseUrl = path.join(__dirname, '..');

require('ts-node').register({
    cache: true,
    cacheDirectory: path.join(__dirname, '../node_modules/.cache/ts-node'),
    typeCheck: true,
    compilerOptions: {
        ...tsConfig.compilerOptions,
        module: 'commonjs',
        target: 'es5'
    },
    project: path.join(__dirname, '../tsconfig.json')
});

require('tsconfig-paths').register({
    baseUrl,
    paths: tsConfig.compilerOptions.paths
});
