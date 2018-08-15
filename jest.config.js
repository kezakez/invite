module.exports = {
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
  },
  testPathIgnorePatterns: ['dist/'],
  testMatch: ['**/?(*.)(spec|test).(js|jsx|ts|tsx)'],
  testEnvironment: 'node',
};
