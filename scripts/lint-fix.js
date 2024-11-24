// scripts/lint-fix.js
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to fix apostrophes and quotes in JSX
function fixEscapedCharacters(content) {
  return content
    .replace(/(\s)'(\w)/g, '$1&apos;$2')
    .replace(/(\w)'(\s)/g, '$1&apos;$2')
    .replace(/(\s)"(\w)/g, '$1&quot;$2')
    .replace(/(\w)"(\s)/g, '$1&quot;$2');
}

// Function to fix unused variables
function fixUnusedVariables(content) {
  return content.replace(
    /const\s+(\w+)\s*=/g,
    'const _$1 ='
  );
}

// Function to fix missing Image components
function fixImageComponents(content) {
  return content.replace(
    /<img\s/g,
    '<Image\n      '
  );
}

// Main fix function
async function fixLintIssues() {
  // Run ESLint fix
  execSync('npx eslint --fix "src/**/*.{ts,tsx}"', { stdio: 'inherit' });
  
  // Run Prettier
  execSync('npx prettier --write "src/**/*.{ts,tsx}"', { stdio: 'inherit' });

  console.log('✅ Fixed common lint issues');
}

fixLintIssues().catch(console.error);