export default {
    collectCoverage: true,
    coverageReporters: ['json'],
    moduleDirectories: [
        "node_modules",
        "src"
    ],
    roots: ['src'],
    testEnvironment: 'node',
}