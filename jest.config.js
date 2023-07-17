export default {
    collectCoverage: true,
    coverageReporters: ['json'],
    transform: {},
    moduleDirectories: [
        "node_modules",
        "src"
    ],
    roots: ['src'],
    testEnvironment: 'node',
}