// scripts/fix-eslint-errors.ts
import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';

async function fixEslintErrors() {
  try {
    const files = await glob('src/**/*.{ts,tsx}');

    for (const file of files) {
      let content = await readFile(file, 'utf8');

      // Fix unused variables in catch blocks
      content = content.replace(
        /catch\s*\(\s*error\s*\)\s*{(?![^}]*error)/g,
        'catch (_error) {'
      );

      // Fix unused parameters
      content = content.replace(
        /\(\s*(\w+)\s*:\s*[^)]+\)\s*=>\s*{(?![^}]*\1)/g,
        '(_$1) => {'
      );

      // Fix unescaped entities in JSX only
      content = content.replace(
        /(<[^>]*>)([^<]*)'([^']*)'([^<]*<\/[^>]*>)/g,
        (match, openTag, before, quote, after) => 
          `${openTag}${before}&apos;${quote}&apos;${after}`
      );

      // Prefix unused imports
      content = content.replace(
        /import\s*{\s*([^}]+)}\s*from/g,
        (match, imports) => {
          interface _ImportItem {
            trimmed: string;
            original: string;
          }

          const fixed = imports.split(',').map((imp: string): string => {
            const trimmed: string = imp.trim();
            if (!content.includes(trimmed)) {
              return ` _${trimmed}`;
            }
            return imp;
          }).join(',');
          return `import {${fixed}} from`;
        }
      );

      if (content !== await readFile(file, 'utf8')) {
        await writeFile(file, content);
        console.log(`Fixed ${file}`);
      }
    }
  } catch (error) {
    console.error('Error fixing files:', error);
  }
}

fixEslintErrors();