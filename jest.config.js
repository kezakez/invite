module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  testPathIgnorePatterns: ['dist/'],
  testMatch: ['**/?(*.)(spec|test).(js|jsx|ts|tsx)'],
  testEnvironment: 'node',
};
