// scripts/cleanup.ts
import fs from 'fs';
import path from 'path';

const filesToRemove = [
  // Test files
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/*.spec.ts',
  '**/*.spec.tsx',
  
  // Development configurations
  '.env.development',
  '.env.local',
  
  // Development utilities
  'src/utils/mock-data/**/*',
  'src/utils/test-helpers/**/*',
  
  // Documentation
  'docs/**/*',
  
  // Development scripts
  'scripts/dev/**/*',
  
  // Source maps in production
  '**/*.js.map',
  
  // Test configurations
  'jest.config.js',
  'cypress/**/*',
  
  // Development dependencies from package.json
  // (handled separately)
];

const devDependenciesToRemove = [
  '@types/*',
  'jest',
  'cypress',
  'eslint',
  'prettier',
  // Add other dev dependencies
];

function cleanup() {
  console.log('Starting production cleanup...');
  
  // Remove development files
  filesToRemove.forEach(pattern => {
    // Implementation of file removal
  });
  
  // Update package.json
  const packagePath = path.join(process.cwd(), 'package.json');
  const package = require(packagePath);
  
  devDependenciesToRemove.forEach(dep => {
    delete package.devDependencies[dep];
  });
  
  fs.writeFileSync(packagePath, JSON.stringify(package, null, 2));
  
  console.log('Cleanup complete!');
}

cleanup();