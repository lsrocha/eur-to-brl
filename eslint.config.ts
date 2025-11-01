import js from '@eslint/js'
import jest from 'eslint-plugin-jest'
import tseslint from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.test.ts'],
    ...jest.configs['flat/recommended'],
  },
]
