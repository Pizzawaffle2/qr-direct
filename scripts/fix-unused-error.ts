// scripts/fix-unused-error.ts
import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';

async function fixUnusedError() {
  try {
    // Find all TypeScript files
    const files = await glob('src/**/*.{ts,tsx}');

    for (const file of files) {
      const content = await readFile(file, 'utf8');
      
      // Replace catch(error) with catch(_error) where error is not used
      const newContent = content.replace(
        /catch\s*\(\s*error\s*\)\s*{(?![^}]*error)/g,
        'catch (_error) {'
      );

      if (content !== newContent) {
        await writeFile(file, newContent);
        console.log(`Updated ${file}`);
      }
    }
  } catch (error) {
    console.error('Failed to fix files:', error);
  }
}

fixUnusedError();