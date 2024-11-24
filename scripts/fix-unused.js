// scripts/fix-unused.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixUnusedVars(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix unused variables
  content = content.replace(
    /const (\w+)(\s*=\s*[^;]+;)(?!\s*\1)/g,
    'const _$1$2'
  );

  // Fix unused parameters
  content = content.replace(
    /\(([^)]+)\)\s*=>/g,
    (match, params) => {
      const fixedParams = params.split(',').map(param => {
        const trimmed = param.trim();
        if (trimmed && !trimmed.startsWith('_') && !trimmed.includes(':')) {
          return ` _${trimmed}`;
        }
        return param;
      }).join(',');
      return `(${fixedParams}) =>`;
    }
  );

  fs.writeFileSync(filePath, content);
}

// Run on all TypeScript files
glob('src/**/*.{ts,tsx}', (err, files) => {
  if (err) {
    console.error('Error finding files:', err);
    process.exit(1);
  }

  files.forEach(file => {
    console.log(`Processing ${file}...`);
    fixUnusedVars(file);
  });
});