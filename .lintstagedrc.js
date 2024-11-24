module.exports = {
  // Lint TS and TSX files
  '**/*.(ts|tsx)': () => 'yarn tsc --noEmit',

  // Lint & Prettify TS and TSX files
  '**/*.(ts|tsx|js)': (filenames) => [
    `yarn eslint ${filenames.join(' ')}`,
    `yarn prettier --write ${filenames.join(' ')}`,
  ],

  // Prettify only JSON and Markdown files
  '**/*.(json|md)': (filenames) =>
    `yarn prettier --write ${filenames.join(' ')}`,
};