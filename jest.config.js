const path = require('path');

module.exports = {
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.jsx?$': 'babel-jest'
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: { '^~zipdir': '<rootDir>/src' },
    collectCoverage: true,
    coverageDirectory: path.join(__dirname, 'coverage'),
    coverageReporters: ['json', 'lcov', 'text'],
    coveragePathIgnorePatterns: ['/node_modules/'],
    notify: false,
    testEnvironment: 'node',
    globals: { 'ts-jest': { useBabelrc: true } }
};
