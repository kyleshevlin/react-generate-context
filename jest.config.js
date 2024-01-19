/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  passWithNoTests: true,
  testPathIgnorePatterns: ['/dist', '/node_modules'],
}
