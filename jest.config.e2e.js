const defaultConfig = require('./jest.config')
module.exports = Object.assign(defaultConfig, {
  roots: ['<rootDir>/tests/e2e'],
  testMatch: ['**/*.test.ts']
});
