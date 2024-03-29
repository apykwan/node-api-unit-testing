import type { Config } from '@jest/types'

const baseDir = '<rootDir>/src/app/';
const baseTestDir = '<rootDir>/src/test';
const baseTestDir2 = '<rootDir>/src/test2';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    `${baseDir}/**/*.ts`
  ],
  testMatch:[
    `${baseTestDir}/**/*test.ts`,
    `${baseTestDir2}/**/*test.ts`,
  ],
  setupFiles: [
    '<rootDir>/src/test_integration/utils/config.ts'
  ]
}

export default config;