const { ESLint } = require('eslint');
const eslintConfig = require('./.eslintrc.js');

describe('ESLint Configuration', () => {
  let parsedConfig;

  beforeAll(async () => {
    const eslint = new ESLint({
      useEslintrc: true,
      overrideConfigFile: '.eslintrc.js'
    });
    const configs = await eslint.calculateConfigForFile('test.tsx');
    parsedConfig = {
      ...configs,
      overrides: configs.overrides || []
    };
  });

  test('should use TypeScript parser', () => {
    const hasTypeScriptParser = eslintConfig.parser === '@typescript-eslint/parser';
    expect(hasTypeScriptParser).toBe(true);
  });

  test('should use Next.js configuration', () => {
    const hasNextConfig = eslintConfig.extends.includes('next/core-web-vitals');
    expect(hasNextConfig).toBe(true);
  });

  test('should have required plugins', () => {
    const requiredPlugins = ['react', '@typescript-eslint'];
    const hasRequiredPlugins = requiredPlugins.every(plugin => eslintConfig.plugins.includes(plugin));
    expect(hasRequiredPlugins).toBe(true);
  });

  test('should have no-unused-vars rule', () => {
    const hasNoUnusedVarsRule = eslintConfig.rules['@typescript-eslint/no-unused-vars'] === 'error';
    expect(hasNoUnusedVarsRule).toBe(true);
  });
});