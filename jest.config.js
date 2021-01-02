module.exports = {
    preset: 'ts-jest',
    roots: ['src', 'spec'],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    coverageThreshold: {
        global: {
            branches: 20,
            functions: 20,
            lines: 20,
            statements: 20,
        },
    },
    collectCoverageFrom: [
        'src/**/*.ts',
        '!**/node_modules/**',
        '!**/vendor/**',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
};
