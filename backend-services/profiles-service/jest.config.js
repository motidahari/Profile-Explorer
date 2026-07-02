/** Jest config for the profiles-service. Selection of unit vs integration vs api
 *  suites is driven by --testPathPattern from the package.json test scripts. */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts', '**/*.integration-spec.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }],
  },
  moduleNameMapper: {
    '^@libs/shared$': '<rootDir>/../libs/core/shared/src/index.ts',
  },
  testEnvironment: 'node',
}
