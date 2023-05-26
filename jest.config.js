/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-node',
};
