export default {
    collectCoverage: true,
    coverageReporters: ['json', 'lcov'],
    moduleDirectories: [
        "node_modules"
    ],
    //   roots: ['src'],
    resetMocks: true,
    testEnvironment: 'node',
};