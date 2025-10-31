import { createDefaultEsmPreset } from 'ts-jest'

const preset = createDefaultEsmPreset({
  tsconfig: 'tsconfig.json',
})

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  ...preset,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
}
