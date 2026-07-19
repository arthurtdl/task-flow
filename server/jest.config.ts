export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    testMatch: ['**/*.spec.ts', '**/*.test.ts'],
    moduleNameMapper: {
    '^@database$': '<rootDir>/src/database',
  },
}