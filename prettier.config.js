/** @type {import('prettier').Config} */

module.exports = {
    printWidth: 100,
    endOfLine: 'crlf',
    semi: false,
    singleQuote: true,
    tabWidth: 3,
    trailingComma: 'es5',
    jsxSingleQuote: true,
    bracketSameLine: true,
    arrowParens: 'always',
    singleAttributePerLine: true,
    importOrder: [
        '^(react/(.*)$)|^(react$)',
        '^(next/(.*)$)|^(next$)',
        '<THIRD_PARTY_MODULES>',
        '^@backend/(.*)$',
        '^@shared/(.*)$',
        '^types$',
        '^@/types/(.*)$',
        '',
        '^@/components/(.*)$',
        '^@/app/(.*)$',
        '^[.]',
    ],
    importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
    plugins: ['@ianvs/prettier-plugin-sort-imports'],
}
