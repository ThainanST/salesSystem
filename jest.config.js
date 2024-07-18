/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^sinon$': '<rootDir>/node_modules/sinon/pkg/sinon.js',
  },
};