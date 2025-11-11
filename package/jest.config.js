const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/lib/**/*.{ts,tsx}',
    'src/components/**/*.{ts,tsx}',
    'src/app/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/**/layout.tsx',
    '!src/**/loading.tsx',
    '!src/**/page.tsx',
    '!src/lib/db/schema.ts',
    '!src/lib/db/index.ts',
    '!src/utils/**',
    '!src/sentry.*.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 80,
      functions: 80,
      lines: 90,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
