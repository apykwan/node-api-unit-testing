import type { Config } from '@jest/types'

const baseDir = '<rootDir>/src/app/auth';
const baseTestDir = '<rootDir>/src/test/auth';

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
      // `${baseTestDir}/server_app2/**/*test.ts`,
      `${baseTestDir}/Utils.test.ts`
    ]
}

export default config;